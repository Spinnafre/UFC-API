import { badRequest, ok } from "../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../shared/presentation/http-response";
import { ValidatePutUserCreditsRequest } from "../infra/validator/validate-request";
import { PutCreditsInCardUseCase } from "../use-cases/put-credits-in-card";
import {
  PutCreditsInCardRequestDTO,
  PutCreditsInCardResponseDTO,
} from "./ports/put-credits-in-card";

export class PutCreditsInCardController {
  private AddUserCredits: PutCreditsInCardUseCase;
  private validateInput: ValidatePutUserCreditsRequest;

  constructor(
    AddUserCredits: PutCreditsInCardUseCase,
    validateInput: ValidatePutUserCreditsRequest
  ) {
    this.AddUserCredits = AddUserCredits;
    this.validateInput = validateInput;
  }

  async handle(
    request: PutCreditsInCardRequestDTO
  ): Promise<HttpResponse<PutCreditsInCardResponseDTO>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }
      // only works with paymentMethod "pix"
      const result = await this.AddUserCredits.execute({
        card_number: request.card_number as number,
        paymentMethod: request.paymentMethod as string,
        qtd_credits: request.qtd_credits as number,
        registry_number: request.registry_number as number,
      });

      if (result.isLeft()) {
        return badRequest(result.value);
      }
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
