import { GetUserBalanceRequestDTO } from "./../../../controllers/show-balance-by-user/dto";
import { Router } from "express";
import {
  showMenuByDayControllerFactory,
  putCreditsInCardControllerFactory,
  showBalanceByUserControllerFactory,
} from "../../../factories/controllers";
import { PutCreditsInCardRequestDTO } from "../../../controllers/put-credits-in-card/dto";

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
    card_number: card_number as unknown as number,
    registry_number: registry_number as unknown as number,
  } as GetUserBalanceRequestDTO;

  const result = await showBalanceByUserControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

router.get("/getPaymentInfo", async (req, res) => {
  const { card_number, registry_number, qtd_credits, paymentMethod } =
    req.query;

  const request = {
    card_number: card_number as unknown as number,
    registry_number: registry_number as unknown as number,
    qtd_credits: qtd_credits as unknown as number,
    paymentMethod: paymentMethod as string,
  } as PutCreditsInCardRequestDTO;

  const result = await putCreditsInCardControllerFactory().handle(request);

  return res.status(result.status).json(result.body);
});

export default router;
