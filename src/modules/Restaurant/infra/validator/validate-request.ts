import Joi from "joi";

import { Either, left, right } from "../../../../shared/Either";
import { validateInput } from "../../../../shared/input-validator";
import { Logger } from "../../../../shared/infra/logger/logger";
import {
  GetUserBalanceRequestDTO,
  PutCreditsInCardRequestDTO,
  ShowMenuRequestDTO,
} from "../../controllers/ports";

export class ValidateUserBalanceRequest
  implements
    validateInput<
      GetUserBalanceRequestDTO,
      Either<Joi.ValidationError, GetUserBalanceRequestDTO>
    >
{
  validate(
    request: GetUserBalanceRequestDTO
  ): Either<Joi.ValidationError, GetUserBalanceRequestDTO> {
    const schema = Joi.object({
      card_number: Joi.number().integer().required(),
      registry_number: Joi.number().integer().required(),
    });

    const { error, warning } = schema.validate(request);

    if (error) {
      Logger.error(error);
      return left(error);
    }

    return right(request);
  }
}

export class ValidatePutUserCreditsRequest
  implements
    validateInput<
      PutCreditsInCardRequestDTO,
      Either<Joi.ValidationError, PutCreditsInCardRequestDTO>
    >
{
  validate(
    request: PutCreditsInCardRequestDTO
  ): Either<Joi.ValidationError, PutCreditsInCardRequestDTO> {
    const schema = Joi.object({
      card_number: Joi.number().integer().required(),
      registry_number: Joi.number().integer().required(),
      qtd_credits: Joi.number().integer().required(),
      paymentMethod: Joi.string().valid("pix", "gru").required(),
    });

    const { error, warning } = schema.validate(request);

    if (error) {
      Logger.error(error);
      return left(error);
    }

    return right(request);
  }
}

export class ValidateShowMenuRequest
  implements
    validateInput<
      ShowMenuRequestDTO,
      Either<Joi.ValidationError, ShowMenuRequestDTO>
    >
{
  validate(
    request: ShowMenuRequestDTO
  ): Either<Joi.ValidationError, ShowMenuRequestDTO> {
    const schema = Joi.object({
      date: Joi.date().min("2019-01-01").iso().required(),
    });

    const { error, warning } = schema.validate(request);

    if (error) {
      Logger.error(error);
      return left(error);
    }

    return right(request);
  }
}
