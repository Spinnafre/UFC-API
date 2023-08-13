const { browserOptions, timeoutToRequest } = require("../../../../config/puppeteer");
const { AppError } = require("../../../../shared/errors/AppErrors");

class ShowHighlightsEventsUseCase {
    constructor(puppeteer){
      this.scrapper=puppeteer
    }
    async execute() {
      const browser = await this.scrapper.launch(browserOptions);
        try {
          const page = await browser.newPage();
  
          await page.goto("https://agenda.ufc.br/",{
            timeout:1000
        });
          page.once("load", () =>
            console.log("Page inicial de EVENTOS carregada com sucesso!")
          );
      
      
          await page.waitForSelector(".entry-content");
      
          //Eventos em destaque
          const highlightsEvents = await page.$eval(".ticketbox_featured-events-content .owl-stage", (el) => {
            const result = [];
            const activeItems = el.querySelectorAll(".owl-item");
            activeItems.forEach((item) => {
              const eventLink = item
                .querySelector(".event-item-feature")
                .querySelector("a").href;
              const imgURL = item
                .querySelector(".event-item-feature")
                .querySelector("a")
                .querySelector("img").src;
              const eventDateContent = item
                .querySelector(".event-item-feature")
                .querySelector("a")
                .querySelector(".event-date");
              const eventDay =
                eventDateContent.getElementsByClassName("date")[0].textContent;
              const eventMonth =
                eventDateContent.getElementsByClassName("month")[0].textContent;
              const fullEventDate = eventDay + " de " + eventMonth;
              const content = item.querySelector(".event-item-cotent");
              // Título da postagem
              const titleURL =
                content.querySelector(".event-item-title").querySelector("a") &&
                content
                  .querySelector(".event-item-title")
                  .getElementsByTagName("a")[0].href;
              const title =
                content.querySelector(".event-item-title").querySelector("a") &&
                content
                  .querySelector(".event-item-title")
                  .getElementsByTagName("a")[0].textContent;
              const price =
                content.querySelector(".event-item-price.ticketbox-price") &&
                content.querySelector(".event-item-price.ticketbox-price")
                  .textContent.trim()
              // Subtítulo da postagem
              const locationDetails = content
                .querySelector(".event-item-location")
                .querySelector(".tribe-events-venue-details");
              const locationURL =
                locationDetails.querySelector("a") &&
                locationDetails.querySelector("a").href;
              const locationName =
                locationDetails.querySelector("a") &&
                locationDetails.querySelector("a").textContent;
      
              const tribeAddress = locationDetails.querySelector(".tribe-address");
              // Endereço da rua, número e bairro
              const tribeStreetAddress =
                tribeAddress.querySelector(".tribe-street-address") &&
                tribeAddress.querySelector(".tribe-street-address").textContent;
              // Nome do estado
              const tribeLocality =
                tribeAddress.querySelector(".tribe-locality") &&
                tribeAddress.querySelector(".tribe-locality").textContent;
      
              result.push({
                img_url: imgURL,
                event_link: eventLink,
                title: title,
                title_url: titleURL,
                price,
                eventDate: fullEventDate,
                address: {
                  location_url: locationURL,
                  location_name: locationName,
                  street: tribeStreetAddress,
                  locality: tribeLocality,
                },
              });
            });
      
            //Remover items duplicados que estão presentes no container de carousel
            function getUniqueListBy(arr, key) {
              return [...new Map(arr.map((item) => [item[key], item])).values()];
            }
      
            const filteredArray = getUniqueListBy(result, "title");
      
            return filteredArray;
          });
      
          //Próximos eventos
          const next_events=await page.$eval(".ticketbox_upcoming-events-content .owl-stage",(el)=>{
            const result = [];
            const activeItems = el.querySelectorAll(".owl-item");
            activeItems.forEach((item) => {
              const eventLink = item
                .querySelector(".event-item-feature")
                .querySelector("a").href;
              const imgURL = item
                .querySelector(".event-item-feature")
                .querySelector("a")
                .querySelector("img").src;
              const eventDateContent = item
                .querySelector(".event-item-feature")
                .querySelector("a")
                .querySelector(".event-date");
              const eventDay =
                eventDateContent.getElementsByClassName("date")[0].textContent;
              const eventMonth =
                eventDateContent.getElementsByClassName("month")[0].textContent;
              const fullEventDate = eventDay + " de " + eventMonth;
              const content = item.querySelector(".event-item-cotent");
              // Título da postagem
              const titleURL =
                content.querySelector(".event-item-title").querySelector("a") &&
                content
                  .querySelector(".event-item-title")
                  .getElementsByTagName("a")[0].href;
              const title =
                content.querySelector(".event-item-title").querySelector("a") &&
                content
                  .querySelector(".event-item-title")
                  .getElementsByTagName("a")[0].textContent;
              const price =
                content.querySelector(".event-item-price.ticketbox-price") &&
                content.querySelector(".event-item-price.ticketbox-price")
                  .textContent.trim();
              // Subtítulo da postagem
              
              const locationDetails = item
                .querySelector(".tribe-events-venue-details")
              const locationURL =
                locationDetails.querySelector("a") &&
                locationDetails.querySelector("a").href;
              const locationName =
                locationDetails.querySelector("a") &&
                locationDetails.querySelector("a").textContent;
      
              const tribeAddress = locationDetails.querySelector(".tribe-address");
              // Endereço da rua, número e bairro
              const tribeStreetAddress =
                tribeAddress.querySelector(".tribe-street-address") &&
                tribeAddress.querySelector(".tribe-street-address").textContent;
              // Nome do estado
              const tribeLocality =
                tribeAddress.querySelector(".tribe-locality") &&
                tribeAddress.querySelector(".tribe-locality").textContent;
      
              result.push({
                img_url: imgURL,
                event_link: eventLink,
                title: title,
                title_url: titleURL,
                price,
                eventDate: fullEventDate,
                address: {
                  location_url: locationURL,
                  location_name: locationName,
                  street: tribeStreetAddress,
                  locality: tribeLocality,
                },
              });
            });
      
            //Remover items duplicados que estão presentes no container de carousel
            function getUniqueListBy(arr, key) {
              return [...new Map(arr.map((item) => [item[key], item])).values()];
            }
      
            const filteredArray = getUniqueListBy(result, "title");
      
            return filteredArray;
          })
      
          await browser.close();
          
          return {
            highlightsEvents,
            next_events
          }
          
        } catch (error) {
          await browser.close();
          if (error instanceof this.scrapper.errors.TimeoutError) {
            throw new AppError({
              message:
                  "[TIMEOUT] - Falha ao buscar eventos principais pois o tempo limite de requisição foi alcançado " +
                  error,
              statusCode: 504,
          });
          }
          throw new AppError({message:`Falha ao realizar busca de eventos principais . Error -> ${error.message}`});
        }
      }
}

module.exports = {
    ShowHighlightsEventsUseCase
}
