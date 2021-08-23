// cSpell:ignore spapi, apikeys
import { Router } from 'express';
import axios from 'axios';
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { AmazonParser, BaseDynamoParser } from '../../class/dynamo.sales-channel-class';
import { Dynamo } from '../../class/dynamo.access-class';

const router = Router();
const OAUTH_BASE_URI = 'https://b7cd4c4d8aee.ngrok.io/auth-request/amazon/oauth';

router.get('/oauth/redirect', async (req, res) => {
  console.log('/oauth/redirect');

  const { spapi_oauth_code, selling_partner_id, state } = req.query;
  const customerId: string = (state as string).split('-')[0];
  const storeName: string = (state as string).split('-')[1];

  const dbClient = Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string);

  const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
    { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
    `connectedStores.${storeName}`,
  );

  let credentials: any = {};
  for (const parser of parserList) {
    if (parser.getStoreName() === storeName) {
      credentials = (<AmazonParser>parser).getLWA_credentials();
    }
  }

  const result = await axios.post('https://api.amazon.com/auth/o2/token', {
    grant_type: 'authorization_code',
    code: spapi_oauth_code,
    redirect_uri: `${OAUTH_BASE_URI}/exchange-lwa-token`,
    client_id: credentials.client_identifier,
    client_secret: credentials.client_secret,
  });

  const dbUpdateResult: UpdateItemCommandOutput = await dbClient.update(
    {
      key: process.env.DYNAMO_TABLE_KEY as string,
      value: customerId,
    },
    [
      {
        path: `connectedStores.${storeName}.apis.apikeys.refreshToken`,
        value: { value: result.data.refresh_token, expires: '' },
      },
      {
        path: `connectedStores.${storeName}.apis.apikeys.spapi_oauth_code`,
        value: { value: spapi_oauth_code, expires: '' },
      },
    ],
  );

  res.send('<h3>아마존 인증이 완료되었습니다. axB 페이지로 돌아가 연동을 완료해주세요.</h3>');
});

router.get('/oauth/exchange-lwa-token', (req, res) => {
  const { access_token, token_type, expires_in, refresh_token } = req.query;
  res.send({ access_token, token_type, expires_in, refresh_token });
});

export default router;
