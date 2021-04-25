import { Router } from "express";

import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticateRoutes = Router();

const authenticateUserConstoller = new AuthenticateUserController();

authenticateRoutes.post("/sessions", authenticateUserConstoller.handle);

export { authenticateRoutes };
