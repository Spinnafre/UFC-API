import browserOptions from "../../../main/config/puppeteer";
import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../shared/infra/logger/logger";
import { GetAllNews } from "../domain/use-cases/get-all-news";

export class ShowNewsUseCase {
  private scrapper: PuppeteerAdapter;

  private _url: string = "https://www.ufc.br/noticias/noticias-de-2022?start=";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  async execute(
    request: GetAllNews.Request
  ): Promise<Either<Error, GetAllNews.Response>> {
    try {
      const { pageNumber, title } = request;

      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      Logger.info(this._url + pageNumber);

      await this.scrapper.navigateToUrl(this._url + pageNumber, 25000);

      // page.once("load", () => console.log("Página de notícias carregada"));

      //Se passar title significa que irá pesquisar apenas por título
      //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
      if (title) {
        //#limit -> botão select de quantidade de dados que irá ser exibido
        await this.scrapper.waitForElement("#adminForm"); //Formulário com filtros de título e exibição

        await this.scrapper.pageEvaluate((text: string) => {
          // Filtro de exibição
          const selectInput = <HTMLSelectElement>(
            document.querySelector("#limit")
          );

          const filtersOptions = Array.from(...[selectInput?.options]);

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
        throw new Error("Não foi possível carregar notícias");
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
      Logger.error(`ShowNewsUseCase : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
