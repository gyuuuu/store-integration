// cSpell:ignore rakuten
import mockDynamo, {
  dynamoQueryResponseRakutenNotConnected,
  dynamoQueryResponseAmazonNotConnected,
  mockEqualQuery,
  dynamoQueryResponseAmazonConnected,
  dynamoQueryResponseRakutenConnected,
  dynamoQueryResponseShopifyConnected,
  dynamoQueryResponseShopifyNotConnected,
} from './__mocks__/Dynamo.mock';
import storeAliasService from '../../src/service/StoreAlias.service';
import MockObj from '../MockObj';
import { CustomError } from '../../src/class/custom.error-class';
import { DynamoParseError } from '../../src/class/dynamo.parse-error-class';
import {
  AmazonParser,
  RakutenParser,
  ShopifyParser,
} from '../../src/class/dynamo.sales-channel-class';
// jest.mock('./__mocks__/mockDynamo');

beforeEach(() => {
  mockDynamo.mockClear();
  mockEqualQuery.mockClear();
});

let dbClient: any;
describe('StoreAlias Service-isStoreAliasDuplicate', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have isStoreAliasDuplicate function', () => {
    expect(typeof storeAliasService.isStoreAliasDuplicate).toBe('function');
  });

  it('should return false', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenNotConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];
    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await storeAliasService.isStoreAliasDuplicate(
      'gyu',
      'Rakuten',
      'axB_Rakuten',
      dbClient,
    );

    expect(result).toStrictEqual(false);
  });

  it('should return true', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];
    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await storeAliasService.isStoreAliasDuplicate(
      'gyu',
      'Rakuten',
      'axB_Rakuten',
      dbClient,
    );

    expect(result).toStrictEqual(true);
  });

  it('should handle DynamoParseError customerId error', async () => {
    dbClient.equalQuery = jest.fn();
    dbClient.equalQuery.mockRejectedValue(
      new DynamoParseError('customerId not found', {
        statusCode: 400,
        message: 'customerId error!',
      }),
    );
    try {
      await storeAliasService.isStoreAliasDuplicate('gyu', 'Rakuten', 'axB_Rakuten', dbClient);
    } catch (error) {
      expect(error).toStrictEqual(
        new DynamoParseError(
          MockObj.DynamoParserNoCustomerErrorValue.errorType,
          MockObj.DynamoParserNoCustomerErrorValue.detailError,
        ),
      );
    }
  });

  it('should throw CustomNoStoreError', async () => {
    dbClient.equalQuery = jest.fn();
    dbClient.equalQuery.mockReturnValue([]);
    try {
      await storeAliasService.isStoreAliasDuplicate('gyu', 'Rakuten', 'axB_Rakuten', dbClient);
    } catch (error) {
      expect(error).toStrictEqual(
        new CustomError(
          MockObj.customNoStoreErrorValue.errorType,
          MockObj.customNoStoreErrorValue.detailError,
        ),
      );
    }
  });
});

describe('StoreAlias Service-postStoreAlias', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have postStoreAlias function', () => {
    expect(typeof storeAliasService.postStoreAlias).toBe('function');
  });

  it('should call Dynamo update', async () => {
    dbClient.update = jest.fn();
    await storeAliasService.postStoreAlias('gyu', 'Rakuten', 'axB_Rakuten', dbClient);
    expect(dbClient.update).toBeCalledWith(
      {
        key: process.env.DYNAMO_TABLE_KEY as string,
        value: 'gyu',
      },
      [{ path: 'connectedStores.Rakuten.storeAlias', value: 'axB_Rakuten' }],
    );
  });
});
