import browserOptions from "../../../main/config/puppeteer";
import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../shared/infra/logger/logger";
import { ShowMenuByDay } from "../domain/use-cases/show-menu-by-day";
export class ShowMenuByDayUseCase {
  private scrapper: PuppeteerAdapter;
  static baseUrl: string =
    "https://www.ufc.br/restaurante/cardapio/1-restaurante-universitario-de-fortaleza";

  static maxPageTimeout: number = 10000;

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }
  async execute(
    request: ShowMenuByDay.Request
  ): Promise<Either<Error, ShowMenuByDay.Response>> {
    try {
      const { date } = request;
      await this.scrapper.launch(browserOptions);

      await this.scrapper.openNewTab();

      const url = ShowMenuByDayUseCase.baseUrl + `/${date}`;

      await this.scrapper.navigateToUrl(
        url,
        ShowMenuByDayUseCase.maxPageTimeout
      );

      const typesOfMeats = await this.scrapper.pageEvaluate(() => {
        const types = document.querySelector(".c-cardapios");
        if (types === null) {
          return null;
        }
        const tagTitles = Array.from(types.getElementsByTagName("h3"));

        const titlesIDs = tagTitles.map((title) => {
          return title.getAttribute("id");
        });

        return titlesIDs;
      });

      Logger.info("Searching by meats");

      const result = [];

      if (typesOfMeats) {
        for (let typeMeat of typesOfMeats) {
          //.refeicao.desjejum > .listras
          const selector = `.refeicao.${typeMeat} > .listras`;

          const meat = await this.scrapper.pageEvaluateWithSelector((table) => {
            const removeBlanksLines = (text: string) => {
              const allLines = text.split("\n");
              return allLines.join(", ");
            };

            const rows = Array.from(table.getElementsByTagName("tr"));

            return rows.map((row) => {
              const title = row.firstElementChild?.textContent?.trim();

              const options = removeBlanksLines(
                (<HTMLElement>row?.lastElementChild).innerText.trim()
              );

              return {
                title: title || "",
                options,
              };
            });
          }, selector);

          result.push({ type: typeMeat, meat: meat || [] });
        }
      }

      Logger.info(
        `Successfully to search meats, ${result.length} data loaded.`
      );

      await this.scrapper.closeBrowser();

      return right(result);
    } catch (error) {
      Logger.error(`❌ [ERROR] : ShowRUMenuByDayUseCase : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
