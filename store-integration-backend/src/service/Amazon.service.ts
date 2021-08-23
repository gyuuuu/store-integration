// cSpell:ignore weblink, apikeys
import axios from 'axios';
import { AmazonParser, BaseDynamoParser } from '../class/dynamo.sales-channel-class';
import { AmazonSpApiError } from '../class/amazon-sp-api.error-class';
import { Dynamo } from '../class/dynamo.access-class';
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
const SellingPartnerAPI = require('amazon-sp-api');

async function getWeblink(
  customerId: string,
  storeName: string,
  dbClient: Dynamo,
): Promise<string> {
  try {
    const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      `connectedStores.${storeName}`,
    );

    let appId: string = '';
    for (const parser of parserList) {
      if (parser.getStoreName() === storeName) {
        appId = (<AmazonParser>parser).getAppId();
      }
    }
    // version은 테스트 상점일 때만(draft)
    return `${process.env.WEB_LINK_BASE}?application_id=${appId}&state=${customerId}-${storeName}&version=beta`;
  } catch (error) {
    throw error;
  }
}

async function getRefreshToken(
  customerId: string,
  storeName: string,
  dbClient: Dynamo,
): Promise<RefreshTokenAPPCredentialsType> {
  try {
    const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      `connectedStores.${storeName}`,
    );

    let refreshToken: string = '';
    let APPCredentials: any;
    for (const parser of parserList) {
      if (parser.getStoreName() === storeName) {
        refreshToken = (<AmazonParser>parser).getRefreshToken();
        APPCredentials = {
          ...(<AmazonParser>parser).getLWA_credentials(),
        };
      }
    }

    return { refreshToken, APPCredentials };
  } catch (error) {
    throw error;
  }
}

export interface RefreshTokenAPPCredentialsType {
  refreshToken: string;
  APPCredentials: {
    client_identifier: string;
    client_secret: string;
  };
}

async function validateRefreshToken({
  refreshToken,
  APPCredentials,
}: RefreshTokenAPPCredentialsType): Promise<boolean> {
  try {
    const sellingPartnerApi = new SellingPartnerAPI({
      region: 'na', // Far East (Singapore, Australia, and Japan marketplaces)
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: APPCredentials.client_identifier,
        SELLING_PARTNER_APP_CLIENT_SECRET: APPCredentials.client_secret,
        AWS_ACCESS_KEY_ID: process.env.SP_API_AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.SP_API_AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.SP_API_AWS_SELLING_PARTNER_ROLE,
      },
      refresh_token: refreshToken,
    });

    const res = await sellingPartnerApi.callAPI({
      operation: 'getOrders',
      endpoint: 'orders',
      query: {
        CreatedAfter: new Date().toISOString(),
        MarketplaceIds: 'na',
      },
    });

    return res.Orders ? true : false;
  } catch (error: any) {
    throw new AmazonSpApiError('amazon sp api error', error, 401);
  }
}

async function putIsConnected(customerId: string, storeName: string, dbClient: Dynamo) {
  try {
    const result: UpdateItemCommandOutput = await dbClient.update(
      {
        key: process.env.DYNAMO_TABLE_KEY as string,
        value: customerId,
      },
      [{ path: `connectedStores.${storeName}.isConnected`, value: true }],
    );
    return result?.Attributes;
  } catch (error) {
    throw error;
  }
}

async function refreshAccessToken(refreshToken: string, APP: any): Promise<string> {
  const result = await axios.post('https://api.amazon.com/auth/o2/token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: APP.clientId,
    client_secret: APP.clientSecret,
  });
  console.log(result);
  return result.data.access_token;
}

export default {
  getWeblink,
  getRefreshToken,
  validateRefreshToken,
  putIsConnected,
};
