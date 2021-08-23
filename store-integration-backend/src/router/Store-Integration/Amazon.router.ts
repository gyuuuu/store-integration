// cSpell:ignore weblink
import { Router } from 'express';
import amazonController from '../../controller/Amazon.controller';
import middleware from '../../middleware/ValidateRequest.middleware';

const router = Router();

router.get(
  '/custom-weblink',
  middleware.validateRequest(['storeName']),
  amazonController.getWeblink,
);

router.get(
  '/refresh-token',
  middleware.validateRequest(['storeName']),
  amazonController.getRefreshToken,
);

router.put(
  '/isConnected',
  middleware.validateRequest(['storeName']),
  amazonController.putIsConnected,
);

export default router;
