import { badRequest, ok } from "../../../../shared/presentation/http-helpers";

export class ShowRUBalanceByUserController {
  private showRUBalanceByUserUseCase: any;
  constructor(showRUBalanceByUserUseCase: any) {
    this.showRUBalanceByUserUseCase = showRUBalanceByUserUseCase;
  }
  async handle(request: any) {
    try {
      const result = await this.showRUBalanceByUserUseCase.execute(
        request.card_number,
        request.registry_number
      );
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
