import { IsDefined, IsString } from 'class-validator';

export class ValidateRefreshTokenDto {
  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  @IsDefined()
  @IsString()
  refreshToken: string;
}
