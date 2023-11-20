import { NextFunction, Request, Response, Router } from "express";

import { GetEventControllerDTO } from "../../../controllers/get-events.controller";
import {
  getEventsControllerFactory,
  getHighlightsEventsControllerFactory,
  getUpcomingEventsControllerFactory,
} from "../../../factories/controllers";

const router = Router();

router.get(
  "/upcoming",
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await getUpcomingEventsControllerFactory().handle();

    return res.status(result.status).json(result.body);
  }
);

router.get("/highlights", async (req, res, next) => {
  const result = await getHighlightsEventsControllerFactory().handle();

  return res.status(result.status).json(result.body);
});

router.get("/", async (req, res, next) => {
  const { pageNumber } = req.query;
  const page = pageNumber ? Number(pageNumber) : null;

  let dto: GetEventControllerDTO.Request;

  if (page) {
    dto = page | 0;
  } else {
    const { keyWord, date, campus, category, area } = req.query;
    dto = {
      date: date || "",
      keyWord: keyWord || "",
      campus: campus || "",
      category: category || "",
      area: area || "",
    } as GetEventControllerDTO.Request;
  }

  const result = await getEventsControllerFactory().handle(dto);

  return res.status(result.status).json(result.body);
});

export default router;
