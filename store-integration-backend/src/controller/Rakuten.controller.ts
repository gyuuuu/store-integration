// cSpell:ignore rakuten, apikey
import { NextFunction, Request, Response } from 'express';
import { errResponse, response } from '../common/function/response';
import { PostApiKeyInput } from '../common/interface/rakuten.apikey-interface';
import rakutenService from '../service/rakuten.service';
import { Dynamo } from '../class/dynamo.access-class';
import { CommonError } from '../common/class/Common.error-class';

async function validateKey(req: Request, res: Response, next: NextFunction) {
  try {
    const rakutenResponse: number | undefined = await rakutenService.validateKey(req.body);
    if (rakutenResponse === 200) {
      response(res, 200, 'ok');
    } else {
      // 다른 에러들
      errResponse(res, 500, 'Internal Server Error');
    }
  } catch (error) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

async function postApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(req.baseUrl.split('/')[2]);
    const customerId = req.baseUrl.split('/')[2] as string;
    const keys: PostApiKeyInput = req.body;
    const updatedKey = await rakutenService.postApiKey(
      customerId,
      keys,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
    response(res, 200, updatedKey);
  } catch (error: any) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

export default {
  validateKey,
  postApiKey,
};
