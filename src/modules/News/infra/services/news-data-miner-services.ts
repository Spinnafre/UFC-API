import browserOptions from "../../../../main/config/puppeteer";
import { Either, left, right } from "../../../../shared/Either";
import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../../shared/infra/logger/logger";
import { NewsEntity } from "../../domain/entities/news";
import { NewsDataMiner } from "../../domain/use-cases/news-data-miner-services";

export class NewsServices implements NewsDataMiner.Services {
  private readonly scrapper: PuppeteerAdapter;

  private readonly baseUrl: string = "https://www.ufc.br/noticias/";
  private readonly eventListPath: string = "/eventos/lista/";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  private formatUrl() {}

  private async getMainNews(
    url: string,
    name?: string
  ): Promise<Either<Error, Array<NewsEntity>>> {
    try {
      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      Logger.info("Buscando dados do endereço " + url);

      await this.scrapper.navigateToUrl(url, 15000);

      //Se passar newsName significa que irá pesquisar apenas por título
      //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
      if (name) {
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
        }, name);
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
          const result: Array<NewsEntity> = [];

          for (const row of rows) {
            const newsAnchor = row
              .querySelector(".list-title")
              ?.querySelector("a");

            if (newsAnchor) {
              const link = newsAnchor.href;
              const title = newsAnchor?.textContent?.trim() || null;

              const date =
                row.querySelector(".list-date")?.textContent?.trim() || null;

              result.push({
                title: title || "No defined",
                url: link,
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
      Logger.error(error);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
  async getContestsAndSelections(
    request: NewsDataMiner.GetNewsRequest
  ): Promise<Either<Error, Array<NewsEntity>>> {
    const url =
      this.baseUrl +
      "noticias-e-editais-de-concursos-e-selecoes?start=" +
      request.pageNumber;
    return await this.getMainNews(url, request.title);
  }
  async getNews(
    request: NewsDataMiner.GetNewsRequest
  ): Promise<Either<Error, Array<NewsEntity>>> {
    // TO-DO : Adicionar ano
    const url = this.baseUrl + "noticias-de-2023?start=" + request.pageNumber;
    return await this.getMainNews(url, request.title);
  }

  async getHighlightsNews(): Promise<Either<Error, Array<any>>> {
    return right([]);
  }
}
