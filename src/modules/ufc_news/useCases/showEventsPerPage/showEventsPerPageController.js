class ShowEventsPerPageController {
  constructor(showEventsPerPage) {
    this.showEventsPerPage = showEventsPerPage;
  }
  async handle(req, res) {
    try {
      const {id}=req.params
      const result = await this.showEventsPerPage.execute(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({
        msg: "Falha ao buscar notícia do site da UFC " + error.message,
      });
    }
  }
}

module.exports = {
  ShowEventsPerPageController,
};
