import { Router } from 'express';
import StoreAliasController from '../../controller/StoreAlias.controller';
import middleware from '../../middleware/ValidateRequest.middleware';

const router = Router();

router.post('/', middleware.validateRequest(['storeAlias']), StoreAliasController.postStoreAlias);
router.post(
  '/duplicate-check',
  middleware.validateRequest(['storeAlias']),
  StoreAliasController.duplicateCheck,
);

export default router;
