import { BaseDynamoParser } from '../class/dynamo.sales-channel-class';
import { CustomError } from '../class/custom.error-class';
import { Dynamo } from '../class/dynamo.access-class';

async function getToConnectedStores(customerId: string, dbClient: Dynamo): Promise<string[]> {
  try {
    const parserList: BaseDynamoParser[] = await dbClient.equalQuery(
      { key: process.env.DYNAMO_TABLE_KEY as string, value: customerId },
      'connectedStores',
    );

    if (parserList.length === 0) {
      throw new CustomError('no store error', {
        statusCode: 400,
        message: 'There is no store to link. Please contact axB',
      });
    }

    let res: string[] = [];
    for (const parser of parserList) {
      if (!parser.getIsConnected()) {
        res.push(parser.getStoreName());
      }
    }
    return res;
  } catch (error) {
    throw error;
  }
}

export default {
  getToConnectedStores,
};
