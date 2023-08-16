import { badRequest, ok } from "../../../../shared/presentation/http-helpers";

export class ShowMenuController {
  showMenuUseCase: any;
  constructor(showMenuUseCase: any) {
    this.showMenuUseCase = showMenuUseCase;
  }
  async handle(request: any) {
    try {
      const result = await this.showMenuUseCase.execute(request);
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
