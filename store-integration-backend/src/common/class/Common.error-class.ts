// 사용자 정의 에러 클래스
export abstract class CommonError {
  protected readonly errType: string;
  protected readonly detailError: any;
  constructor(errType: string, error: any) {
    this.errType = errType;
    this.detailError = error;
  }

  public abstract getStatus(): number;

  public getErrorType(): string {
    return this.errType;
  }
  public getDetailError(): any {
    return this.detailError;
  }
}
