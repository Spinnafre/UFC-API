import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowBalanceByUser } from "../domain/use-cases/show-balance-by-user";
import browserOptions from "../../../main/config/puppeteer";
export class ShowBalanceByUserUseCase {
  private scrapper: PuppeteerAdapter;

  static url: string = "https://si3.ufc.br/public/iniciarConsultaSaldo.do";
  static maxPageTimeout: number = 10000;

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  async execute({
    input_card_number,
    input_registry_number,
  }: ShowBalanceByUser.Request): Promise<
    Either<Error, ShowBalanceByUser.Response>
  > {
    try {
      await this.scrapper.launch(browserOptions);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(
        ShowBalanceByUserUseCase.url,
        ShowBalanceByUserUseCase.maxPageTimeout
      );

      /** 
        payload: 
        codigoCartao: 2887746615
        matriculaAtreladaCartao: 470605
      */

      await this.scrapper.pageEvaluate((card_number: number) => {
        const input = document.querySelector('input[name="codigoCartao"]');
        if (input !== null) (<HTMLInputElement>input).value = `${card_number}`;
        return input;
      }, Number(input_card_number));

      await this.scrapper.pageEvaluate((registry_number: number) => {
        const input = document.querySelector(
          'input[name="matriculaAtreladaCartao"]'
        );
        if (input !== null)
          (<HTMLInputElement>input).value = `${registry_number}`;
        return input;
      }, Number(input_registry_number));

      await Promise.all([
        this.scrapper.click(
          "#corpo > form > table > tfoot > tr > td > input[type=submit]"
        ),
        this.scrapper.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);

      const user_info_page = await this.scrapper.getElementHandler(
        "#corpo > table:nth-child(6)"
      );

      if (!user_info_page) {
        return left(new Error("Não foi possível buscar usuário"));
      }

      const content = await this.scrapper.waitForElement(
        "#corpo > table:nth-child(6) > tbody"
      );

      const userInfo = await this.scrapper.pageElementEvaluate((node) => {
        try {
          const result = {
            user_name: "",
            user_credits: "",
          };
          const rowEven = node.querySelector(".linhaPar");
          result.user_name = rowEven.lastElementChild.textContent;

          const rowOdd = node.querySelector(".linhaImpar");
          result.user_credits = rowOdd.lastElementChild.textContent;

          return result;
        } catch (error) {
          return null;
        }
      }, content);

      const last_transactions = await this.scrapper.pageEvaluateWithSelector(
        (tbody) => {
          try {
            const result = [];

            const removeBlanksLines = (text: string) => {
              const allLines = text.split("\n");
              const withoutBlankLinesandMarks = allLines.map((line) => {
                return line.trim();
              });

              return withoutBlankLinesandMarks.join(" ");
            };
            const rows = Array.from(tbody.getElementsByTagName("tr"));

            for (const row of rows) {
              if (row.hasChildNodes()) {
                const operation_date = row.children[0].textContent;

                const operation_type = row.children[1].textContent
                  ? removeBlanksLines(row.children[1].textContent)
                  : null;

                const operation_details = row.children[2].textContent
                  ? removeBlanksLines(row.children[2].textContent)
                  : null;

                result.push({
                  date: operation_date,
                  type: operation_type,
                  details: operation_details,
                });
              }
            }

            return result;
          } catch (error) {
            return null;
          }
        },
        "#corpo > table:nth-child(8) > tbody"
      );

      await this.scrapper.closeBrowser();

      return right({
        user_info: userInfo,
        transactions: last_transactions,
      });
    } catch (error) {
      console.error(`❌ [ERROR] : ShowBalanceByUser : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
