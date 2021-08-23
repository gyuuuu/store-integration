// cSpell:ignore rakuten
import mockDynamo, {
  dynamoQueryResponseAmazonConnected,
  dynamoQueryResponseAmazonNotConnected,
  dynamoQueryResponseRakutenConnected,
  dynamoQueryResponseRakutenNotConnected,
  dynamoQueryResponseShopifyConnected,
  dynamoQueryResponseShopifyNotConnected,
  mockEqualQuery,
} from './__mocks__/Dynamo.mock';
import toConnectStores from '../../src/service/ToConnectStores.service';
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
describe('ToConnectStores Service-GetToConnectedStores', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });
  it('should have getToConnectedStores function', () => {
    expect(typeof toConnectStores.getToConnectedStores).toBe('function');
  });

  it('should return connected store list', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];
    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await toConnectStores.getToConnectedStores('gyu', dbClient);
    expect(result).toStrictEqual(['Rakuten', 'Amazon_us', 'Shopify_asia']);
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
      await toConnectStores.getToConnectedStores('gyu', dbClient);
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
      await toConnectStores.getToConnectedStores('gyu', dbClient);
    } catch (error) {
      expect(error).toStrictEqual(
        new CustomError(
          MockObj.customNoStoreErrorValue.errorType,
          MockObj.customNoStoreErrorValue.detailError,
        ),
      );
    }
  });

  it.todo('error handling');
});
