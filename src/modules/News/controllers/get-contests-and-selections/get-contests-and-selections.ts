import { badRequest, ok } from "../../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../../shared/presentation/http-response";
import { ValidateGetContestAndSelectionsRequest } from "../../infra/validator/validate-request";
import {
  ShowContestsAndSelectionsRequestDTO,
  ShowContestsAndSelectionsResponseDTO,
} from "./dto";
import { ShowContestsAndSelectionsUseCase } from "../../use-cases/get-contests-and-selections";

export class ShowContestsAndSelectionsController {
  private getContestsAndSelections: ShowContestsAndSelectionsUseCase;
  private validateInput: ValidateGetContestAndSelectionsRequest;

  constructor(
    getContestsAndSelections: ShowContestsAndSelectionsUseCase,
    validateInput: ValidateGetContestAndSelectionsRequest
  ) {
    this.getContestsAndSelections = getContestsAndSelections;
    this.validateInput = validateInput;
  }

  async handle(
    request: ShowContestsAndSelectionsRequestDTO
  ): Promise<HttpResponse<ShowContestsAndSelectionsResponseDTO>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      const result = await this.getContestsAndSelections.execute(request);

      if (result.isLeft()) {
        return badRequest(result.value);
      }

      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
