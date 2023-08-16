import { NextFunction, Request, Response, Router } from "express";

const showNewsController = require("../../../../modules/ufc_news/useCases/showNews");
const showHighlightsNewsController = require("../../../../modules/ufc_news/useCases/showHighlightsNews");
const showFilteredEventsController = require("../../../../modules/ufc_news/useCases/showEventsByFilterType");
const showMainEventsController = require("../../../../modules/ufc_news/useCases/showMainEvents");
const showEventsPerPageController = require("../../../../modules/ufc_news/useCases/showEventsPerPage");
const showContestsAndSelectionsController = require("../../../../modules/ufc_news/useCases/showContestsAndSelections");
const showNewsByDomainController = require("../../../../modules/ufc_news/useCases/getNewsByDomain");

export const newsRouter = (): Router => {
  const router = Router();

  router.get("/", (req: Request, res: Response, next: NextFunction) => {
    return showNewsController().handle(req, res, next);
  });

  router.get("/ping", (req, res) => {
    res.json({ msg: "ok" });
    return res.end();
  });

  router.get("/all", (req, res, next) => {
    return showNewsByDomainController().handle(req, res, next);
  });

  router.get("/contestsAndSelections", (req, res, next) => {
    return showContestsAndSelectionsController().handle(req, res, next);
  });

  router.get("/highlightsNews", (req, res, next) => {
    return showHighlightsNewsController().handle(req, res, next);
  });

  router.get("/events", (req, res, next) => {
    return showFilteredEventsController().handle(req, res, next);
  });

  router.get("/events/:id", (req, res, next) => {
    return showEventsPerPageController().handle(req, res, next);
  });

  router.get("/main-events", (req, res, next) => {
    return showMainEventsController().handle(req, res, next);
  });

  return router;
};
