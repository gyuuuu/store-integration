// cSpell:ignore weblink
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import amazonController from '../../src/controller/Amazon.controller';
import amazonService from '../../src/service/Amazon.service';
import { Dynamo } from '../../src/class/dynamo.access-class';
import { DynamoError } from '../../src/class/dynamo.error-class';
import MockErrorObj from '../MockObj';
import { DynamoParseError } from '../../src/class/dynamo.parse-error-class';
import { dynamoErrorValue } from './__mocks__/Dynamo.mock';
import { AmazonSpApiError } from '../../src/class/amazon-sp-api.error-class';

amazonService.getWeblink = jest.fn();
amazonService.getRefreshToken = jest.fn();
amazonService.validateRefreshToken = jest.fn();
amazonService.putIsConnected = jest.fn();

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Amazon Controller-getWebLink', () => {
  beforeEach(() => {
    req.query.storeName = 'Amazon_us';
    req.baseUrl = '/store-integration/gyu/amazon/custom-weblink';
  });
  it('should have getWeblink function', () => {
    expect(typeof amazonController.getWeblink).toBe('function');
  });

  it('it should call getWebLink service', async () => {
    await amazonController.getWeblink(req, res, next);
    expect(amazonService.getWeblink).toBeCalledWith(
      'gyu',
      'Amazon_us',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('it should return 200 response code and json body', async () => {
    (amazonService.getWeblink as jest.Mock).mockReturnValue('https://custom-web-link');
    await amazonController.getWeblink(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: 'https://custom-web-link' });
  });

  it('should should handle no customer errors 400 ', async () => {
    (amazonService.getWeblink as jest.Mock).mockRejectedValue(
      new DynamoParseError(
        MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
        MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
      ),
    );
    await amazonController.getWeblink(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
      data: MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
    });
  });

  it('should should handle dynamo error', async () => {
    (amazonService.getWeblink as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await amazonController.getWeblink(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});

describe('Amazon Controller-getRefreshToken', () => {
  beforeEach(() => {
    req.query.storeName = 'Amazon_us';
    req.baseUrl = '/store-integration/gyu/amazon/refresh-token';
  });
  it('should have getRefreshToken function', () => {
    expect(typeof amazonController.getRefreshToken).toBe('function');
  });

  it('it should call getRefreshToken service', async () => {
    await amazonController.getRefreshToken(req, res, next);
    expect(amazonService.getRefreshToken).toBeCalledWith(
      'gyu',
      'Amazon_us',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('should should handle no customer errors 400 ', async () => {
    (amazonService.getRefreshToken as jest.Mock).mockReturnValue({});
    await amazonController.getRefreshToken(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({ message: 'refresh-token not found!' });
  });

  it('it should return 200 response code and json body', async () => {
    (amazonService.getRefreshToken as jest.Mock).mockReturnValue({
      refreshToken: 'refreshToken',
    });
    (amazonService.validateRefreshToken as jest.Mock).mockReturnValue(true);
    await amazonController.getRefreshToken(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      data: { refreshToken: 'refreshToken', isValidate: true },
    });
  });

  it('should should handle dynamo error', async () => {
    (amazonService.getRefreshToken as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await amazonController.getRefreshToken(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });

  it('should should handle amazon sp api error', async () => {
    (amazonService.getRefreshToken as jest.Mock).mockReturnValue({
      refreshToken: 'refreshToken',
    });
    (amazonService.validateRefreshToken as jest.Mock).mockRejectedValue(
      new AmazonSpApiError('amazon sp api error', {}, 401),
    );
    await amazonController.getRefreshToken(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual({
      message: 'amazon sp api error',
      data: {},
    });
  });
});

describe('Amazon Controller-putIsConnected', () => {
  beforeEach(() => {
    req.query.storeName = 'Amazon_us';
    req.baseUrl = '/store-integration/gyu/amazon/isConnected';
  });
  it('should have putIsConnected function', () => {
    expect(typeof amazonController.putIsConnected).toBe('function');
  });

  it('it should call getWebLink service', async () => {
    await amazonController.putIsConnected(req, res, next);
    expect(amazonService.putIsConnected).toBeCalledWith(
      'gyu',
      'Amazon_us',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('it should return 200 response code and json body', async () => {
    (amazonService.putIsConnected as jest.Mock).mockReturnValue('updated data');
    await amazonController.putIsConnected(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: 'updated data' });
  });

  it('should should handle no customer errors 400 ', async () => {
    (amazonService.putIsConnected as jest.Mock).mockRejectedValue(
      new DynamoParseError(
        MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
        MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
      ),
    );
    await amazonController.putIsConnected(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
      data: MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
    });
  });

  it('should should handle dynamo error', async () => {
    (amazonService.putIsConnected as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await amazonController.putIsConnected(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});
