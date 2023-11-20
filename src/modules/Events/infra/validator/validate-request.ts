import Joi from "joi";
import { Either, left, right } from "../../../../shared/Either";
import { validateInput } from "../../../../shared/input-validator";
import { Logger } from "../../../../shared/infra/logger/logger";
import { GetEventControllerDTO } from "../../controllers/get-events.controller";

export class ValidateGetEventsRequest
  implements validateInput<any, Either<Joi.ValidationError, any>>
{
  validate(
    request: GetEventControllerDTO.Request
  ): Either<Joi.ValidationError, GetEventControllerDTO.Request> {
    // TO-DO : Create campus, category and area lists
    const schema =
      typeof request === "number"
        ? {
            pageNumber: Joi.number().integer().required(),
          }
        : {
            date: Joi.string().allow(""),
            keyWord: Joi.string().allow(""),
            campus: Joi.string().allow(""),
            category: Joi.string().allow(""),
            area: Joi.string().allow(""),
          };

    const { error, warning } = Joi.object(schema).validate(request);

    if (error) {
      Logger.error(error);
      return left(error);
    }

    return right(request);
  }
}
