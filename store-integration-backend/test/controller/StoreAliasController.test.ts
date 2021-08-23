// cSpell:ignore rakuten
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import StoreAliasController from '../../src/controller/StoreAlias.controller';
import StoreAliasService from '../../src/service/StoreAlias.service';
import { Dynamo } from '../../src/class/dynamo.access-class';
import { DynamoError } from '../../src/class/dynamo.error-class';
import { dynamoErrorValue } from './__mocks__/Dynamo.mock';

StoreAliasService.isStoreAliasDuplicate = jest.fn();
StoreAliasService.postStoreAlias = jest.fn();

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('StoreAlias Controller-postStoreAlias', () => {
  beforeEach(() => {
    req.baseUrl = '/store-integration/gyu/Rakuten/store-alias';
    req.body = { storeAlias: 'axB' };
  });
  it('should have postStoreAlias function', () => {
    expect(typeof StoreAliasController.postStoreAlias).toBe('function');
  });

  it('it should return 200 response code and json body', async () => {
    (StoreAliasService.postStoreAlias as jest.Mock).mockReturnValue({});
    await StoreAliasController.postStoreAlias(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: {} });
  });

  it('should should handle dynamo error', async () => {
    (StoreAliasService.postStoreAlias as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await StoreAliasController.postStoreAlias(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});

describe('StoreAlias Controller-duplicateCheck', () => {
  beforeEach(() => {
    req.baseUrl = '/store-integration/gyu/Rakuten/store-alias';
    req.body = { storeAlias: 'axB' };
  });
  it('should have duplicateCheck function', () => {
    expect(typeof StoreAliasController.duplicateCheck).toBe('function');
  });

  it('it should call isStoreAliasDuplicate service', async () => {
    await StoreAliasController.duplicateCheck(req, res, next);
    expect(StoreAliasService.isStoreAliasDuplicate).toBeCalledWith(
      'gyu',
      'Rakuten',
      'axB',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('should should handle no customer errors 400 ', async () => {
    (StoreAliasService.isStoreAliasDuplicate as jest.Mock).mockReturnValue(true);
    await StoreAliasController.duplicateCheck(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({ message: 'store alias is duplicated!' });
  });

  it('it should return 200 response code and json body', async () => {
    (StoreAliasService.isStoreAliasDuplicate as jest.Mock).mockReturnValue(false);
    await StoreAliasController.duplicateCheck(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({});
  });

  it('should should handle dynamo error', async () => {
    (StoreAliasService.isStoreAliasDuplicate as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await StoreAliasController.duplicateCheck(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});
