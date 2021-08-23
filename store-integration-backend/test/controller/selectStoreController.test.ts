// cSpell:ignore rakuten, hussey
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import toConnectStoresController from '../../src/controller/ToConnectStores.controller';
import toConnectStoresService from '../../src/service/ToConnectStores.service';
import 'regenerator-runtime/runtime';
import { DynamoError } from '../../src/class/dynamo.error-class';
import { CustomError } from '../../src/class/custom.error-class';
import MockErrorObj from '../MockObj';
import { DynamoParseError } from '../../src/class/dynamo.parse-error-class';
import { dynamoErrorValue } from './__mocks__/Dynamo.mock';
import { Dynamo } from '../../src/class/dynamo.access-class';

toConnectStoresService.getToConnectedStores = jest.fn();

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('ToConnectStores Controller-GetToConnectedStores', () => {
  const customerId = 'hussey';

  beforeEach(() => {
    req.params.customerId = customerId;
  });
  it('should have getToConnectedStores function', () => {
    expect(typeof toConnectStoresController.getToConnectedStores).toBe('function');
  });

  it('it should call getConnectedStores service', async () => {
    await toConnectStoresController.getToConnectedStores(req, res, next);
    expect(toConnectStoresService.getToConnectedStores).toBeCalledWith(
      'hussey',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('should return 200 response code and json body', async () => {
    // 구체적인 타입 정의 필요
    (toConnectStoresService.getToConnectedStores as jest.Mock).mockReturnValue([
      'Rakuten Us',
      'Shopify Asia',
    ]);
    await toConnectStoresController.getToConnectedStores(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      data: ['Rakuten Us', 'Shopify Asia'],
    });
  });

  it('should should handle no customer errors 400', async () => {
    (toConnectStoresService.getToConnectedStores as jest.Mock).mockRejectedValue(
      new DynamoParseError(
        MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
        MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
      ),
    );
    await toConnectStoresController.getToConnectedStores(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
      data: MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
    });
  });

  it('should should handle no store errors 400', async () => {
    (toConnectStoresService.getToConnectedStores as jest.Mock).mockRejectedValue(
      new CustomError(
        MockErrorObj.customNoStoreErrorValue.errorType,
        MockErrorObj.customNoStoreErrorValue.detailError,
      ),
    );
    await toConnectStoresController.getToConnectedStores(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.customNoStoreErrorValue.errorType,
      data: MockErrorObj.customNoStoreErrorValue.detailError,
    });
  });

  it('should should handle dynamo error', async () => {
    (toConnectStoresService.getToConnectedStores as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await toConnectStoresController.getToConnectedStores(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});
