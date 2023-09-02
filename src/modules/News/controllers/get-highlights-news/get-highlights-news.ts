export class ShowHighlightsNewsController {
  constructor(showHighlightsNewsUseCase) {
    this.showHighlightsNewsUseCase = showHighlightsNewsUseCase;
  }
  async handle(req, res, next) {
    try {
      const result = await this.showHighlightsNewsUseCase.execute();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
