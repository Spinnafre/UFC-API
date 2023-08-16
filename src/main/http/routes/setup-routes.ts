import { Express, Router } from "express";

export function setupRoutes(app: Express): void {
  const router = Router();

  app.get("/ping", (req, res) => {
    res.json({ msg: "ok" });
    return res.end();
  });

  app.use("/api/v1", router);
}
