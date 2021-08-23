import { NextFunction, Request, Response } from 'express';
import { CommonError } from '../common/class/Common.error-class';
import { Dynamo } from '../class/dynamo.access-class';
import { response, errResponse } from '../common/function/response';
import selectStoreService from '../service/ToConnectStores.service';

async function getToConnectedStores(req: Request, res: Response, next: NextFunction) {
  try {
    const customerId = req.params.customerId as string;

    const storeList: string[] = await selectStoreService.getToConnectedStores(
      customerId,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );

    response(res, 200, storeList);
  } catch (error: any) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

export default {
  getToConnectedStores,
};
