export class ShowNewsController {
  constructor(showNewsUseCase) {
    this.showNewsUseCase = showNewsUseCase;
  }
  async handle(req, res, next) {
    try {
      const { pageNumber, title } = req.query;
      const result = await this.showNewsUseCase.execute(pageNumber, title);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
