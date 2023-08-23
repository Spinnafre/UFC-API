import { badRequest, ok } from "../../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../../shared/presentation/http-response";
import { ValidatePutUserCreditsRequest } from "../../infra/validator/validate-request";
import { PutCreditsInCardRequestDTO, PutCreditsInCardResponseDTO } from "./dto";

export class PutCreditsInCardController {
  private AddUserCredits: any;
  private validateInput: ValidatePutUserCreditsRequest;

  constructor(
    AddUserCredits: any,
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
      const result = await this.AddUserCredits.execute(request);
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
