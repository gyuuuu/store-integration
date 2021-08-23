import { CommonError } from '../common/class/Common.error-class';

// dynamo에서 에러가 발생한 것에 대한 클래스
export class AmazonSpApiError extends CommonError {
  statusCode: number;
  constructor(errType: string, error: any, statusCode: number) {
    super(errType, error);
    this.statusCode = statusCode;
  }

  public getStatus() {
    return this.statusCode;
  }
  public getErrorType() {
    return this.errType;
  }
  public getDetailError() {
    return this.detailError;
  }
}
