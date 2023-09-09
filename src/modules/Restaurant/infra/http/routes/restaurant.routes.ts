import { Router } from "express";
import {
  showMenuByDayControllerFactory,
  putCreditsInCardControllerFactory,
  showBalanceByUserControllerFactory,
} from "../../../factories/controllers";

const router = Router();

router.get("/menu", async (req, res) => {
  const { date } = req.query;

  const request = {
    date: date as string,
  } as const;

  const result = await showMenuByDayControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

router.get("/getUserBalance", async (req, res) => {
  const { card_number, registry_number } = req.query;

  // pass params validations to middleware?
  const request = {
    card_number: Number(card_number),
    registry_number: Number(registry_number),
  } as const;

  console.log(request);

  const result = await showBalanceByUserControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

router.get("/getPaymentInfo", async (req, res) => {
  const { card_number, registry_number, qtd_credits, paymentMethod } =
    req.query;

  const request = {
    card_number: Number(card_number),
    registry_number: Number(registry_number),
    qtd_credits: Number(qtd_credits),
    paymentMethod: paymentMethod as string,
  } as const;

  const result = await putCreditsInCardControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

export default router;
