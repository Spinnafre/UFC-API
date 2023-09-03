import Joi from "joi";
import { Either, left, right } from "../../../../shared/Either";
import { validateInput } from "../../../../shared/input-validator";
import { GetAllNewsRequestDTO } from "../../controllers/gel-all-news/dto";
import { ShowContestsAndSelectionsRequestDTO } from "../../controllers/get-contests-and-selections/dto";
import { GetNewsByDomainRequestDTO } from "../../controllers/get-news-by-domain/dto";
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
      console.log("[REQUEST VALIDATION] ::: ", error);
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
      console.log(
        "[REQUEST VALIDATION] ::: ",
        error.details.map((details) => details.message).join(", ")
      );
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
      console.log("[REQUEST VALIDATION] ::: ", error);
      return left(error);
    }

    return right(request);
  }
}
