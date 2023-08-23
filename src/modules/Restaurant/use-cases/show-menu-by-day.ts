import browserOptions from "../../../main/config/puppeteer";
import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
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
    day: ShowMenuByDay.Request
  ): Promise<Either<Error, ShowMenuByDay.Response>> {
    try {
      await this.scrapper.launch(browserOptions);

      await this.scrapper.openNewTab();

      const url = ShowMenuByDayUseCase.baseUrl + `/${day}`;

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

      console.log("[LOG] Searching by meats");

      const result = typesOfMeats
        ? typesOfMeats.map(async (typeMeat: string) => {
            //.refeicao.desjejum > .listras
            const selector = `.refeicao.${typeMeat} > .listras`;

            const meat = await this.scrapper.pageEvaluateWithSelector(
              (table) => {
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
                    title,
                    options,
                  };
                });
              },
              selector
            );

            return {
              type: typeMeat,
              meat,
            };
          })
        : [];

      console.log(
        `[LOG] Successfully to search meats, ${result.length} data loaded.`
      );

      await this.scrapper.closeBrowser();

      return right(result);
    } catch (error) {
      console.error(`❌ [ERROR] : ShowRUMenuByDayUseCase : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
