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
import connectedStoresService from '../../src/service/ConnectedStores.service';
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
describe('Connected Stores Service-getConnectedStores', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have getToConnectedStore function', () => {
    expect(typeof connectedStoresService.getConnectedStores).toBe('function');
  });

  it('should return connected store obj', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];
    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await connectedStoresService.getConnectedStores('gyu', dbClient);

    expect(result).toStrictEqual([
      {
        storeName: 'Rakuten_jp',
        storeAlias: 'axB_Rakuten',
        keys: {
          licenseKey: 'aaa',
          serviceSecret: 'bbb',
        },
        expires: {
          expiresValue: '2022-07-19',
          available: true,
        },
      },
      {
        storeName: 'Amazon_asia',
        storeAlias: 'axB_Amazon',
        keys: {
          refreshToken: 'aaa',
        },
        expires: {
          expiresValue: '-',
          available: true,
        },
      },
      {
        storeName: 'Shopify_us',
        storeAlias: null,
        keys: {
          accessToken: 'aaa',
        },
        expires: {
          expiresValue: '-',
          available: true,
        },
      },
    ]);
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
      await connectedStoresService.getConnectedStores('gyu', dbClient);
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
      await connectedStoresService.getConnectedStores('gyu', dbClient);
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
