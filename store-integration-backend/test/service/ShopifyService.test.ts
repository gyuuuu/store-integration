// cSpell:ignore weblink, rakuten
import mockDynamo, {
  dynamoQueryResponseAmazonConnected,
  dynamoQueryResponseAmazonNotConnected,
  dynamoQueryResponseRakutenConnected,
  dynamoQueryResponseRakutenNotConnected,
  dynamoQueryResponseShopifyConnected,
  dynamoQueryResponseShopifyConnectedExpiresLink,
  dynamoQueryResponseShopifyNotConnected,
  mockEqualQuery,
} from './__mocks__/Dynamo.mock';
import shopifyService from '../../src/service/Shopify.service';
import {
  AmazonParser,
  RakutenParser,
  ShopifyParser,
} from '../../src/class/dynamo.sales-channel-class';
import { CustomError } from '../../src/class/custom.error-class';

beforeEach(() => {
  mockDynamo.mockClear();
  mockEqualQuery.mockClear();
});

let dbClient: any;

describe('Amazon Service-getInstallLink', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have getInstallLink function', () => {
    expect(typeof shopifyService.getInstallLink).toBe('function');
  });

  it('should return shopify install app link', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];

    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await shopifyService.getInstallLink('gyu', 'Shopify_us', dbClient);
    expect(result).toBe('install_link.com');
  });

  it('should handle expired install link', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnectedExpiresLink),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];

    dbClient.equalQuery.mockReturnValue(parserClassList);
    try {
      const result = await shopifyService.getInstallLink('gyu', 'Shopify_us', dbClient);
    } catch (error) {
      expect(error).toStrictEqual(
        new CustomError('invalid link error', {
          statusCode: 400,
          message: 'Link was expired!. Please contact axB',
        }),
      );
    }
  });
});

describe('Shopify Service-getAccessToken', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have getAccessToken function', () => {
    expect(typeof shopifyService.getAccessToken).toBe('function');
  });

  it('should return accessToken', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];

    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await shopifyService.getAccessToken('gyu', 'Shopify_us', dbClient);
    expect(result).toStrictEqual({
      accessToken: 'aaa',
      endpoint: 'www.endpoint.com',
    });
  });
});

describe('Shopify Service-putIsConnected', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have putIsConnected function', () => {
    expect(typeof shopifyService.putIsConnected).toBe('function');
  });

  it('should call Dynamo update', async () => {
    dbClient.update = jest.fn();
    await shopifyService.putIsConnected('gyu', 'Shopify_us', dbClient);
    expect(dbClient.update).toBeCalledWith(
      {
        key: process.env.DYNAMO_TABLE_KEY as string,
        value: 'gyu',
      },
      [{ path: 'connectedStores.Shopify_us.isConnected', value: true }],
    );
  });
});
