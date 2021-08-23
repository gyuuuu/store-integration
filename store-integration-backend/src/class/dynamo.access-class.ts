// cSpell:ignore rakuten, apikey, apikeys, dbclient, datas
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { DynamoError } from './dynamo.error-class';
import { CommonError } from '../common/class/Common.error-class';
import { DynamoParseError } from './dynamo.parse-error-class';
import {
  AmazonParser,
  RakutenParser,
  BaseDynamoParser,
  ShopifyParser,
} from './dynamo.sales-channel-class';

interface KeyOption {
  key: string;
  value: string;
}

export class Dynamo {
  private static instance: Dynamo;
  private readonly dbclient: DynamoDBClient;
  private readonly TableName: string;

  private constructor(TableName: string) {
    this.dbclient = new DynamoDBClient({});
    this.TableName = TableName;
  }

  public static getInstance(TableName: string) {
    if (!Dynamo.instance) {
      Dynamo.instance = new Dynamo(TableName);
    }
    return Dynamo.instance;
  }

  // TableName에서 key값이 value와 일치하는 항목중 attributeList에 해당하는 것을 리턴
  public async equalQuery(
    { key, value }: KeyOption,
    attribute: string,
  ): Promise<BaseDynamoParser[]> {
    try {
      const res: QueryCommandOutput = await this.dbclient.send(
        new QueryCommand({
          TableName: this.TableName,
          KeyConditions: {
            [key]: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [{ S: value }],
            },
          },
          Select: 'SPECIFIC_ATTRIBUTES',
          // AttributesToGet: [...attributeList],
          ProjectionExpression: attribute,
        }),
      );
      return this.dynamoQueryResponseParser(res);
    } catch (error) {
      if (error instanceof CommonError) {
        throw error;
      } else {
        throw new DynamoError('dynamoError', error);
      }
    }
  }

  // TableName에서 key값이 value와 일치하는 항목중 UpdateExpression에 해당하는 값들을 ExpressionAttributeValues로 바꿈
  public async update(
    { key, value }: KeyOption,
    updateDatas: any[],
  ): Promise<UpdateItemCommandOutput> {
    try {
      const res: UpdateItemCommandOutput = await this.dbclient.send(
        this.makeUpdateCommand({ key, value }, updateDatas),
      );
      return res;
    } catch (error) {
      throw new DynamoError('dynamoError', error);
    }
  }

  private makeUpdateCommand({ key, value }: KeyOption, updateDatas: any[]): UpdateItemCommand {
    let expression = 'SET ';
    let attributeValues = {};

    for (const data of updateDatas) {
      const attributeValueKey = data.path.split('.')[data.path.split('.').length - 1];
      expression = expression + `${data.path} = :${attributeValueKey}, `;
      attributeValues = {
        ...attributeValues,
        [`:${attributeValueKey}`]: this.toDynamoDataType(data.value),
      };
    }

    return new UpdateItemCommand({
      TableName: this.TableName,
      Key: {
        [key]: {
          S: value,
        },
      },
      UpdateExpression: expression.substring(0, expression.length - 2),
      ExpressionAttributeValues: attributeValues,
      ReturnValues: 'UPDATED_NEW',
    });
  }

  private toDynamoDataType(origin: object | string | boolean | any) {
    switch (typeof origin) {
      case 'object':
        let obj: any = {};
        for (const key of Object.keys(origin)) {
          obj = { ...obj, [key]: this.toDynamoDataType(origin[key]) };
        }
        return { M: obj };

      case 'string':
        return { S: origin };

      case 'boolean':
        return { BOOL: origin };

      default:
        break;
    }
  }

  private dynamoQueryResponseParser(res: any): BaseDynamoParser[] {
    try {
      if (res.Count === 0) {
        throw new DynamoParseError('customerId not found', {
          statusCode: 400,
          message: 'customerId error!',
        });
      }
      const storeMap = res.Items[0].connectedStores.M;
      const keys = Object.keys(storeMap);
      const salesChannelClasses: any[] = keys.map(key => {
        return this.returnSalesChannelClass(key, storeMap[key]);
      });
      return salesChannelClasses;
    } catch (error) {
      throw error;
    }
  }

  private returnSalesChannelClass(key: string, data: any) {
    switch (key.split('_')[0]) {
      case 'Amazon':
        return new AmazonParser(key, data);
      case 'Rakuten':
        return new RakutenParser(key, data);
      case 'Shopify':
        return new ShopifyParser(key, data);

      default:
        break;
    }
  }
}
