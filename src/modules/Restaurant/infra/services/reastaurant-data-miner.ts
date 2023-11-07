import { Either, left, right } from "../../../../shared/Either";
import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../../shared/infra/logger/logger";
import { puppeterrConfig } from "../../../../main/config";
import {
  ShowMenuByDay,
  PutCreditsInCard,
  RestaurantDataMiner,
  ShowBalanceByUser,
} from "../../use-cases/ports";
import { ElementNotFoundError } from "../../domain/errors/element-not-found";

export class RestaurantServices implements RestaurantDataMiner.Services {
  private readonly scrapper: PuppeteerAdapter;
  private readonly maxPageTimeout: number = 10000;

  private readonly baseUrl = {
    menu: "https://www.ufc.br/restaurante/cardapio/1-restaurante-universitario-de-fortaleza",
    userBalance: "https://si3.ufc.br/public/iniciarConsultaSaldo.do",
    payment:
      "https://si3.ufc.br/public/jsp/restaurante_universitario/consulta_comensal_ru.jsf",
  };

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  async getMenuByDate(
    date: string
  ): Promise<Either<Error, ShowMenuByDay.Response>> {
    try {
      const baseURL = this.baseUrl.menu + `/${date}`;

      await this.scrapper.launch(puppeterrConfig.launchConfig);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(baseURL, this.maxPageTimeout);

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

  async getUserBalance({
    card_number,
    registry_number,
  }: ShowBalanceByUser.Request): Promise<
    Either<Error, ShowBalanceByUser.Response>
  > {
    try {
      await this.scrapper.launch(puppeterrConfig.launchConfig);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(
        this.baseUrl.userBalance,
        this.maxPageTimeout
      );

      await this.scrapper.pageEvaluate((card_number: number) => {
        const input = document.querySelector('input[name="codigoCartao"]');
        if (input !== null) (<HTMLInputElement>input).value = `${card_number}`;
        return input;
      }, Number(card_number));

      await this.scrapper.pageEvaluate((registry_number: number) => {
        const input = document.querySelector(
          'input[name="matriculaAtreladaCartao"]'
        );
        if (input !== null)
          (<HTMLInputElement>input).value = `${registry_number}`;
        return input;
      }, Number(registry_number));

      await Promise.all([
        this.scrapper.click(
          "#corpo > form > table > tfoot > tr > td > input[type=submit]"
        ),
        this.scrapper.waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 15000,
        }),
      ]);

      const user_info_page = await this.scrapper.getElementHandler(
        "#corpo > table:nth-child(6)"
      );

      if (!user_info_page) {
        throw new Error("Não foi possível buscar usuário");
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
              console.log(allLines);
              const withoutBlankLinesandMarks = allLines
                .map((line) => {
                  return line.trim();
                })
                .filter((value) => value);

              return withoutBlankLinesandMarks;
            };
            const rows = Array.from(tbody.getElementsByTagName("tr"));

            for (const row of rows) {
              if (row.hasChildNodes()) {
                const operation_date = row.children[0].textContent;

                const operation_type = row.children[1].textContent
                  ? removeBlanksLines(row.children[1].textContent).join("")
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
      Logger.error(`❌ [ERROR] : ShowBalanceByUser : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }

  async getPaymentQrCode({
    card_number,
    paymentMethod,
    qtd_credits,
    registry_number,
  }: PutCreditsInCard.Request): Promise<
    Either<Error | ElementNotFoundError, PutCreditsInCard.Response>
  > {
    try {
      await this.scrapper.launch(puppeterrConfig.launchConfig);

      await this.scrapper.openNewTab();

      //Página inicial
      await this.scrapper.navigateToUrl(this.baseUrl.payment, 15000);

      await this.scrapper.waitForElement(".formulario", 15000);

      //Informar dados do cartão e matrícula
      await this.scrapper.pageEvaluate(
        (card_number: number, registry_number: number) => {
          const formInputs = Array.from(document.querySelectorAll("tbody tr"));

          if (formInputs.length) {
            const card = formInputs[0];
            const cardInput = card?.lastElementChild
              ?.firstElementChild as HTMLInputElement;

            cardInput.value = `${card_number}`;

            const registration = formInputs[1];

            const registrationInput = registration?.lastElementChild
              ?.firstElementChild as HTMLInputElement;

            registrationInput.value = `${registry_number}`;

            const submitInput = document
              .querySelector(".formulario")
              ?.querySelector("tfoot")
              ?.querySelector("input");

            submitInput && submitInput.click();
          }
        },
        card_number,
        registry_number
      );

      await this.scrapper.waitForNavigation({
        waitUntil: ["domcontentloaded"],
        timeout: 10000,
      });

      const errorMessageHandle = await this.scrapper.getElementHandler(
        ".erros"
      );

      // If has render a error message in page
      if (!!errorMessageHandle) {
        const errorsMessages = await this.scrapper.elementEvaluate(
          "li",
          (li) => {
            if (li) {
              return (<HTMLElement>li).innerText.trim();
            }
            return;
          },
          errorMessageHandle
        );

        if (errorsMessages) {
          await this.scrapper.closeBrowser();

          throw new Error(errorsMessages);
        }
      }

      await this.scrapper.waitForElement("#form");

      // Escolher pagamento na rota
      //https://si3.ufc.br/public/jsp/restaurante_universitario/gera_gru_restaurante.jsf
      await this.scrapper.pageEvaluate(
        (qtd_credits: number, paymentMethod: string) => {
          const form = document.getElementById("form");
          if (!form) {
            return;
          }
          const tables = Array.from(form.querySelectorAll(".formulario"));
          const creditoInfo = tables[1];
          const inputs = Array.from(creditoInfo.querySelectorAll("tr"));

          const qtdCredits = inputs[0];
          const qtdCreditsInput = qtdCredits.querySelector(
            "input"
          ) as HTMLInputElement;

          qtdCreditsInput.value = `${qtd_credits}`;
          //Não adianta só mudar o valor, tem que chamar o evento de mudança de valor do input
          qtdCreditsInput.dispatchEvent(new Event("change"));

          //Escolhe o checkbox de pix ou gru
          const options = inputs[3]; //Checkboxes de pix ou gru
          const pix = options?.firstElementChild?.firstElementChild;

          (<HTMLInputElement>pix).checked = true; //ativa o checkbox

          document
            ?.getElementById("modalForm2")
            ?.querySelectorAll("input")[1]
            .click();

          return;
        },
        Number(qtd_credits),
        Number(paymentMethod)
      );

      await this.scrapper.waitForNavigation({
        waitUntil: ["domcontentloaded"],
      });

      await this.scrapper.waitForElement("#corpo");

      await this.scrapper.waitForElement("#iFrameResizer0");

      //Delay to wait frame render in page
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const frameElementHandle = await this.scrapper.getElementHandler(
        'iframe[id="iFrameResizer0"]'
      );

      if (frameElementHandle === null) {
        throw new ElementNotFoundError("frame");
      }
      //go into frame in order to input info
      const frame = await this.scrapper.resolveContentFrame(frameElementHandle);

      await this.scrapper.waitForElement("#app", frame);

      const payerDetails = await this.scrapper.pageElementEvaluate(() => {
        const paymentDetails = Array.from(
          ...[document.querySelectorAll(".valor-detalhe-pagamento")]
        );
        const paymentInfo = {};

        //Pegar informações do pagador
        if (paymentDetails.length) {
          //Exibir somente detalhes de pagamentos que não são ocultos na página
          paymentDetails
            .filter((el) => el?.parentElement?.style.display !== "none")
            .map((el) => {
              const element = el as any;
              Reflect.set(
                paymentInfo,
                element?.previousElementSibling?.innerText,
                element.innerText.trim()
              );
            });
        }
        return paymentInfo;
      }, frame);

      // await frame?.waitForSelector(".meio-pagamento");

      await this.scrapper.waitForElement(".meio-pagamento", frame);

      //Clicar na opção pix e submeter formulário
      await this.scrapper.pageElementEvaluate(() => {
        const paymentOptions =
          document.querySelector(".meio-pagamento")?.parentElement;

        paymentOptions?.click();

        document.getElementById("btnPgto")?.click();
      }, frame);

      //Delay para espera ro iframe carregar
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payment = await this.scrapper.pageElementEvaluate(() => {
        const paymentDetails = document.querySelector(
          ".meios-conteudo.detalhe-conteudo"
        );
        //- pega o último elemento filho (row mt-3)
        //- pega o último elemento filho (col-12 col-print pl-3 pl-sm-0)
        const details = paymentDetails?.lastElementChild
          ?.lastElementChild as HTMLElement;
        //- pega o todos os .texto-menor e seleciona o último (texto-menor no-print mb-2) - Expiração do qrCode
        const expirationDetails = details?.querySelectorAll(
          ".texto-menor"
        )[2] as HTMLElement;
        //- pega só os elementos com tag <b> [data, hora] ou dá um textContent.trim()
        const expiration = expirationDetails?.innerText?.trim();

        //- pega o .qr-code-img e acessa o src para pegar a imagem qrd_code
        const qrCodeImg = (<HTMLInputElement>(
          details?.querySelector(".qr-code-img")
        ))?.src;
        //- pega o .qr-code-copy-box.qr-code-box chamando o textContent.trim()
        const qrCodeCopy = <HTMLElement>(
          details.querySelector(".qr-code-copy-box .qr-code-box")
        );
        const qrCodeText = qrCodeCopy?.innerText.trim();

        return {
          expiration,
          qrCodeImg,
          qrCodeText,
        };
      }, frame);

      await this.scrapper.closeBrowser();

      if (payment === null) {
        throw new Error("Payment not found");
      }

      console.log(payment, payerDetails);
      return right({
        payment,
        payerDetails,
      });
    } catch (error) {
      Logger.error(`PutCreditsInCardUseCase : ${error}`);
      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
