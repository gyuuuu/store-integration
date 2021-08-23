import { Response } from 'express';

export function response(res: Response, status: number, data?: any, message?: string) {
  res.status(status).json({
    message,
    data,
  });
}

export function errResponse(res: Response, status: number, message: string, data?: any) {
  res.status(status).json({
    message,
    data,
  });
}

export default {
  response,
  errResponse,
};
