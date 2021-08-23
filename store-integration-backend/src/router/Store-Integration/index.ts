// cSpell:ignore rakuten
import { Router } from 'express';
import rakutenRouter from './Rakuten.router';
import amazonRouter from './Amazon.router';
import shopifyRouter from './Shopify.router';
import storeAliasRouter from './StoreAlias.router';
import SelectStoreController from '../../controller/ToConnectStores.controller';
import ConnectedStoresController from '../../controller/ConnectedStores.controller';

const router = Router();

router.use('/:customerId/to-connect-stores', SelectStoreController.getToConnectedStores);
router.use('/:customerId/connected-stores', ConnectedStoresController.getConnectedStores);

router.use('/:customerId/:storeName/store-alias', storeAliasRouter);
router.use('/:customerId/rakuten', rakutenRouter);
router.use('/:customerId/shopify', shopifyRouter);
router.use('/:customerId/amazon', amazonRouter);
export default router;
