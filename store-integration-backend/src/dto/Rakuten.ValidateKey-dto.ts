// cSpell:ignore rakuten, apikey
import { IsDefined, IsString } from 'class-validator';
import { ValidateKeyInput } from '../common/interface/rakuten.apikey-interface';

// rakuten -> validateKey에 대한 dto
export class ValidateKeyDto implements ValidateKeyInput {
  constructor(serviceSecret: string, licenseKey: string) {
    this.serviceSecret = serviceSecret;
    this.licenseKey = licenseKey;
  }

  @IsDefined()
  @IsString()
  public serviceSecret: string;

  @IsString()
  @IsDefined()
  public licenseKey: string;
}
