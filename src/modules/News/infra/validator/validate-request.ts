import Joi from "joi";
import { Either, left, right } from "../../../../shared/Either";
import { validateInput } from "../../../../shared/input-validator";
import { GetAllNewsRequestDTO } from "../../controllers/ports/get-all-news";
import { ShowContestsAndSelectionsRequestDTO } from "../../controllers/ports/get-contests-and-selections";
import { GetNewsByDomainRequestDTO } from "../../controllers/ports/get-news-by-domain";
import { Logger } from "../../../../shared/infra/logger/logger";
export class ValidateGetAllNewsRequest
  implements
    validateInput<
      GetAllNewsRequestDTO,
      Either<Joi.ValidationError, GetAllNewsRequestDTO>
    >
{
  validate(
    request: GetAllNewsRequestDTO
  ): Either<Joi.ValidationError, GetAllNewsRequestDTO> {
    const schema = Joi.object({
      pageNumber: Joi.number().integer().required(),
      title: Joi.string(),
    });

    const { error, warning } = schema.validate(request);

    if (error) {
      Logger.error(error);
      return left(error);
    }

    return right(request);
  }
}

export class ValidateGetContestAndSelectionsRequest
  implements
    validateInput<
      ShowContestsAndSelectionsRequestDTO,
      Either<Joi.ValidationError, ShowContestsAndSelectionsRequestDTO>
    >
{
  validate(
    request: ShowContestsAndSelectionsRequestDTO
  ): Either<Joi.ValidationError, ShowContestsAndSelectionsRequestDTO> {
    const schema = Joi.object().keys({
      pageNumber: Joi.number().integer().required(),
      title: Joi.string(),
    });

    const { error, warning } = Joi.compile(schema).validate(request);

    if (error) {
      Logger.error(error.details.map((details) => details.message).join(", "));
      return left(error);
    }

    return right(request);
  }
}

export class ValidateGetNewsByDomainRequest
  implements
    validateInput<
      GetNewsByDomainRequestDTO,
      Either<Joi.ValidationError, GetNewsByDomainRequestDTO>
    >
{
  validate(
    request: GetNewsByDomainRequestDTO
  ): Either<Joi.ValidationError, GetNewsByDomainRequestDTO> {
    const schema = Joi.object({
      domain: Joi.string().required(),
      pageNumber: Joi.number().integer().required(),
      title: Joi.string().required(),
    });

    const { error, warning } = schema.validate(request);

    if (error) {
      Logger.error(error);
      return left(error);
    }

    return right(request);
  }
}
