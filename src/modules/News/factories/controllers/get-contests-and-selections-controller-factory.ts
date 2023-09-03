import { ShowContestsAndSelectionsController } from "../../controllers/get-contests-and-selections/get-contests-and-selections";
import { ValidateGetContestAndSelectionsRequest } from "../../infra/validator/validate-request";
import { getContestAndSelectionsFactory } from "../use-cases/get-contest-and-selections-factory";

export const getContestAndSelectionsControllerFactory = () => {
  return new ShowContestsAndSelectionsController(
    getContestAndSelectionsFactory(),
    new ValidateGetContestAndSelectionsRequest()
  );
};
