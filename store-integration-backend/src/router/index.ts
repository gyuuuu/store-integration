import { Router } from 'express';
import storeIntegrationRouter from './Store-Integration/index';
import carrierIntegrationRouter from './Carrier-Integration/index';
import AuthRequestRouter from './Auth-Request/index';

const router = Router();

router.use('/store-integration', storeIntegrationRouter);
router.use('/carrier-integration', carrierIntegrationRouter);
router.use('/auth-request', AuthRequestRouter);

export default router;
