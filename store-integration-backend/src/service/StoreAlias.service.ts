import { Dynamo } from '../class/dynamo.access-class';
import { UpdateItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { BaseDynamoParser } from '../class/dynamo.sales-channel-class';
import { CustomError } from '../class/custom.error-class';

async function isStoreAliasDuplicate(
  customerId: string,
  storeName: string,
  storeAlias: string,
  dbClient: Dynamo,
): Promise<boolean> {
  try {
    const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      'connectedStores',
    );

    // 연동하기로 한 스토어가 하나도 없는 경우 -> 오류는 아님
    if (parserList.length === 0) {
      throw new CustomError('no store error', {
        statusCode: 400,
        message: 'There is no store to link. Please contact axB',
      });
    }

    let isDuplicate: boolean = false;
    for (const parser of parserList) {
      if (!(parser.getStoreName() === storeName) && parser.getStoreAlias() === storeAlias) {
        isDuplicate = true;
      }
    }
    return isDuplicate;
  } catch (error) {
    throw error;
  }
}

async function postStoreAlias(
  customerId: string,
  storeName: string,
  storeAlias: string,
  dbClient: Dynamo,
) {
  try {
    const result: UpdateItemCommandOutput = await dbClient.update(
      {
        key: process.env.DYNAMO_TABLE_KEY as string,
        value: customerId,
      },
      [{ path: `connectedStores.${storeName}.storeAlias`, value: storeAlias }],
    );
    return result?.Attributes;
  } catch (error) {
    throw error;
  }
}

export default {
  postStoreAlias,
  isStoreAliasDuplicate,
};
