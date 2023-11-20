import { badRequest, ok } from "../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../shared/presentation/http-response";
import { ValidateGetEventsRequest } from "../infra/validator/validate-request";
import { GetEventsUseCaseProtocols } from "../use-cases/ports/get-events-protocol";

export class GetEventsController {
  private validateInput: ValidateGetEventsRequest;
  private getEvents: GetEventsUseCaseProtocols.UseCase;

  constructor(
    getEvents: GetEventsUseCaseProtocols.UseCase,
    validator: ValidateGetEventsRequest
  ) {
    this.getEvents = getEvents;
    this.validateInput = validator;
  }
  async handle(
    request: GetEventsUseCaseProtocols.Request
  ): Promise<HttpResponse<any>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      const result = await this.getEvents.execute(request);

      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}

export namespace GetEventControllerDTO {
  export type Request = GetEventsUseCaseProtocols.Request;
}
