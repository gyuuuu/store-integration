import { CommonError } from '../common/class/Common.error-class';

// axios에서 에러가 발생한 것(200이 아니면)에 대한 클래스
export class AxiosError extends CommonError {
  constructor(errType: string, error: any) {
    super(errType, error);
  }

  public getStatus() {
    return this.detailError.response.status;
  }
  public getErrorType() {
    return this.errType;
  }
  public getDetailError() {
    return this.detailError;
  }
}
