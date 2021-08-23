import { CommonError } from '../common/class/Common.error-class';

// dynamo에서 에러가 발생한 것에 대한 클래스
export class CustomError extends CommonError {
  constructor(errType: string, error: any) {
    super(errType, error);
  }

  public getStatus() {
    return this.detailError.statusCode;
  }
  public getErrorType() {
    return this.errType;
  }
  public getDetailError() {
    return this.detailError;
  }
}
