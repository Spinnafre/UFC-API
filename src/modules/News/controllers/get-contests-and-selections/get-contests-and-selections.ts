export class ShowContestsAndSelectionsController {
  private showContestsAndSelectionsUseCase: any;

  constructor(showContestsAndSelectionsUseCase: any) {
    this.showContestsAndSelectionsUseCase = showContestsAndSelectionsUseCase;
  }

  async handle(req, res, next) {
    try {
      const { pageNumber, title } = req.query;
      const result = await this.showContestsAndSelectionsUseCase.execute(
        pageNumber,
        title
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
