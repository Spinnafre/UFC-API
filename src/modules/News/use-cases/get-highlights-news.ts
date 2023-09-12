import browserOptions from "../../../main/config/puppeteer";
import { Either, left, right } from "../../../shared/Either";
import { PuppeteerAdapter } from "../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../shared/infra/logger/logger";
import { GetHighlightsNews } from "../domain/use-cases/get-highlights-news";

export class ShowHighlightsNewsUseCase {
  private scrapper: PuppeteerAdapter;

  private _url: string = "https://www.ufc.br";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  async execute(): Promise<Either<Error, GetHighlightsNews.Response>> {
    try {
      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(this._url, 15000);

      await this.scrapper.waitForElement("#conteudo");

      const content = await this.scrapper.getElementHandler(
        "#conteudo > div.ten.columns"
      );
      // #conteudo > div.ten.columns > div:nth-child(1)
      //Notícias
      const highlightsNews = await this.scrapper.elementEvaluate(
        "div:nth-child(1)",
        (childElement: Element) => {
          const highlightNews = childElement.querySelector(
            "div.destaques.clearfix"
          );

          if (!highlightNews) {
            return [];
          }

          const items = Array.from(highlightNews.querySelectorAll(".item"));

          const result = items.map((item) => {
            const thumbnailElement = <HTMLImageElement>(
              item.querySelector(".thumb>.img")
            );
            const linkElement = <HTMLLinkElement>item.querySelector(".link");

            const thumbnailUrl = thumbnailElement.src;
            const link = linkElement.href;

            return {
              link,
              thumbnailUrl,
            };
          });

          return result;
        },
        content
      );

      if (!highlightsNews.length) {
        Logger.warn(
          `Não foi possível obter notícias em destaques da url : ${this._url}`
        );
      }

      // Últimas notícias
      const latestNews = await this.scrapper.elementEvaluate(
        "div:nth-child(1)",
        (el) => {
          const lastNews = el.querySelector("div.ultimas");

          if (!lastNews) {
            return [];
          }

          const items = Array.from(lastNews.querySelectorAll(".item"));

          const result = items
            .map((item) => {
              //subtitulo
              const subtitleItem = <HTMLParagraphElement>(
                item.querySelector(".subtitulo")
              );

              if (subtitleItem) {
                const link = <HTMLLinkElement>subtitleItem.firstElementChild;

                if (link === null) {
                  return null;
                }

                const descriptionElement = <HTMLElement>(
                  item.querySelector(".descricao")
                );

                //descricao
                const description = descriptionElement?.textContent;

                //img
                const imageElement = <HTMLImageElement>(
                  item.querySelector(".img")
                );

                const img = imageElement ? imageElement.src : "";

                return {
                  img,
                  title: {
                    url: link?.href,
                    description: subtitleItem?.textContent,
                  },
                  description,
                };
              }
            })
            .filter((item) => item);

          return result;
        },
        content
      );

      if (!latestNews.length) {
        Logger.warn(
          `Não foi possível obter últimas notícias em destaques da url : ${this._url}`
        );
      }

      // #conteudo > div.ten.columns > div:nth-child(2)

      //Concursos e seleções
      const contestAndSelections = await this.scrapper.elementEvaluate(
        "div:nth-child(2)",
        (el) => {
          const links = el.querySelector(".links");

          if (links === null) {
            return [];
          }

          const items = Array.from(links.querySelectorAll(".item"));

          const result = items
            .map((item) => {
              const link = <HTMLLinkElement>item.firstElementChild;

              if (link) {
                const description = link;
                const url = link.href;

                return {
                  url,
                  description,
                };
              }
            })
            .filter((item) => item);

          return result;
        },
        content
      );

      if (!contestAndSelections.length) {
        Logger.warn(
          `Não foi possível obter notícias de concursos e seleçoes em destaques da url : ${this._url}`
        );
      }

      await this.scrapper.closeBrowser();

      return right({
        highlight: highlightsNews,
        latestNews: latestNews,
        extra: contestAndSelections,
      });
    } catch (error) {
      Logger.error(`ShowHighlightsNewsUseCase : ${error}`);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
