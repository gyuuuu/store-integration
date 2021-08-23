import { Router } from 'express';
import amazonAuthRouter from './Amazon-App.router';
import shopifyAuthRouter from './Shopify-App.router';
const router = Router();

router.use('/amazon', amazonAuthRouter);
router.use('/shopify', shopifyAuthRouter);

export default router;
