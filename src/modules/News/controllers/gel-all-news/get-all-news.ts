import { badRequest, ok } from "../../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../../shared/presentation/http-response";
import { ValidateGetAllNewsRequest } from "../../infra/validator/validate-request";
import { ShowNewsUseCase } from "../../use-cases/get-all-news";
import { GetAllNewsRequestDTO } from "./dto";
export class ShowNewsController {
  private getNews: ShowNewsUseCase;
  private validateInput: ValidateGetAllNewsRequest;

  constructor(
    getNews: ShowNewsUseCase,
    validateInput: ValidateGetAllNewsRequest
  ) {
    this.getNews = getNews;
    this.validateInput = validateInput;
  }

  async handle(request: GetAllNewsRequestDTO): Promise<HttpResponse<any>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }

      const result = await this.getNews.execute(request);

      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
