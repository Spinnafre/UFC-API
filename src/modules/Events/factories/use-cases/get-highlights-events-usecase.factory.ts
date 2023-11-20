import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { EventsServices } from "../../infra/services";
import { GetHighlightsEventsUseCase } from "../../use-cases";

export const GetHighlightsEventsUseCaseFactory = () => {
  const eventDataMinerServices = new EventsServices(PuppeteerAdapter.create());
  return new GetHighlightsEventsUseCase(eventDataMinerServices);
};
