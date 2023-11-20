import { NextFunction, Request, Response, Router } from "express";

import {
  getContestAndSelectionsControllerFactory,
  getHighlightsNewsControllerFactory,
  getNewsByDomainControllerFactory,
  getNewsControllerFactory,
} from "../../../factories/controllers";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { pageNumber, title } = req.query;

  const request = {
    pageNumber: Number(pageNumber),
    title: title as string,
  } as const;

  const result = await getNewsControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

router.get("/all", async (req, res, next) => {
  const { pageNumber, title, domain } = req.query;

  const request = {
    pageNumber: Number(pageNumber),
    title: title as string,
    domain: domain as string,
  } as const;

  const result = await getNewsByDomainControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

router.get("/contestsAndSelections", async (req, res, next) => {
  const { pageNumber, title } = req.query;

  const request = {
    pageNumber: Number(pageNumber),
    title: title as string,
  } as const;

  const result = await getContestAndSelectionsControllerFactory().handle(
    request
  );

  return res.status(result.status).json(result.body);
});

router.get("/highlightsNews", async (req, res, next) => {
  const result = await getHighlightsNewsControllerFactory().handle();
  return res.status(result.status).json(result.body);
});

export default router;
