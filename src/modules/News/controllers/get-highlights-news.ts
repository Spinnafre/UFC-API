import { badRequest, ok } from "../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../shared/presentation/http-response";
import { ShowHighlightsNewsUseCase } from "../use-cases/get-highlights-news";
import { GetHighlightsNewsResponseDTO } from "./ports/get-highlights-news";

export class ShowHighlightsNewsController {
  private showHighlightsNewsUseCase: ShowHighlightsNewsUseCase;

  constructor(showHighlightsNewsUseCase: ShowHighlightsNewsUseCase) {
    this.showHighlightsNewsUseCase = showHighlightsNewsUseCase;
  }

  async handle(): Promise<HttpResponse<GetHighlightsNewsResponseDTO>> {
    try {
      const result = await this.showHighlightsNewsUseCase.execute();

      if (result.isLeft()) {
        return badRequest(result.value);
      }

      return ok(result);
    } catch (error) {
      console.error(error);
      return badRequest(error as Error);
    }
  }
}
