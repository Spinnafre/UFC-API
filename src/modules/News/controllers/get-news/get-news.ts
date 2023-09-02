export class GetNewsController {
  constructor(getAllNewsUseCase) {
    this.getAllNewsUseCase = getAllNewsUseCase;
  }
  async handle(req, res, next) {
    const { pageNumber, title, domain } = req.query;
    try {
      const result = await this.getAllNewsUseCase.execute(
        pageNumber,
        title,
        domain
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
