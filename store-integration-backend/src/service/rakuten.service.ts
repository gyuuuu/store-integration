// cSpell:ignore rakuten, apikey, apikeys
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import { PostApiKeyInput, ValidateKeyInput } from 'src/common/interface/rakuten.apikey-interface';
import { AxiosError } from '../class/axios.error-class';
import { Dynamo } from '../class/dynamo.access-class';

async function validateKey({ serviceSecret, licenseKey }: ValidateKeyInput): Promise<number> {
  try {
    const base64EncodedKeys = Buffer.from(`${serviceSecret}:${licenseKey}`, 'utf8').toString(
      'base64',
    );
    const res = await axios.get(process.env.RAKUTEN_KEY_VALIDATE_URL as string, {
      headers: {
        Authorization: `ESA ${base64EncodedKeys}`,
      },
      params: {
        itemUrl: process.env.RAKUTEN_ITEM_PARAM as string,
      },
    });
    return res.status;
  } catch (error: any) {
    if (error.response.status) {
      throw new AxiosError('axios error', error);
    } else {
      throw error;
    }
  }
}

async function postApiKey(customerId: string, apikey: PostApiKeyInput, dbClient: Dynamo) {
  try {
    const result: UpdateItemCommandOutput = await dbClient.update(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      [
        {
          path: `connectedStores.${apikey.store}.apis.apikeys.licenseKey`,
          value: { value: apikey.licenseKey.value, expires: apikey.licenseKey.expires },
        },
        {
          path: `connectedStores.${apikey.store}.apis.apikeys.serviceSecret`,
          value: { value: apikey.serviceSecret.value, expires: apikey.serviceSecret.expires },
        },
        { path: `connectedStores.${apikey.store}.isConnected`, value: true },
      ],
    );
    return result?.Attributes;
  } catch (error) {
    throw error;
  }
}

export default {
  validateKey,
  postApiKey,
};
