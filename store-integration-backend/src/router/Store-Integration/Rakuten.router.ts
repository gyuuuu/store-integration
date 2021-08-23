// cSpell:ignore rakuten, apikey
import { Router } from 'express';
import middleware from '../../middleware/ValidateRequest.middleware';
import rakutenController from '../../controller/Rakuten.controller';

const router = Router();

router.post(
  '/validation-key',
  middleware.validateRequest(['keyInput']),
  rakutenController.validateKey,
);

router.post('/apikey', middleware.validateRequest(['postApiKey']), rakutenController.postApiKey);

export default router;
