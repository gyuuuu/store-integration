// cSpell:ignore apikeys
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import { Request, Response } from 'express';
import middleware from '../../src/middleware/ValidateRequest.middleware';

let req: MockRequest<Request>, res: MockResponse<Response>, next: any;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('ValidateRequest Middleware Test', () => {
  describe('it tests inputKeys of req.body', () => {
    it('should call next() on keyInput', async () => {
      req.body = {
        serviceSecret: 'string value',
        licenseKey: 'string value',
      };
      const func = middleware.validateRequest(['keyInput']);
      await func(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      req.body = {
        licenseKey: 'string value',
      };
      const func = middleware.validateRequest(['keyInput']);
      await func(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: 'request error',
        data: [
          {
            target: {
              licenseKey: 'string value',
            },
            property: 'serviceSecret',
            children: [],
            constraints: {
              isDefined: 'serviceSecret should not be null or undefined',
              isString: 'serviceSecret must be a string',
            },
          },
        ],
      });
    });
  });

  describe('it tests post apikeys on req.body', () => {
    it('should call next() on postApiKey', async () => {
      req.body = {
        store: 'string value',
        serviceSecret: {
          expires: '', // must empty
          value: 'string value',
        },
        licenseKey: {
          expires: 'string day',
          value: 'string value',
        },
      };
      const func = middleware.validateRequest(['postApiKey']);
      await func(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      req.body = {
        serviceSecret: {
          expires: '', // must empty
          value: 'string value',
        },
        licenseKey: {
          expires: 'string day',
          value: 'string value',
        },
      };
      const func = middleware.validateRequest(['postApiKey']);
      await func(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: 'request error',
        data: [
          {
            target: {
              licenseKey: {
                expires: 'string day',
                value: 'string value',
              },
              serviceSecret: {
                value: 'string value',
              },
            },
            property: 'store',
            children: [],
            constraints: {
              isDefined: 'store should not be null or undefined',
              isString: 'store must be a string',
            },
          },
        ],
      });
    });
  });

  describe('it tests storeAlias of req.body', () => {
    it('should call next() on storeAlias', async () => {
      req.body = {
        storeAlias: 'axB',
      };
      const func = middleware.validateRequest(['storeAlias']);
      await func(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const func = middleware.validateRequest(['storeAlias']);
      await func(req, res, next);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: 'request error',
        data: [
          {
            target: {},
            property: 'storeAlias',
            children: [],
            constraints: {
              isDefined: 'storeAlias should not be null or undefined',
              isString: 'storeAlias must be a string',
            },
          },
        ],
      });
    });
  });
});
