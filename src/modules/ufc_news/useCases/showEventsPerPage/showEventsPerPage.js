const puppeteer = require("puppeteer");

class ShowEventsPerPageUseCase {
  async execute(pageNumber) {
    try {
      const browser = await puppeteer.launch({headless: true,args:['--no-sandbox','--disable-setuid-sandbox']});
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(15000);
      await page.goto(
        `https://agenda.ufc.br/eventos/lista/?tribe_event_display=list&tribe_paged=${pageNumber}`
      );

      page.once("load", () =>
        console.log("Page inicial de EVENTOS carregada com sucesso!")
      );

      await page.waitForSelector("#tribe-events-content");

      //.tribe-events-loop .type-tribe_events
      const tribeEventsContainer = await page.$$(
        ".tribe-events-loop .type-tribe_events"
      );

      if(!tribeEventsContainer.length){
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

      
      await browser.close();

      return formattedItems;
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
        throw new Error("[TIMEOUT] - "+error)
      }
      throw new Error(error)
      
    }
  }
}

module.exports = {
  ShowEventsPerPageUseCase,
};
