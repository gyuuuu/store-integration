// cSpell:ignore weblink
import { Router } from 'express';
import shopifyController from '../../controller/Shopify.controller';
import middleware from '../../middleware/ValidateRequest.middleware';

const router = Router();

router.get(
  '/install-link',
  middleware.validateRequest(['storeName']),
  shopifyController.getInstallLink,
);

router.get(
  '/access-token',
  middleware.validateRequest(['storeName']),
  shopifyController.getAccessToken,
);

router.put(
  '/isConnected',
  middleware.validateRequest(['storeName']),
  shopifyController.putIsConnected,
);

export default router;
