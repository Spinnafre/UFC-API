const {
  browserOptions,
  timeoutToRequest,
} = require("../../../../main/config/puppeteer");
const { AppError } = require("../../../../shared/errors/AppErrors");
class ShowContestsAndSelectionsUseCase {
  constructor(puppeteer) {
    this.scrapper = puppeteer;
  }
  async execute(pageNumber = 10, title = null) {
    const browser = await this.scrapper.launch(browserOptions);
    try {
      const page = await browser.newPage();
      console.log(
        `https://www.ufc.br/noticias/noticias-e-editais-de-concursos-e-selecoes?start=${pageNumber}`
      );
      await page.goto(
        `https://www.ufc.br/noticias/noticias-e-editais-de-concursos-e-selecoes?start=${pageNumber}`,
        {
          timeout: timeoutToRequest,
        }
      );
      page.once("load", () =>
        console.log("Página de Concursos e seleções carregada")
      );

      //Se passar title significa que irá pesquisar apenas por título
      //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
      if (title) {
        //#limit -> botão select de quantidade de dados que irá ser exibido
        await page.waitForSelector("#adminForm"); //Formulário com filtros de título e exibição

        await page.evaluate((text) => {
          //Definir o filtro de exibição para TUDO
          Array.from(document.querySelector("#limit").options).forEach(
            (val, i) => {
              if (val.value === "0") {
                document.querySelector("#limit").selectedIndex = i;
              }
            }
          );
          document.querySelector(
            ".filters > .filter-search > #filter-search"
          ).value = text;
          //Chama o evento de submit
          document.adminForm.submit();
        }, title);
        //Espera a página recarregar pois ao fazer o submit irá recarregar a página
        await page.waitForNavigation({
          timeout: 10000,
          waitUntil: ["domcontentloaded"],
        });
      }

      const listras = await page.$(".listras");
      if (!listras) {
        throw "Não foi possível carregar notícias de Editar de Concursos e Seleções";
      }

      const links = await listras.$$eval("tr", async (rows) => {
        const result = [];
        for (const row of rows) {
          const newsAnchor = row
            .querySelector(".list-title")
            .querySelector("a");
          const link = newsAnchor.href;
          const text = newsAnchor.textContent.trim();

          const date = row.querySelector(".list-date").textContent.trim();

          result.push({
            text,
            link,
            date,
          });
        }
        return result;
      });
      await page.close();
      await browser.close();
      return links;
    } catch (error) {
      await browser.close();
      if (error instanceof this.scrapper.errors.TimeoutError) {
        throw new AppError({
          message:
            "[TIMEOUT] - falha ao buscar notícias de concursos e seleções pois o tempo limite de requisição foi alcançado - " +
            error,
          statusCode: 504,
        });
      }
      throw new AppError({
        message: `Falha ao realizar a busca de notícias de concursos e seleções - ${error.message}`,
      });
    }
  }
}

module.exports = {
  ShowContestsAndSelectionsUseCase,
};
