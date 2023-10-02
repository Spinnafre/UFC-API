import browserOptions from "../../../../main/config/puppeteer";
import { Either, left, right } from "../../../../shared/Either";
import { Logger } from "../../../../shared/infra/logger/logger";
import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { EventsDataMiner } from "../../use-cases/ports/events-page-data-miner-protocol";
import { EventEntity } from "../../domain/Event";

export class EventsServices implements EventsDataMiner.Services {
  private readonly scrapper: PuppeteerAdapter;

  private readonly baseUrl: string = "https://agenda.ufc.br/";
  private readonly eventListPath: string = "/eventos/lista/";

  constructor(scrapper: PuppeteerAdapter) {
    this.scrapper = scrapper;
  }

  private formatUrl(
    request: EventsDataMiner.PageNumber | EventsDataMiner.EventQueryParams
  ): string {
    if (typeof request == "number") {
      return (
        this.baseUrl +
        this.eventListPath +
        `?tribe_event_display=list&tribe_paged=${request}`
      );
    }

    const { area, campus, category, date, day, keyWord } = request;

    return (
      this.baseUrl +
      this.eventListPath +
      `?tribe-bar-date=${date}&tribe-bar-date-day=${day}&tribe-bar-search=${keyWord}&tribe-bar-campus=${campus}&tribe-bar-categoria=${category}&tribe-bar-area=${area}`
    );
  }

