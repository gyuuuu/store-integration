import { Dynamo } from '../class/dynamo.access-class';
import { BaseDynamoParser, ShopifyParser } from '../class/dynamo.sales-channel-class';
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { AxiosError } from '../class/axios.error-class';
import axios from 'axios';
import isExpired from '../common/function/expires';
import { CustomError } from '../class/custom.error-class';

async function getInstallLink(
  customerId: string,
  storeName: string,
  dbClient: Dynamo,
): Promise<string> {
  try {
    const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      `connectedStores.${storeName}`,
    );

    let installLink: any = {};
    for (const parser of parserList) {
      if (parser.getStoreName() === storeName) {
        installLink = (<ShopifyParser>parser).getInstallLink();
      }
    }

    if (isExpired(installLink.expires, new Date())) {
      throw new CustomError('invalid link error', {
        statusCode: 400,
        message: 'Link was expired!. Please contact axB',
      });
    } else {
      return installLink.value;
    }
  } catch (error) {
    throw error;
  }
}

export interface AccessTokenEndPointType {
  accessToken: string;
  endpoint: string;
}

async function getAccessToken(
  customerId: string,
  storeName: string,
  dbClient: Dynamo,
): Promise<AccessTokenEndPointType> {
  try {
    const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      `connectedStores.${storeName}`,
    );

    let endpoint: string = '';
    let accessToken: string = '';
    for (const parser of parserList) {
      if (parser.getStoreName() === storeName) {
        accessToken = (<ShopifyParser>parser).getAccessToken();
        endpoint = (<ShopifyParser>parser).getEndPoint();
      }
    }

    return { accessToken, endpoint };
  } catch (error) {
    throw error;
  }
}

async function validateAccessToken({
  accessToken,
  endpoint,
}: AccessTokenEndPointType): Promise<boolean> {
  try {
    const result = await axios.get(
      `${endpoint}/admin/api/2021-07/inventory_items.json?ids=808950810,39072856,457924702`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      },
    );
    return result.status === 200 ? true : false;
  } catch (error: any) {
    if (error.response.status) {
      throw new AxiosError('axios error', error);
    } else {
      throw error;
    }
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

export default {
  getInstallLink,
  getAccessToken,
  validateAccessToken,
  putIsConnected,
};
