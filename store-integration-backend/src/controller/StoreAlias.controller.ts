import { NextFunction, Request, Response } from 'express';
import { Dynamo } from '../class/dynamo.access-class';
import { response, errResponse } from '../common/function/response';
import { CommonError } from '../common/class/Common.error-class';
import StoreAliasService from '../service/StoreAlias.service';

async function duplicateCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const customerId = req.baseUrl.split('/')[2] as string;
    const storeName = req.baseUrl.split('/')[3] as string;
    const storeAlias = req.body.storeAlias;

    const isDuplicate: boolean = await StoreAliasService.isStoreAliasDuplicate(
      customerId,
      storeName,
      storeAlias,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );
    if (isDuplicate) {
      errResponse(res, 400, 'store alias is duplicated!');
    } else {
      response(res, 200);
    }
  } catch (error) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

async function postStoreAlias(req: Request, res: Response, next: NextFunction) {
  try {
    const customerId = req.baseUrl.split('/')[2] as string;
    const storeName = req.baseUrl.split('/')[3] as string;
    const storeAlias = req.body.storeAlias;

    const updatedData = await StoreAliasService.postStoreAlias(
      customerId as string,
      storeName as string,
      storeAlias,
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
  duplicateCheck,
  postStoreAlias,
};
