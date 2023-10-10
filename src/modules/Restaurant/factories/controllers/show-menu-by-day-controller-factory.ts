import { ShowMenuByDayController } from "../../controllers/show-menu-by-day";
import { ValidateShowMenuRequest } from "../../infra/validator/validate-request";
import { showMenuByDayUseCaseFactory } from "../use-cases/show-menu-by-day-factory";

export const showMenuByDayControllerFactory = () => {
  return new ShowMenuByDayController(
    showMenuByDayUseCaseFactory(),
    new ValidateShowMenuRequest()
  );
};
