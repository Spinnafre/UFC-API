import browserOptions from "../../../main/config/puppeteer";
import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../shared/infra/logger/logger";
import { ElementNotFoundError } from "../domain/errors/element-not-found";
import { PutCreditsInCard } from "../domain/use-cases/put-credits-in-card";

export class PutCreditsInCardUseCase {
  private scrapper: PuppeteerAdapter;

  private _url: string =
    "https://si3.ufc.br/public/jsp/restaurante_universitario/consulta_comensal_ru.jsf";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  async add(
    request: PutCreditsInCard.Request
  ): Promise<Either<Error | ElementNotFoundError, PutCreditsInCard.Response>> {
    try {
      const { card_number, paymentMethod, qtd_credits, registry_number } =
        request;

      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      //Página inicial
      await this.scrapper.navigateToUrl(this._url, 15000);

      await this.scrapper.waitForElement(".formulario");

      //Informar dados do cartão e matrícula
      await this.scrapper.pageEvaluate(
        (card_number: number, registry_number: number) => {
          const formInputs = Array.from(document.querySelectorAll("tbody tr"));
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
        },
        card_number,
        registry_number
      );

      await this.scrapper.waitForNavigation({
        waitUntil: ["domcontentloaded"],
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

          return left(new Error(errorsMessages));
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
        return left(new ElementNotFoundError("frame"));
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
        return left(new Error("Payment not found"));
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
