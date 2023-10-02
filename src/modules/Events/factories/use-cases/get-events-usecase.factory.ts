import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { EventsServices } from "../../infra/services";
import { GetEventsUseCase } from "../../use-cases";

export const GetEventsUseCaseFactory = () => {
  const eventDataMinerServices = new EventsServices(PuppeteerAdapter.create());
  return new GetEventsUseCase(eventDataMinerServices);
};
