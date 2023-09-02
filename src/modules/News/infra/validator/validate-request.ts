import Joi from "joi";

import { GetUserBalanceRequestDTO } from "../../controllers/show-balance-by-user/dto";
import { Either, left, right } from "../../../../shared/Either";
import { validateInput } from "../../../../shared/input-validator";
import { PutCreditsInCardRequestDTO } from "../../controllers/put-credits-in-card/dto";
import { ShowMenuRequestDTO } from "../../controllers/show-menu/dto";

export class ValidateGetAllNewsRequest
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
      console.log("[REQUEST VALIDATION] ::: ", error);
      return left(error);
    }

    return right(request);
  }
}

export class ValidateGetContestAndSelectionsRequest
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
      input_card_number: Joi.number().integer().required(),
      input_registry_number: Joi.number().integer().required(),
      input_qtd_credits: Joi.number().integer().required(),
      input_paymentMethod: Joi.string().valid("pix", "gru").required(),
    });

    const { error, warning } = schema.validate(request);

    if (error) {
      console.log("[REQUEST VALIDATION] ::: ", error);
      return left(error);
    }

    return right(request);
  }
}

export class ValidateHightLightsNewsRequest
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
      console.log("[REQUEST VALIDATION] ::: ", error);
      return left(error);
    }

    return right(request);
  }
}
