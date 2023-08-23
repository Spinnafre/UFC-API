import { badRequest, ok } from "../../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../../shared/presentation/http-response";
import { ValidateUserBalanceRequest } from "../../infra/validator/validate-request";
import { GetUserBalanceRequestDTO, GetUserBalanceResponseDTO } from "./dto";

export class GetUserBalanceController {
  private getUserBalance: any;
  private validateInput: ValidateUserBalanceRequest;

  constructor(getUserBalance: any, validateInput: ValidateUserBalanceRequest) {
    this.getUserBalance = getUserBalance;
    this.validateInput = validateInput;
  }

  async handle(
    request: GetUserBalanceRequestDTO
  ): Promise<HttpResponse<GetUserBalanceResponseDTO>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }
      const result = await this.getUserBalance.execute(
        request.card_number,
        request.registry_number
      );
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
