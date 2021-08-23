// cSpell:ignore weblink
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import shopifyController from '../../src/controller/Shopify.controller';
import shopifyService from '../../src/service/Shopify.service';
import { Dynamo } from '../../src/class/dynamo.access-class';
import { DynamoError } from '../../src/class/dynamo.error-class';
import MockErrorObj from '../MockObj';
import { DynamoParseError } from '../../src/class/dynamo.parse-error-class';
import { dynamoErrorValue } from './__mocks__/Dynamo.mock';
import { AxiosError } from '../../src/class/axios.error-class';
import { axiosErrorValue } from './__mocks__/Axios.mock';

shopifyService.getInstallLink = jest.fn();
shopifyService.getAccessToken = jest.fn();
shopifyService.validateAccessToken = jest.fn();
shopifyService.putIsConnected = jest.fn();

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Shopify Controller-getWebLink', () => {
  beforeEach(() => {
    req.query.storeName = 'Shopify_us';
    req.baseUrl = '/store-integration/gyu/shopify/install-link';
  });
  it('should have getWeblink function', () => {
    expect(typeof shopifyController.getInstallLink).toBe('function');
  });

  it('it should call getWebLink service', async () => {
    await shopifyController.getInstallLink(req, res, next);
    expect(shopifyService.getInstallLink).toBeCalledWith(
      'gyu',
      'Shopify_us',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('it should return 200 response code and json body', async () => {
    (shopifyService.getInstallLink as jest.Mock).mockReturnValue('https://shopify-install-link');
    await shopifyController.getInstallLink(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: 'https://shopify-install-link' });
  });

  it('should should handle no customer errors 400 ', async () => {
    (shopifyService.getInstallLink as jest.Mock).mockRejectedValue(
      new DynamoParseError(
        MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
        MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
      ),
    );
    await shopifyController.getInstallLink(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
      data: MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
    });
  });

  it('should should handle dynamo error', async () => {
    (shopifyService.getInstallLink as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await shopifyController.getInstallLink(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});

describe('Shopify Controller-getAccessToken', () => {
  beforeEach(() => {
    req.query.storeName = 'Shopify_us';
    req.baseUrl = '/store-integration/gyu/shopify/access-token';
  });
  it('should have getAccessToken function', () => {
    expect(typeof shopifyController.getAccessToken).toBe('function');
  });

  it('it should call getAccessToken service', async () => {
    await shopifyController.getAccessToken(req, res, next);
    expect(shopifyService.getAccessToken).toBeCalledWith(
      'gyu',
      'Shopify_us',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('should should handle no customer errors 400 ', async () => {
    (shopifyService.getAccessToken as jest.Mock).mockReturnValue({});
    await shopifyController.getAccessToken(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({ message: 'access-token not found!' });
  });

  it('it should return 200 response code and json body', async () => {
    (shopifyService.getAccessToken as jest.Mock).mockReturnValue({
      accessToken: 'accessToken',
    });
    (shopifyService.validateAccessToken as jest.Mock).mockReturnValue(true);
    await shopifyController.getAccessToken(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      data: { accessToken: 'accessToken', isValidate: true },
    });
  });

  it('should should handle dynamo error', async () => {
    (shopifyService.getAccessToken as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await shopifyController.getAccessToken(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });

  it('should should handle axios error', async () => {
    (shopifyService.getAccessToken as jest.Mock).mockReturnValue({
      accessToken: 'accessToken',
    });
    (shopifyService.validateAccessToken as jest.Mock).mockRejectedValue(
      new AxiosError('axios error', axiosErrorValue),
    );
    await shopifyController.getAccessToken(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual({
      message: 'axios error',
      data: axiosErrorValue,
    });
  });
});

describe('Shopify Controller-putIsConnected', () => {
  beforeEach(() => {
    req.query.storeName = 'Shopify_us';
    req.baseUrl = '/store-integration/gyu/shopify/isConnected';
  });
  it('should have putIsConnected function', () => {
    expect(typeof shopifyController.putIsConnected).toBe('function');
  });

  it('it should call getWebLink service', async () => {
    await shopifyController.putIsConnected(req, res, next);
    expect(shopifyService.putIsConnected).toBeCalledWith(
      'gyu',
      'Shopify_us',
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
  });

  it('it should return 200 response code and json body', async () => {
    (shopifyService.putIsConnected as jest.Mock).mockReturnValue('updated data');
    await shopifyController.putIsConnected(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: 'updated data' });
  });

  it('should should handle no customer errors 400 ', async () => {
    (shopifyService.putIsConnected as jest.Mock).mockRejectedValue(
      new DynamoParseError(
        MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
        MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
      ),
    );
    await shopifyController.putIsConnected(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: MockErrorObj.DynamoParserNoCustomerErrorValue.errorType,
      data: MockErrorObj.DynamoParserNoCustomerErrorValue.detailError,
    });
  });

  it('should should handle dynamo error', async () => {
    (shopifyService.putIsConnected as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await shopifyController.putIsConnected(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});
