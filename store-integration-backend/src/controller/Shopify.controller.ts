import { NextFunction, Request, Response } from 'express';
import shopifyService, { AccessTokenEndPointType } from '../service/Shopify.service';
import { errResponse, response } from '../common/function/response';
import { Dynamo } from '../class/dynamo.access-class';
import { CommonError } from '../common/class/Common.error-class';

async function getInstallLink(req: Request, res: Response, next: NextFunction) {
  try {
    const storeName = req.query.storeName;
    const customerId = req.baseUrl.split('/')[2] as string;
    const installLink: string = await shopifyService.getInstallLink(
      customerId as string,
      storeName as string,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
    response(res, 200, installLink);
  } catch (error: any) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

async function getAccessToken(req: Request, res: Response, next: NextFunction) {
  try {
    const storeName = req.query.storeName;
    const customerId = req.baseUrl.split('/')[2] as string;
    const result: AccessTokenEndPointType = await shopifyService.getAccessToken(
      customerId as string,
      storeName as string,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
    if (!result.accessToken) {
      errResponse(res, 400, 'access-token not found!');
    } else {
      const isValidate = await shopifyService.validateAccessToken(result);
      response(res, 200, { accessToken: result.accessToken, isValidate });
    }
  } catch (error: any) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

async function putIsConnected(req: Request, res: Response, next: NextFunction) {
  try {
    const storeName = req.query.storeName;
    const customerId = req.baseUrl.split('/')[2] as string;
    const updatedData = await shopifyService.putIsConnected(
      customerId as string,
      storeName as string,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
    response(res, 200, updatedData);
  } catch (error) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

export default {
  getInstallLink,
  getAccessToken,
  putIsConnected,
};
