// cSpell:ignore  apikeys
import { Router } from 'express';
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import { BaseDynamoParser, ShopifyParser } from '../../class/dynamo.sales-channel-class';
import { Dynamo } from '../../class/dynamo.access-class';

const SCOPES = [
  'write_products',
  'read_product_listings',
  'write_orders',
  'write_order_edits',
  'write_assigned_fulfillment_orders',
  'write_merchant_managed_fulfillment_orders',
  'write_draft_orders',
  'write_third_party_fulfillment_orders',
  'write_inventory',
  'read_customers',
  'write_fulfillments',
  'write_shipping',
  'read_content',
  'read_locations',
];

const router = Router();

router.get('/:identifier/oauth', async (req, res) => {
  const customerId: string = req.params.identifier.split('-')[0];
  const storeName: string = req.params.identifier.split('-')[1];

  const dbClient = Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string);

  const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
    { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
    `connectedStores.${storeName}`,
  );

  let credentials: any = {};
  for (const parser of parserList) {
    if (parser.getStoreName() === storeName) {
      credentials = (<ShopifyParser>parser).getApiCredentials();
    }
  }

  const { shop } = req.query;
  const host = req.get('host');
  const originUrl = req.originalUrl;

  const receivedUrl = `${host}${originUrl}`.split('?').shift();
  const redirectUri = `https://${receivedUrl}/callback`;
  console.log('redirectUri:', redirectUri);

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${
    credentials.key
  }&scope=${SCOPES.join(',')}&redirect_uri=${redirectUri}`;
  res.redirect(installUrl);
});

router.get('/:identifier/oauth/callback', async (req, res) => {
  console.log('/oauth/callback');

  const customerId: string = req.params.identifier.split('-')[0];
  const storeName: string = req.params.identifier.split('-')[1];
  const { code } = req.query as { code: string };
  console.log(code);

  // skip to validate shop, hmac values.

  const dbClient = Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string);

  const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
    { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
    `connectedStores.${storeName}`,
  );

  let endpoint: string = '';
  let credentials: any = {};
  for (const parser of parserList) {
    if (parser.getStoreName() === storeName) {
      endpoint = (<ShopifyParser>parser).getEndPoint();
      credentials = (<ShopifyParser>parser).getApiCredentials();
    }
  }

  const token = await doAuth({
    endpoint,
    clientId: credentials.key,
    clientSecret: credentials.secretKey,
    code,
  });

  const dbUpdateResult: UpdateItemCommandOutput = await dbClient.update(
    {
      key: process.env.DYNAMO_TABLE_KEY as string,
      value: customerId,
    },
    [
      {
        path: `connectedStores.${storeName}.apis.apikeys.accessToken`,
        value: { value: token, expires: '' },
      },
    ],
  );

  res.send('<h3>Shopify 인증이 완료되었습니다. axB 페이지로 돌아가 연동을 완료해주세요.</h3>');
});

type Payload = {
  endpoint: string;
  clientId: string;
  clientSecret: string;
  code: string;
};

async function doAuth({ endpoint, clientId, clientSecret, code }: Payload): Promise<string> {
  const {
    data: { access_token: accessToken },
  } = await axios.post(`${endpoint}/admin/oauth/access_token`, {
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

  return accessToken;
}

export default router;
