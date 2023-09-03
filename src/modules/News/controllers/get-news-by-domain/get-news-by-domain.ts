import { badRequest, ok } from "../../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../../shared/presentation/http-response";
import { ValidateGetNewsByDomainRequest } from "../../infra/validator/validate-request";
import { ShowAllNewsByDomainUseCase } from "../../use-cases/get-news-by-domain";
import { GetNewsByDomainRequestDTO, GetNewsByDomainResponseDTO } from "./dto";

export class GetNewsByDomainController {
  private getAllNewsUseCase: ShowAllNewsByDomainUseCase;
  private validateInput: ValidateGetNewsByDomainRequest;

  constructor(
    getAllNewsUseCase: ShowAllNewsByDomainUseCase,
    validateInput: ValidateGetNewsByDomainRequest
  ) {
    this.getAllNewsUseCase = getAllNewsUseCase;
    this.validateInput = validateInput;
  }
  async handle(
    request: GetNewsByDomainRequestDTO
  ): Promise<HttpResponse<GetNewsByDomainResponseDTO>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      const result = await this.getAllNewsUseCase.execute(request);
      if (result.isLeft()) {
        return badRequest(result.value);
      }
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
