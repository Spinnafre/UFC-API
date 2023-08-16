import { Router } from "express";

const showRUMenuByDayController = require("../../../../modules/ufc_ru/menu");
const showRUBalanceByUserController = require("../../../../modules/ufc_ru/balance");
const putCreditsInCardController = require("../../../../modules/ufc_ru/putCreditsInCard");

const router = Router();

router.get("/menu", async (req, res) => {
  const { day } = req.query;
  const result = await showRUMenuByDayController().handle(day);

  return res.status(result.status).json(result.body);
});

router.get("/getUserBalance", async (req, res) => {
  const { card_number, registry_number } = req.query;

  const request = {
    card_number,
    registry_number,
  };

  const result = await showRUBalanceByUserController().handle(request);

  return res.status(result.status).json(result.body);
});

router.get("/getPaymentInfo", async (req, res) => {
  const { card_number, registry_number, qtd_credits, paymentMethod } =
    req.query;

  const request = {
    card_number,
    registry_number,
    qtd_credits,
    paymentMethod,
  };

  const result = await putCreditsInCardController().handle(request);

  return res.status(result.status).json(result.body);
});

export default router;
