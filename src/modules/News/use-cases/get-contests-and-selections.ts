import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { GetContestAndSelections } from "../domain/use-cases/get-contests-and-selections";
import browserOptions from "../../../main/config/puppeteer";

export class ShowContestsAndSelectionsUseCase {
  private scrapper: PuppeteerAdapter;
  private _url: string =
    "`https://www.ufc.br/noticias/noticias-e-editais-de-concursos-e-selecoes?start=";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  async execute(
    request: GetContestAndSelections.Request
  ): Promise<Either<Error, GetContestAndSelections.Response>> {
    const { pageNumber, title } = request;

    try {
      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      console.log(this._url + pageNumber);

      await this.scrapper.navigateToUrl(
        this._url + pageNumber,
        timeoutToRequest
      );

      //Se passar title significa que irá pesquisar apenas por título
      //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
      if (title) {
        //#limit -> botão select de quantidade de dados que irá ser exibido
        await this.scrapper.waitForElement("#adminForm"); //Formulário com filtros de título e exibição

        await this.scrapper.pageEvaluate((text: string) => {
          const selectInput = <HTMLSelectElement>(
            document.querySelector("#limit")
          );

          const filtersOptions = Array.from(...[selectInput?.options]);

          //Definir o filtro de exibição para TUDO
          filtersOptions.forEach((option, index) => {
            if (option.value === "0") {
              const selectElement = <HTMLSelectElement>(
                document.querySelector("#limit")
              );
              //Definir o filtro de exibição para "TUDO"
              selectElement.selectedIndex = index;
            }
          });

          const filter = <HTMLInputElement>(
            document.querySelector(".filters > .filter-search > #filter-search")
          );

          if (filter) {
            filter.value = text;

            const doc = document as Document & { adminForm?: HTMLFormElement };
            //Chama o evento de submit na página
            doc?.adminForm?.submit();
          }
        }, title);
        //Espera a página recarregar pois ao fazer o submit irá recarregar a página
        await this.scrapper.waitForNavigation({
          timeout: 10000,
          waitUntil: ["domcontentloaded"],
        });
      }

      const listras = await this.scrapper.getElementHandler(".listras");

      if (!listras) {
        return left(
          new Error(
            "Não foi possível carregar notícias de Editar de Concursos e Seleções"
          )
        );
      }

      const links = await this.scrapper.elementsEvaluate(
        "tr",
        async (rows) => {
          const result = [];
          for (const row of rows) {
            const newsAnchor = row
              .querySelector(".list-title")
              ?.querySelector("a");

            if (newsAnchor) {
              const link = newsAnchor.href;
              const text = newsAnchor?.textContent?.trim() || null;

              const date =
                row.querySelector(".list-date")?.textContent?.trim() || null;

              result.push({
                text,
                link,
                date,
              });
            }
          }
          return result;
        },
        listras
      );

      await this.scrapper.closeBrowser();

      return right(links);
    } catch (error) {
      console.error(`❌ [ERROR] : ShowContestsAndSelectionsUseCase : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
