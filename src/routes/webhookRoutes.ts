// Path: src/routes/webhookRoutes.ts

import { Router } from 'express';
import * as webhookController from '../controllers/webhookController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post("/:token", asyncHandler(webhookController.handleWebhook));