import { Express } from "express";

import events from "../../../modules/Events/infra/http/routes/events.routes";
import news from "../../../modules/News/infra/http/routes/news.routes";
import restaurant from "../../../modules/Restaurant/infra/http/routes/restaurant.routes";

export function setupRoutes(app: Express): void {
  app.get("/ping", (req, res) => {
    res.json({ msg: "ok" });
    return res.end();
  });

  app.use("/api/v1/restaurant", restaurant);
  app.use("/api/v1/news", news);
  app.use("/api/v1/events", events);
}
