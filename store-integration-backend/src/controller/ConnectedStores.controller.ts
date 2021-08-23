import { NextFunction, Request, Response } from 'express';
import { Dynamo } from '../class/dynamo.access-class';
import { response, errResponse } from '../common/function/response';
import connectedStoresService from '../service/ConnectedStores.service';
import { CommonError } from '../common/class/Common.error-class';

async function getConnectedStores(req: Request, res: Response, next: NextFunction) {
  try {
    const customerId = req.params.customerId as string;
    const connectedStores: any[] = await connectedStoresService.getConnectedStores(
      customerId,
      Dynamo.getInstance(process.env.DYNAMO_TABLE_NAME as string),
    );

    response(res, 200, connectedStores, 'Successfully get your Connected Stores');
  } catch (error) {
    if (error instanceof CommonError) {
      errResponse(res, error.getStatus(), error.getErrorType(), error.getDetailError());
    } else {
      next(error);
    }
  }
}

export default {
  getConnectedStores,
};
