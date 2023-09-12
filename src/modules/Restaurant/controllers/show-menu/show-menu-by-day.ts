import { badRequest, ok } from "../../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../../shared/presentation/http-response";
import { ValidateShowMenuRequest } from "../../infra/validator/validate-request";
import { ShowMenuRequestDTO, ShowMenuResponseItems } from "./dto";

export class ShowMenuByDayController {
  private showMenu: any;
  private validateInput: ValidateShowMenuRequest;
  constructor(showMenu: any, validateInput: ValidateShowMenuRequest) {
    this.showMenu = showMenu;
    this.validateInput = validateInput;
  }
  async handle(
    request: ShowMenuRequestDTO
  ): Promise<HttpResponse<ShowMenuResponseItems>> {
    try {
      const isValidOrError = this.validateInput.validate(request);

      if (isValidOrError.isLeft()) {
        return badRequest(isValidOrError.value);
      }
      const result = await this.showMenu.execute(request);
      if (result.isLeft()) {
        return badRequest(result.value);
      }
      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}