  private async getMainEvents(
    eventAreaSelector: string
  ): Promise<Either<Error, Array<EventEntity>>> {
    try {
      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(this.baseUrl, 25000);

      await this.scrapper.waitForElement(".entry-content");

      Logger.info("Buscando eventos :)");

      const events = await this.scrapper.elementEvaluate(
        eventAreaSelector,
        (childElement) => {
          const eventsList = Array.from(
            childElement.querySelectorAll(".owl-item")
          );

          if (eventsList.length === 0) {
            return [];
          }

          const result = eventsList.map((item) => {
            // Deixar no mesmo format de saída
            const eventData: EventEntity = {
              imageUrl: null,
              pageUrl: null,
              title: null,
              // title_url: null,
              cost: null,
              date: null,
              address: {
                mapUrl: null,
                name: null,
                street: null,
                locality: null,
              },
              schedule: null,
            };

            // Imagem do evento, link de acesso e data de realização se tiver
            const eventImageElement = item.querySelector(".event-item-feature");

            // Desrição do evento (nome, local, preço)
            const eventContent = item.querySelector(".event-item-cotent");

            if (eventImageElement) {
              const eventImageDetails = eventImageElement.querySelector("a");

              if (eventImageDetails) {
                const eventImage = eventImageDetails.querySelector("img");

                const eventDateDetails =
                  eventImageDetails.querySelector(".event-date");

                if (eventDateDetails) {
                  const eventDateElement =
                    eventDateDetails.getElementsByClassName("date")[0];

                  const eventMonthElement =
                    eventDateDetails.getElementsByClassName("month")[0];

                  const eventDay = eventDateElement
                    ? eventDateElement.textContent
                    : null;

                  const eventMonth = eventMonthElement
                    ? eventMonthElement.textContent
                    : null;

                  if (eventDay && eventMonth)
                    eventData.date = eventDay + " de " + eventMonth;
                }
                eventData.imageUrl =
                  eventImage && eventImage.src ? eventImage.src : null;

                eventData.pageUrl =
                  eventImageDetails && eventImageDetails.href
                    ? eventImageDetails.href
                    : null;
              }
            }

            if (eventContent) {
              const eventTitleElement =
                eventContent.querySelector(".event-item-title");

              const eventTitleElementLink =
                eventTitleElement?.querySelector("a");

              // url do títula da postagem
              // if (eventTitleElementLink)
              //   eventData.title_url = eventTitleElementLink.href;

              //Título do evento
              eventData.title =
                eventTitleElementLink && eventTitleElementLink.textContent
                  ? eventTitleElementLink.textContent
                  : null;

              const eventPriceElement = eventContent.querySelector(
                ".event-item-price.ticketbox-price"
              );

              const priceValue = eventPriceElement?.textContent?.trim();

              if (priceValue) eventData.cost = priceValue;

              // Subtítulo da postagem
              const locationDetails = eventContent.querySelector(
                ".tribe-events-venue-details"
              );

              const locationURLElement = locationDetails?.querySelector("a");

              if (locationURLElement) {
                eventData.address.mapUrl = locationURLElement.href;
                eventData.address.name = locationURLElement.textContent;
              }

              // Componente de endereço
              const tribeAddressElement =
                locationDetails?.querySelector(".tribe-address");

              if (tribeAddressElement) {
                const tribeStreetElement = tribeAddressElement.querySelector(
                  ".tribe-street-address"
                );
                const stateElement =
                  tribeAddressElement.querySelector(".tribe-locality");

                // Endereço da rua, número e bairro
                if (tribeStreetElement)
                  eventData.address.locality = tribeStreetElement.textContent;

                // Nome do estado
                if (stateElement)
                  eventData.address.country = stateElement.textContent;
              }
            }

            return eventData;
          });

          //Remover items duplicados que estão presentes no container de carousel
          return [
            ...new Map(result.map((item) => [item["title"], item])).values(),
          ];
        }
      );

      await this.scrapper.closeBrowser();

      return right(events);
    } catch (error) {
      Logger.error("Falha ao buscar eventos");
      Logger.error(error);

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }

  public async getUpcomingEvents(): Promise<Either<Error, Array<EventEntity>>> {
    return await this.getMainEvents(
      ".ticketbox_upcoming-events-content .owl-stage"
    );
  }

  public async getHightLightsEvents(): Promise<
    Either<Error, Array<EventEntity>>
  > {
    return await this.getMainEvents(
      ".ticketbox_featured-events-content .owl-stage"
    );
  }

  public async getEventsBySearchParams(
    request: EventsDataMiner.PageNumber | EventsDataMiner.EventQueryParams,
    timeout: number = 25000
  ): Promise<Either<Error, Array<Required<EventEntity>>>> {
    const url = this.formatUrl(request);

    try {
      Logger.info(`Iniciando busca de evento pela a url ${url}`);

      await this.scrapper.launch(browserOptions.launchConfig);

      await this.scrapper.openNewTab();

      await this.scrapper.navigateToUrl(url, timeout);

      await this.scrapper.waitForElement("#tribe-events-content");

      // All events elements
      const eventsElements = await this.scrapper.querySelectorAll(
        ".tribe-events-loop .type-tribe_events"
      );

      if (!eventsElements) {
        throw new Error("Não foi possível carregar eventos.");
      }

      const events = await Promise.all(
        eventsElements.map((elementHandle) =>
          this.scrapper.pageElementEvaluate((el) => {
            const eventData: EventEntity = {
              pageUrl: null,
              imageUrl: null,
              date: null,
              title: null,
              cost: null,
              address: {
                locality: null,
                postalCode: null,
                street: null,
                country: null,
                mapUrl: null,
                pageUrl: null,
                venueName: null,
              },
              schedule: {
                start: null,
                end: null,
                time: null,
              },
            };

            const eventContentWrapper = el.querySelector(
              ".ticketbox-events-list-event-content-wrapper"
            );
            //imagem e data
            const eventImageWrapper = eventContentWrapper
              .querySelector(".ticketbox_event_featured_image")
              ?.querySelector("a");

            if (eventContentWrapper) {
              const pageUrl = eventImageWrapper.href;

              if (pageUrl) eventData.pageUrl = pageUrl;

              const imageElement = eventImageWrapper
                .querySelector(".tribe-events-event-image")
                ?.getElementsByTagName("img")[0];

              const imageUrl = imageElement?.src;

              if (imageUrl) eventData.imageUrl = imageUrl;

              const eventDateDetails =
                eventImageWrapper.querySelector(".event-date");

              if (eventDateDetails) {
                const eventDay =
                  eventDateDetails.querySelector(".date")?.textContent;

                const eventMonth =
                  eventDateDetails.querySelector(".month")?.textContent;

                if (eventDay && eventMonth)
                  eventData.date = eventDay + " de " + eventMonth;
              }
            }

            //Descrição do evento (preço, ano, título)
            const eventContent = eventContentWrapper.querySelector(
              ".ticketbox_event_content"
            );
            if (eventContent) {
              const title = eventContent
                .querySelector(".tribe-events-list-event-title")
                ?.textContent.trim();

              if (title) eventData.title = title;

              const cost = eventContent
                .querySelector(".tribe-events-event-cost")
                .textContent.trim();

              if (cost) eventData.cost = cost;

              const metaInfo = eventContent.querySelector(
                ".tribe-events-event-meta"
              );
              //Agenda (datas, horários)
              const schedule = metaInfo.querySelector(
                ".tribe-event-schedule-details"
              );

              const dateStart = schedule.querySelector(
                ".tribe-event-date-start"
              ).textContent;

              if (dateStart) eventData.schedule!.start = dateStart;

              const dateEndElement = schedule.querySelector(
                ".tribe-event-date-end"
              );

              const dateEnd = dateEndElement && dateEndElement.textContent;

              if (dateEnd) eventData.schedule!.end = dateEnd;

              const timeElement = schedule.querySelector(".tribe-event-time");

              const time = timeElement && timeElement.textContent;

              if (time) eventData.schedule!.time = time;

              //Local
              const venueDetails = metaInfo.querySelector(
                ".tribe-events-venue-details"
              );

              // adota esse modelo
              const address = [
                {
                  selector: "a",
                  key: "pageUrl",
                  elementAttr: "href",
                },
                {
                  selector: "a",
                  key: "venueName",
                  elementAttr: "textContent",
                },
                {
                  selector: ".tribe-street-address",
                  key: "street",
                  elementAttr: "textContent",
                },
                {
                  selector: ".tribe-locality",
                  key: "locality",
                  elementAttr: "textContent",
                },
                {
                  selector: ".tribe-postal-code",
                  key: "postalCode",
                  elementAttr: "textContent",
                },
                {
                  selector: ".tribe-country-name",
                  key: "country",
                  elementAttr: "textContent",
                },
                {
                  selector: ".tribe-events-gmap",
                  key: "mapUrl",
                  elementAttr: "href",
                },
              ];

              address.forEach(({ selector, key, elementAttr }) => {
                const element = venueDetails.querySelector(selector);
                const data = element[elementAttr];
                if (data)
                  Object.assign(eventData.address, {
                    [key]: data,
                  });
              });
            }

            return eventData;
          }, elementHandle)
        )
      );

      await this.scrapper.closeBrowser();

      return right(events as Array<Required<EventEntity>>);
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(`Falha ao buscar evento pelo endereço ${url}`);
        Logger.error(error);
      }

      await this.scrapper.closeBrowser();

      return left(error as Error);
    }
  }
}
