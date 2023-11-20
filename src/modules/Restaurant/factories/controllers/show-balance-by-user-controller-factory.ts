import { GetUserBalanceController } from "../../controllers/show-balance-by-user";
import { ValidateUserBalanceRequest } from "../../infra/validator/validate-request";
import { showUserBalanceUseCaseFactory } from "../use-cases/show-balance-by-user-factory";

export const showBalanceByUserControllerFactory = () => {
  return new GetUserBalanceController(
    showUserBalanceUseCaseFactory(),
    new ValidateUserBalanceRequest()
  );
};
