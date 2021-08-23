// cSpell:ignore rakuten, apikey
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import rakutenController from '../../src/controller/Rakuten.controller';
import rakutenService from '../../src/service/Rakuten.service';
import 'regenerator-runtime/runtime';
import { PostApiKeyInput } from '../../src/common/interface/rakuten.apikey-interface';
import { DynamoError } from '../../src/class/dynamo.error-class';
import { AxiosError } from '../../src/class/axios.error-class';
import { dynamoErrorValue } from './__mocks__/Dynamo.mock';
import { axiosErrorValue } from './__mocks__/Axios.mock';

rakutenService.validateKey = jest.fn();
rakutenService.postApiKey = jest.fn();

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe('Rakuten Controller-ValidateKey', () => {
  const licenseKey = 'licenseKey';
  const serviceSecret = 'serviceSecret';

  beforeEach(() => {
    req.body = {
      licenseKey,
      serviceSecret,
    };
  });
  it('should have validateKey function', () => {
    expect(typeof rakutenController.validateKey).toBe('function');
  });

  it('should call Service-validateKey', async () => {
    await rakutenController.validateKey(req, res, next);
    expect(rakutenService.validateKey).toBeCalledWith(req.body);
  });

  it('should return 200 response code and json body', async () => {
    (rakutenService.validateKey as jest.Mock).mockReturnValue(200);
    await rakutenController.validateKey(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({
      data: 'ok',
    });
  });

  it('should handle errors 401 axios error', async () => {
    (rakutenService.validateKey as jest.Mock).mockRejectedValue(
      new AxiosError('axios error', axiosErrorValue),
    );
    await rakutenController.validateKey(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toStrictEqual({
      message: 'axios error',
      data: axiosErrorValue,
    });
  });

  it('should handle errors 500 axios error', async () => {
    axiosErrorValue.response.status = 500;
    (rakutenService.validateKey as jest.Mock).mockRejectedValue(
      new AxiosError('axios error', axiosErrorValue),
    );
    await rakutenController.validateKey(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      message: 'axios error',
      data: axiosErrorValue,
    });
  });

  it('should handle internal server error', async () => {
    (rakutenService.validateKey as jest.Mock).mockReturnValue(-1);
    await rakutenController.validateKey(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toStrictEqual({
      message: 'Internal Server Error',
    });
  });
});

describe('Rakuten Controller-PostApiKey', () => {
  const customerId = 'hussey';
  const PostApiKeyInput: PostApiKeyInput = {
    store: 'Rakuten',
    licenseKey: {
      expires: '2021-08-19',
      value: 'kkk',
    },
    serviceSecret: {
      expires: '',
      value: 'jjj',
    },
  };

  beforeEach(() => {
    req.query.customerId = customerId;
    req.body = PostApiKeyInput;
  });

  it('should have postApiKey function', () => {
    expect(typeof rakutenController.postApiKey).toBe('function');
  });

  it('should return 200 response code and json body', async () => {
    (rakutenService.postApiKey as jest.Mock).mockReturnValue(PostApiKeyInput);
    await rakutenController.postApiKey(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({ data: PostApiKeyInput });
  });

  it('should should handle dynamo error', async () => {
    (rakutenService.postApiKey as jest.Mock).mockRejectedValue(
      new DynamoError('dynamo Error', dynamoErrorValue),
    );
    await rakutenController.postApiKey(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toStrictEqual({
      message: 'dynamo Error',
      data: dynamoErrorValue,
    });
  });
});
