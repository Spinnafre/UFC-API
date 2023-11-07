import { puppeterrConfig } from "../../../../main/config/puppeteer";
import { Either, left, right } from "../../../../shared/Either";
import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { Logger } from "../../../../shared/infra/logger/logger";
import { NewsEntity } from "../../domain/entities/news";
import { GetHighlightsNews } from "../../use-cases/ports/get-highlights-news";
import { NewsDataMiner } from "../../use-cases/ports/news-data-miner-services";

export class NewsServices implements NewsDataMiner.Services {
  private readonly scrapper: PuppeteerAdapter;

  private readonly baseUrl: string = "https://www.ufc.br";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  private formatUrl(pageNumber: number, title: string, domain: string): string {
    return `https://${domain}/pt/category/noticias/page/${pageNumber}/${
      title ? `?s=${title}` : ""
    }`;
  }

  private async getMainNews(
    url: string,
    name?: string
  ): Promise<Either<Error, Array<NewsEntity>>> {
    try {
      await this.scrapper.launch(puppeterrConfig.launchConfig);

      await this.scrapper.openNewTab();

      Logger.info("Buscando dados do endereço " + url);

      await this.scrapper.navigateToUrl(url, 15000);

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
              selectElement.selectedIndex = index;
            }
          });

          const filter = <HTMLInputElement>(
            document.querySelector(".filters > .filter-search > #filter-search")
          );

          if (filter) {
            filter.value = text;

            const doc = document as Document & { adminForm?: HTMLFormElement };
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
      "/noticias/" +
      "noticias-e-editais-de-concursos-e-selecoes?start=" +
      request.pageNumber;

    return await this.getMainNews(url, request.title);
  }
  async getNews(
    request: NewsDataMiner.GetNewsRequest
  ): Promise<Either<Error, Array<NewsEntity>>> {
    // TO-DO : Adicionar ano
    const url =
      this.baseUrl +
      "/noticias/" +
      "noticias-de-2023?start=" +
      request.pageNumber;

    return await this.getMainNews(url, request.title);
  }

  async getHighlightsNews(): Promise<
    Either<Error, GetHighlightsNews.Response>
  > {
    try {
      await this.scrapper.launch(puppeterrConfig.launchConfig);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(this.baseUrl, 15000);

      await this.scrapper.waitForElement("#conteudo");

      const content = await this.scrapper.getElementHandler(
        "#conteudo > div.ten.columns"
      );
      // #conteudo > div.ten.columns > div:nth-child(1)
      //Notícias
      const highlightsNews:
        | Array<{
            link: string;
            thumbnailUrl: string;
          }>
        | [] = await this.scrapper.elementEvaluate(
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
          `Não foi possível obter notícias em destaques da url : ${this.baseUrl}`
        );
      }

      // Últimas notícias
      const latestNews:
        | Array<{
            img: string;
            title: {
              url: string;
              description: string;
            };
            description: string;
          }>
        | [] = await this.scrapper.elementEvaluate(
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
          `Não foi possível obter últimas notícias em destaques da url : ${this.baseUrl}`
        );
      }

      // #conteudo > div.ten.columns > div:nth-child(2)

      //Concursos e seleções
      const contestAndSelections:
        | Array<{
            url: string;
            description: string;
          }>
        | [] = await this.scrapper.elementEvaluate(
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
          `Não foi possível obter notícias de concursos e seleções em destaques da url : ${this.baseUrl}`
        );
      }

      await this.scrapper.closeBrowser();

      return right({
        highlight: highlightsNews,
        latestNews: latestNews,
        contestsAndSelections: contestAndSelections,
      });
    } catch (error) {
      Logger.error(error);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }

  public async getNewsFromDomainPage(request: {
    pageNumber: number;
    title: string;
    domain: string;
  }): Promise<Either<Error, Array<NewsEntity>>> {
    const url = this.formatUrl(
      request.pageNumber,
      request.title,
      request.domain
    );

    const timeout = 25000;

    try {
      await this.scrapper.launch(puppeterrConfig.launchConfig);

      await this.scrapper.openNewTab();

      Logger.info(`Getting data from ${url}...`);

      await this.scrapper.navigateToUrl(url, timeout);

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
      Logger.error(error);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
