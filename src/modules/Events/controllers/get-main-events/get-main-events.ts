export class ShowHighlightsEventsController {
  constructor(showHighlightsEventsUseCase) {
    this.showHighlightsEventsUseCase = showHighlightsEventsUseCase;
  }
  async handle(req, res, next) {
    try {
      const result = await this.showHighlightsEventsUseCase.execute();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
