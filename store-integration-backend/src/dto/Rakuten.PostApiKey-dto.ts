// cSpell:ignore rakuten, apikey
import { IsDefined, IsEmpty, IsString, ValidateNested } from 'class-validator';
import { PostApiKeyInput } from '../common/interface/rakuten.apikey-interface';

interface Key {
  expires: string | undefined;

  value: string | undefined;
}

class LicenseKey implements Key {
  constructor(expires: string | undefined, value: string | undefined) {
    this.expires = expires;
    this.value = value;
  }

  @IsDefined()
  @IsString()
  expires: string | undefined;

  @IsDefined()
  @IsString()
  value: string | undefined;
}

class ServiceSecret implements Key {
  constructor(expires: string | undefined, value: string | undefined) {
    this.expires = expires;
    this.value = value;
  }

  @IsEmpty()
  expires: string | undefined;

  @IsDefined()
  @IsString()
  value: string | undefined;
}

// rakuten -> postApiKey에 대한 dto
export class PostApiKeyDto {
  constructor(postApiKeyInput: PostApiKeyInput | undefined) {
    this.store = postApiKeyInput?.store;
    this.licenseKey = new LicenseKey(
      postApiKeyInput?.licenseKey?.expires || undefined,
      postApiKeyInput?.licenseKey?.value || undefined,
    );
    this.serviceSecret = new ServiceSecret(
      postApiKeyInput?.serviceSecret?.expires || undefined,
      postApiKeyInput?.serviceSecret?.value || undefined,
    );
  }
  @IsDefined()
  @IsString()
  store: string | undefined;

  @IsDefined()
  @ValidateNested()
  licenseKey: Key | undefined;

  @IsDefined()
  @ValidateNested()
  serviceSecret: Key | undefined;
}
