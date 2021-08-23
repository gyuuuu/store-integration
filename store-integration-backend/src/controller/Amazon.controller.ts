// cSpell:ignore weblink
import { NextFunction, Request, Response } from 'express';
import amazonService, { RefreshTokenAPPCredentialsType } from '../service/Amazon.service';
import { errResponse, response } from '../common/function/response';
import { Dynamo } from '../class/dynamo.access-class';
import { CommonError } from '../common/class/Common.error-class';

async function getWeblink(req: Request, res: Response, next: NextFunction) {
  try {
    const storeName = req.query.storeName;
    const customerId = req.baseUrl.split('/')[2] as string;
    const customWebLink: string = await amazonService.getWeblink(
      customerId as string,
      storeName as string,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
    response(res, 200, customWebLink);
  } catch (error: any) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

async function getRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const storeName = req.query.storeName;
    const customerId = req.baseUrl.split('/')[2] as string;
    const result: RefreshTokenAPPCredentialsType = await amazonService.getRefreshToken(
      customerId as string,
      storeName as string,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );

    if (!result.refreshToken) {
      errResponse(res, 400, 'refresh-token not found!');
    } else {
      const isValidate = await amazonService.validateRefreshToken(result);
      response(res, 200, { refreshToken: result.refreshToken, isValidate });
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
    const updatedData = await amazonService.putIsConnected(
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
  getWeblink,
  getRefreshToken,
  putIsConnected,
};
