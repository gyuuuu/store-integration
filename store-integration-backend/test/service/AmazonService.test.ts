// cSpell:ignore weblink, rakuten
import mockDynamo, {
  dynamoQueryResponseAmazonConnected,
  dynamoQueryResponseAmazonNotConnected,
  dynamoQueryResponseRakutenConnected,
  dynamoQueryResponseRakutenNotConnected,
  dynamoQueryResponseShopifyConnected,
  dynamoQueryResponseShopifyNotConnected,
  mockEqualQuery,
} from './__mocks__/Dynamo.mock';
import amazonService from '../../src/service/Amazon.service';
import {
  AmazonParser,
  RakutenParser,
  ShopifyParser,
} from '../../src/class/dynamo.sales-channel-class';

beforeEach(() => {
  mockDynamo.mockClear();
  mockEqualQuery.mockClear();
});

let dbClient: any;

describe('Amazon Service-getWeblink', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have getWeblink function', () => {
    expect(typeof amazonService.getWeblink).toBe('function');
  });

  it('should return amazon web link', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];

    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await amazonService.getWeblink('gyu', 'Amazon_us', dbClient);
    expect(result).toBe(
      `${process.env.WEB_LINK_BASE}?application_id=apps&state=gyu-Amazon_us&version=beta`,
    );
  });
});

describe('Amazon Service-getRefreshToken', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have getRefreshToken function', () => {
    expect(typeof amazonService.getRefreshToken).toBe('function');
  });

  it('should return refreshToken, APPCredentials', async () => {
    const parserClassList = [
      new RakutenParser('Rakuten', dynamoQueryResponseRakutenNotConnected),
      new RakutenParser('Rakuten_jp', dynamoQueryResponseRakutenConnected),
      new AmazonParser('Amazon_us', dynamoQueryResponseAmazonNotConnected),
      new AmazonParser('Amazon_asia', dynamoQueryResponseAmazonConnected),
      new ShopifyParser('Shopify_us', dynamoQueryResponseShopifyConnected),
      new ShopifyParser('Shopify_asia', dynamoQueryResponseShopifyNotConnected),
    ];

    dbClient.equalQuery.mockReturnValue(parserClassList);
    const result = await amazonService.getRefreshToken('gyu', 'Amazon_us', dbClient);
    expect(result).toStrictEqual({
      refreshToken: 'aaa',
      APPCredentials: { client_identifier: 'secret', client_secret: 'secret' },
    });
  });
});

describe('Amazon Service-putIsConnected', () => {
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have putIsConnected function', () => {
    expect(typeof amazonService.putIsConnected).toBe('function');
  });

  it('should call Dynamo update', async () => {
    dbClient.update = jest.fn();
    await amazonService.putIsConnected('gyu', 'Amazon_us', dbClient);
    expect(dbClient.update).toBeCalledWith(
      {
        key: process.env.DYNAMO_TABLE_KEY as string,
        value: 'gyu',
      },
      [{ path: 'connectedStores.Amazon_us.isConnected', value: true }],
    );
  });
});
