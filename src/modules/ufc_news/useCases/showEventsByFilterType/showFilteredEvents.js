
const { browserOptions, timeoutToRequest } = require("../../../../config/puppeteer");
const { AppError } = require("../../../../shared/errors/AppErrors");

class ShowFilteredEventsUseCase {
  constructor(puppeteer) {
    this.scrapper = puppeteer
  }
  async execute({
    date = '',
    day = '',
    keyWord = '',
    area = '',
    category = '',
    campus = '',
  }) {
    const browser = await this.scrapper.launch(browserOptions);
    try {
      const page = await browser.newPage();
      const url = `https://agenda.ufc.br/eventos/lista/?tribe-bar-date=${date}&tribe-bar-date-day=${day}&tribe-bar-search=${keyWord}&tribe-bar-campus=${campus}&tribe-bar-categoria=${category}&tribe-bar-area=${area}`
      await page.goto(url,{
        timeout:timeoutToRequest
      });

      console.log('filtered events ', url)

      page.once("load", () =>
        console.log("Page de EVENTOS carregada com sucesso!")
      );

      await page.waitForSelector("#tribe-events-content");

      //.tribe-events-loop .type-tribe_events
      const tribeEventsContainer = await page.$$(
        ".tribe-events-loop .type-tribe_events"
      );

      if (!tribeEventsContainer.length) {
        await browser.close();
        return []
      }

      const formattedItems = await Promise.all(
        //
        tribeEventsContainer.map((el) =>
          el.evaluate((el) => {
            const contentWrapper = el.querySelector(
              ".ticketbox-events-list-event-content-wrapper"
            );
            //ticketbox_event_featured_image -> imagem e data
            const a = contentWrapper
              .querySelector(".ticketbox_event_featured_image")
              .querySelector("a");

            const pageUrl = a.href;
            const imageUrl = a
              .querySelector(".tribe-events-event-image")
              .getElementsByTagName("img")[0].src;

            const eventDateContent = a.querySelector(
              ".event-date"
            );

            const day = eventDateContent.querySelector(".date").textContent;
            const month = eventDateContent.querySelector(".month").textContent;
            const fullEventDate = day + " de " + month;

            //ticketbox_event_content -> preço, ano, título
            const content = contentWrapper.querySelector(
              ".ticketbox_event_content"
            );
            const title = content.querySelector(
              ".tribe-events-list-event-title"
            ).textContent.trim();
            const cost = content.querySelector(
              ".tribe-events-event-cost"
            ).textContent.trim();

            const metaInfo = content.querySelector(".tribe-events-event-meta");
            //Agenda (datas, horários)
            const schedule = metaInfo.querySelector(
              ".tribe-event-schedule-details"
            );

            const dateStart = schedule.querySelector(
              ".tribe-event-date-start"
            ).textContent;
            const dateEnd = schedule.querySelector(
              ".tribe-event-date-end"
            ) && schedule.querySelector(
              ".tribe-event-date-end"
            ).textContent;
            const time = schedule.querySelector(
              ".tribe-event-time"
            ) && schedule.querySelector(
              ".tribe-event-time"
            ).textContent

            //Local
            const venueDetails = metaInfo.querySelector(
              ".tribe-events-venue-details"
            );
            const venue = venueDetails.querySelector("a");
            const addressPage = venue && venue.href; //Link para a página do local
            const venueName = venue && venue.textContent;

            const address = venueDetails.querySelector(".tribe-address");
            const streetAddress = address.querySelector(
              ".tribe-street-address"
            ) && address.querySelector(
              ".tribe-street-address"
            ).textContent;
            const locality = address.querySelector(".tribe-locality") &&
              address.querySelector(".tribe-locality").textContent;
            const postalCode =
              address.querySelector(".tribe-postal-code") &&
              address.querySelector(".tribe-postal-code").textContent;
            const country =
              address.querySelector(".tribe-country-name") &&
              address.querySelector(".tribe-country-name").textContent;

            const mapUrl = venueDetails.querySelector(".tribe-events-gmap") &&
              venueDetails.querySelector(".tribe-events-gmap").href;

            return {
              pageUrl,
              imageUrl,
              date: fullEventDate,
              title,
              cost,
              address: {
                locality,
                postalCode,
                streetAddress,
                country,
                mapUrl,
                addressPage,
                venueName,
              },
              schedule: {
                dateStart,
                dateEnd,
                time
              },
            };
          })
        )
      );

      await page.close()
      await browser.close();
      
      return formattedItems;
    } catch (error) {
      await browser.close();
      if (error instanceof this.scrapper.errors.TimeoutError) {
        throw new AppError({
          message:
              "[TIMEOUT] - Falha ao buscar eventos por filtro pois o tempo limite de requisição foi alcançado " +
              error,
          statusCode: 504,
      });
      }
      throw new AppError({message:`Falha ao realizar busca de eventos por filtro . Error -> ${error.message}`});
    }
  }
}
module.exports = {
  ShowFilteredEventsUseCase,
};
