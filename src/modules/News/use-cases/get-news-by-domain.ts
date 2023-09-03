import browserOptions from "../../../main/config/puppeteer";
import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { GetNews } from "../domain/use-cases/get-news-by-domain";

export class ShowAllNewsByDomainUseCase {
  private scrapper: PuppeteerAdapter;

  private _url: string = "";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  private setUrl(domain: string, pageNumber: number, title: string) {
    this._url = `https://${domain}/pt/category/noticias/page/${pageNumber}/${
      title ? `?s=${title}` : ""
    }`;
  }

  async execute(
    request: GetNews.Request
  ): Promise<Either<Error, GetNews.Response>> {
    const { domain, pageNumber, title } = request;

    try {
      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      this.setUrl(domain, pageNumber, title);

      console.log(this._url);

      await this.scrapper.navigateToUrl(this._url, 15000);

      //Se passar title significa que irá pesquisar apenas por título
      //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
      /*if (title) {
                      //#limit -> botão select de quantidade de dados que irá ser exibido
                      await page.waitForSelector(".ufc") //Formulário com filtros de título 
      
                      await page.evaluate((text) => {
                          document.querySelector("#s").value = text
                          //Chama o evento de submit
                          document.querySelector("#searchform").submit()
                      }, title)
                      //Espera a página recarregar pois ao fazer o submit irá recarregar a página
                      await page.waitForNavigation({ timeout: 5000, waitUntil: ['domcontentloaded'] })
                  }*/

      // await page.waitForSelector(".sector")

      const news = await this.scrapper.elementEvaluate(
        ".setor section",
        (section) => {
          const cards = Array.from(section.querySelectorAll(".card"));

          return cards
            .map((card) => {
              const response: {
                title: string | null;
                url: string | null;
                date: string | null;
                publishLink: string | null;
                publishedFrom: string | null;
                content: string | null;
              } = {
                title: null,
                url: null,
                date: null,
                publishLink: null,
                publishedFrom: null,
                content: null,
              };

              const headerInfo = card.querySelector(".card-header");

              if (headerInfo) {
                const headerTitleElement = <HTMLHeadingElement>(
                  headerInfo.querySelector("h1")
                );

                if (headerTitleElement) {
                  const headerLinkElement = <HTMLAnchorElement>(
                    headerTitleElement.querySelector("a")
                  );

                  response.url = headerLinkElement.href;

                  response.title =
                    headerTitleElement.textContent?.trim() || null;
                }

                const dateElement = headerInfo.querySelector(".date");

                if (dateElement) {
                  response.date = dateElement.textContent?.trim() || null;
                }

                const publishElement = headerInfo.querySelector(".publish");

                if (publishElement) {
                  const publishLinkElement = <HTMLAnchorElement>(
                    publishElement.querySelector("a")
                  );

                  response.publishLink = publishLinkElement.href;

                  response.publishedFrom =
                    publishElement.textContent?.trim() || null;
                }
              }

              const cardElement = card.querySelector(".card-content");

              response.content =
                cardElement && cardElement.textContent
                  ? cardElement.textContent.trim()
                  : null;

              return response;
            })
            .filter((news) => news);
        }
      );

      await this.scrapper.closeBrowser();

      return right(news);
    } catch (error) {
      console.error(`❌ [ERROR] : ShowAllNewsUseCase : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
