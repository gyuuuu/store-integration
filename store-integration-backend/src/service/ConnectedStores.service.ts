// cSpell:ignore apikeys, rakuten
import { BaseDynamoParser } from '../class/dynamo.sales-channel-class';
import { CustomError } from '../class/custom.error-class';
import { Dynamo } from '../class/dynamo.access-class';
import isExpired from '../common/function/expires';

async function getConnectedStores(customerId: string, dbClient: Dynamo) {
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

    let res: any[] = [];
    for (const parser of parserList) {
      if (parser.getIsConnected()) {
        res.push({
          storeName: parser.getStoreName(),
          storeAlias: parser.getStoreAlias() === '' ? null : parser.getStoreAlias(),
          keys: parser.getKeys(),
          expires: {
            expiresValue: parser.getExpires(),
            available: !isExpired(parser.getExpires(), new Date()),
          },
        });
      }
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export default {
  getConnectedStores,
};
