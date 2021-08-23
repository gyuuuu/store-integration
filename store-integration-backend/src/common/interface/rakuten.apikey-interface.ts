export interface PostApiKeyInput {
  store: string;
  licenseKey: {
    expires: string;
    value: string;
  };
  serviceSecret: {
    expires: string;
    value: string;
  };
}

export interface ValidateKeyInput {
  serviceSecret: string;
  licenseKey: string;
}
