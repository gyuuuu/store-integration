// cSpell:ignore rakuten, mockupdate
import mockDynamo, { mockEqualQuery, mockupdateItem } from './__mocks__/Dynamo.mock';
import rakutenService from '../../src/service/Rakuten.service';
// import axios from 'axios';

beforeEach(() => {
  mockDynamo.mockClear();
  mockEqualQuery.mockClear();
  mockupdateItem.mockClear();
});

// describe('Rakuten Service-Validate Key', () => {
//   axios.get = jest.fn();

//   it('should have validateKey function', () => {
//     expect(typeof rakutenService.validateKey).toBe('function');
//   });

//   it('should return status code', async () => {
//     axios.get = jest.fn();
//     axios.get.mockReturnValue();
//     const data = await rakutenService.validateKey();
//     expect(data).toStrictEqual('MockReturnValue');
//   });

//   it.todo('error handling');
// });

describe('Rakuten Service-Post Api Key', () => {
  const Data = {
    store: 'Rakuten',
    licenseKey: {
      expires: '2022',
      value: 'abc',
    },
    serviceSecret: {
      expires: '2021',
      value: 'def',
    },
  };

  let dbClient: any;
  beforeEach(() => {
    dbClient = new mockDynamo();
  });

  it('should have postApiKey function', () => {
    expect(typeof rakutenService.postApiKey).toBe('function');
  });

  it('should return updated value', async () => {
    dbClient.update = jest.fn();
    dbClient.update.mockReturnValue({ Attributes: Data });
    await rakutenService.postApiKey('gyu', Data, dbClient);
    expect(dbClient.update).toBeCalledWith(
      {
        key: process.env.DYNAMO_TABLE_KEY as string,
        value: 'gyu',
      },
      [
        {
          path: `connectedStores.${Data.store}.apis.apikeys.licenseKey`,
          value: { value: Data.licenseKey.value, expires: Data.licenseKey.expires },
        },
        {
          path: `connectedStores.${Data.store}.apis.apikeys.serviceSecret`,
          value: { value: Data.serviceSecret.value, expires: Data.serviceSecret.expires },
        },
        { path: `connectedStores.${Data.store}.isConnected`, value: true },
      ],
    );
  });
});
