import { Express, Router } from "express";

import restaurant from "../../../modules/Restaurant/infra/http/routes/restaurant.routes";

export function setupRoutes(app: Express): void {
  app.get("/ping", (req, res) => {
    res.json({ msg: "ok" });
    return res.end();
  });

  app.use("/api/v1/restaurant", restaurant);
}
