import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { EventsServices } from "../../infra/services";
import { GetUpcomingEventsUseCase } from "../../use-cases";

export const GetUpcomingEventsUseCaseFactory = () => {
  const eventDataMinerServices = new EventsServices(PuppeteerAdapter.create());
  return new GetUpcomingEventsUseCase(eventDataMinerServices);
};
