// cSpell:ignore rakuten
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import connectedStoresController from '../../src/controller/ConnectedStores.controller';
import connectedStoresService from '../../src/service/ConnectedStores.service';
import { DynamoError } from '../../src/class/dynamo.error-class';
import { CustomError } from '../../src/class/custom.error-class';
import MockErrorObj from '../MockObj';
import { DynamoParseError } from '../../src/class/dynamo.parse-error-class';
import { dynamoErrorValue } from './__mocks__/Dynamo.mock';
import { Dynamo } from '../../src/class/dynamo.access-class';

connectedStoresService.getConnectedStores = jest.fn();

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe('Connected Store Controller', () => {
  it('should have getConnectedStores function', () => {
    expect(typeof connectedStoresController.getConnectedStores).toBe('function');
  });

  it('it should call getConnectedStores service', async () => {
    req.params.customerId = 'gyu';
    await connectedStoresController.getConnectedStores(req, res, next);
    expect(connectedStoresService.getConnectedStores).toBeCalledWith(
      'gyu',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('should return 200 response code and json body', async () => {
    (connectedStoresService.getConnectedStores as jest.Mock).mockReturnValue([
      {
        storeName: 'Rakuten',
        keys: {
          licenseKeyValue: 'SL389938_fA5G3iKwKIg8wl8R',
          serviceSecretValue: 'SP389938_hXOznLmmeVrz8ntF',
        },
        expires: { licenseKeyExpires: '2022-07-19', available: true },
      },
    ]);
    await connectedStoresController.getConnectedStores(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Successfully get your Connected Stores',
      data: [
        {
          storeName: 'Rakuten',
          keys: {
            licenseKeyValue: 'SL389938_fA5G3iKwKIg8wl8R',
            serviceSecretValue: 'SP389938_hXOznLmmeVrz8ntF',
          },
          expires: {
            licenseKeyExpires: '2022-07-19',
            available: true,
          },
        },
      ],
    });
  });

  it('should should handle no customer errors 400 ', async () => {
    (connectedStoresService.getConnectedStores as jest.Mock).mockRejectedValue(
      new DynamoParseError(
        MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
        MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
      ),
    );
    await connectedStoresController.getConnectedStores(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
      data: MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
    });
  });

  it('should should handle no store errors 400', async () => {
    (connectedStoresService.getConnectedStores as jest.Mock).mockRejectedValue(
      new CustomError(
        MockErrorObj.customNoStoreErrorValue.errorType,
        MockErrorObj.customNoStoreErrorValue.detailError,
      ),
    );
    await connectedStoresController.getConnectedStores(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.customNoStoreErrorValue.errorType,
      data: MockErrorObj.customNoStoreErrorValue.detailError,
    });
  });

  it('should should handle dynamo error', async () => {
    (connectedStoresService.getConnectedStores as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await connectedStoresController.getConnectedStores(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});
