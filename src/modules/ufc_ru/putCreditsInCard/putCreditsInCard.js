const {
    browserOptions,
    timeoutToRequest,
} = require("../../../config/puppeteer");
const { AppError } = require("../../../shared/errors/AppErrors");

class PutCreditsInCardUseCase {
    constructor(puppeteer) {
        this.scrapper = puppeteer;
    }
    async execute(
        input_card_number,
        input_registry_number,
        input_qtd_credits,
        input_paymentMethod
    ) {
        const browser = await this.scrapper.launch(browserOptions);
        try {
            let page = await browser.newPage();
            //Página inicial
            //https://si3.ufc.br/public/jsp/restaurante_universitario/consulta_comensal_ru.jsf
            await page.goto(
                "https://si3.ufc.br/public/jsp/restaurante_universitario/consulta_comensal_ru.jsf",
                {
                    timeout: 15000,
                }
            );

            /** 
                   payload: 
                      codigoCartao: 2887746615
                      matriculaAtreladaCartao: 470605
                      quantidadeCréditos: 2
                      payment: pix ou Cartão de crédito
                  */

            await page.waitForSelector(".formulario");

            //Informar dados do cartão e matrícula
            await page.evaluate((card_number, registry_number) => {
                let formInputs = Array.from(document.querySelectorAll("tbody tr"));
                let card = formInputs[0];
                let cardInput = card.lastElementChild.firstElementChild;
                cardInput.value = card_number;

                let registration = formInputs[1];
                let registrationInput = registration.lastElementChild.firstElementChild;
                registrationInput.value = registry_number;

                let submitInput = document
                    .querySelector(".formulario")
                    .querySelector("tfoot")
                    .querySelector("input");

                submitInput.click();
            }, Number(input_card_number), Number(input_registry_number));

            await page.waitForNavigation({ waitUntil: ['domcontentloaded'] })

            let errorMessageHandle = await page.$('.erros')

            if (!!errorMessageHandle) {
                let errors = await errorMessageHandle.$eval('li',(li) => {
                    if (li) {
                        return li.innerText.trim()
                    }
                    return
                })
                if (errors) {
                    await page.close();
                    throw errors
                }
            }

            await page.waitForSelector("#form");

            // Escolher pagamento na rota 
            //https://si3.ufc.br/public/jsp/restaurante_universitario/gera_gru_restaurante.jsf
            await page.evaluate((qtd_credits, paymentMethod) => {
                let form = document.getElementById("form")
                let tables = Array.from(form.querySelectorAll(".formulario"))
                let creditoInfo = tables[1]
                let inputs = Array.from(creditoInfo.querySelectorAll("tr"))

                let qtdCredits = inputs[0]
                let qtdCreditsInput = qtdCredits.querySelector("input")
                qtdCreditsInput.value = qtd_credits
                //Não adianta só mudar o valor, tem que chamar o evento de mudança de valor do input
                qtdCreditsInput.onchange()

                //Escolhe o checkbox de pix ou gru
                let options = inputs[3] //Checkboxes de pix ou gru
                let pix = options.firstElementChild.firstElementChild
                pix.checked = true //ativa o checkbox

                document.getElementById("modalForm2").querySelectorAll("input")[1].click()
                return
            }, Number(input_qtd_credits), Number(input_paymentMethod));



            await page.waitForNavigation({ waitUntil: ['domcontentloaded'] })

            await page.waitForSelector("#corpo");
            await page.waitForSelector("#iFrameResizer0");

            //Delay para espera ro iframe carregar
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const elementHandle = await page.$(
                'iframe[id="iFrameResizer0"]',
            );
            //go into frame in order to input info
            const frame = await elementHandle.contentFrame();
            await frame.waitForSelector('#app');



            const payerDetails = await frame.evaluate(() => {
                let paymentDetails = [...document.querySelectorAll('.valor-detalhe-pagamento')];
                let paymentInfo = {};

                //Pegar informações do pagador
                if (paymentDetails.length) {
                    //Exibir somente detalhes de pagamentos que não são ocultos na página
                    paymentDetails.filter(el => {
                        if (el.parentElement.style.display === "none") {
                            return false
                        }
                        return true
                    }).map(el => Reflect.set(paymentInfo, el.previousElementSibling.innerText, el.innerText.trim()))


                }
                return paymentInfo;
            });

            await frame.waitForSelector(".meio-pagamento");
            //Clicar na opção pix e submeter formulário
            await frame.evaluate(() => {
                let paymentOptions = document.querySelector(".meio-pagamento").parentElement

                paymentOptions.click()
                document.getElementById("btnPgto").click()
            })


            //Delay para espera ro iframe carregar
            await new Promise((resolve) => setTimeout(resolve, 1000))

            let payment = await frame.evaluate(() => {
                let paymentDetails = document.querySelector(".meios-conteudo.detalhe-conteudo")
                //- pega o último elemento filho (row mt-3)
                //- pega o último elemento filho (col-12 col-print pl-3 pl-sm-0)
                let details = paymentDetails.lastElementChild.lastElementChild
                //- pega o todos os .texto-menor e seleciona o último (texto-menor no-print mb-2) - Expiração do qrCode
                let expirationDetails = details.querySelectorAll(".texto-menor")[2]
                //- pega só os elementos com tag <b> [data, hora] ou dá um textContent.trim()
                let expiration = expirationDetails.innerText.trim()

                //- pega o .qr-code-img e acessa o src para pegar a imagem qrd_code
                let qrCodeImg = details.querySelector(".qr-code-img").src
                //- pega o .qr-code-copy-box.qr-code-box chamando o textContent.trim()
                let qrCodeCopy = details.querySelector(".qr-code-copy-box .qr-code-box")
                let qrCodeText = qrCodeCopy.innerText.trim()

                return {
                    expiration,
                    qrCodeImg,
                    qrCodeText
                }
            })


            await browser.close();
            return {
                payment,
                payerDetails
            };
        } catch (error) {
            await browser.close();
            if (error instanceof this.scrapper.errors.TimeoutError) {
                throw new AppError({
                    message:
                        "[TIMEOUT] - Falha ao buscar eventos de transações do ru pois o tempo limite de requisição foi alcançado " +
                        error,
                    statusCode: 504,
                });
            }
            throw new AppError({
                message: `Falha ao realizar busca de transações do ru. Error -> ${error}`,
            });
        }
    }
}

module.exports = {
    PutCreditsInCardUseCase,
};
