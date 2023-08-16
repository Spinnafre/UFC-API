class ShowEventsPerPageController {
  constructor(showEventsPerPage) {
    this.showEventsPerPage = showEventsPerPage;
  }
  async handle(req, res,next) {
    try {
      const {id}=req.params
      const result = await this.showEventsPerPage.execute(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  ShowEventsPerPageController,
};
