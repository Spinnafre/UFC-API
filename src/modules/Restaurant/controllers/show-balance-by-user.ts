import { badRequest, ok } from "../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../shared/presentation/http-response";
import { ValidateUserBalanceRequest } from "../infra/validator/validate-request";
import { ShowBalanceByUserUseCase } from "../use-cases/show-balance-by-user";
import {
  GetUserBalanceRequestDTO,
  GetUserBalanceResponseDTO,
} from "./ports/show-balance-by-user";

export class GetUserBalanceController {
  private getUserBalance: ShowBalanceByUserUseCase;
  private validateInput: ValidateUserBalanceRequest;

  constructor(
    getUserBalance: ShowBalanceByUserUseCase,
    validateInput: ValidateUserBalanceRequest
  ) {
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

      const result = await this.getUserBalance.execute({
        card_number: request.card_number as number,
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
