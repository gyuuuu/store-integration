// cSpell:ignore rakuten, apikey, apikeys, spapi

// TODO: test code 작성

interface KeySchema {
  expires: string;
  value: string;
}

interface ApisSchema {
  apikeys: {
    [key: string]: KeySchema;
  };
}

interface BaseDynamoSchema {
  apis: ApisSchema;
  isConnected: boolean;
  storeAlias: string;
}

export interface RakutenSchema extends BaseDynamoSchema {}

export interface AmazonSchema extends BaseDynamoSchema {
  app: {
    appId: string;
    LWA_credentials: {
      client_identifier: string;
      client_secret: string;
    };
  };
}

export interface ShopifySchema extends BaseDynamoSchema {
  app: {
    api_credentials: {
      key: string;
      secretKey: string;
    };
    endpoint: string;
    install_link: KeySchema;
  };
}

export abstract class BaseDynamoParser {
  private readonly storeName: string;
  constructor(key: string) {
    this.storeName = key;
  }

  public getStoreName(): string {
    return this.storeName;
  }
  public getExpires(): string {
    return '-';
  }

  abstract getIsConnected(): boolean;
  abstract getStoreAlias(): string;
  abstract getKeys(): any;
}

export class RakutenParser extends BaseDynamoParser {
  private readonly data: RakutenSchema;

  constructor(key: string, data: any) {
    super(key);
    this.data = {
      apis: {
        apikeys: {
          licenseKey: {
            expires: data.M.apis.M.apikeys.M.licenseKey.M.expires.S,
            value: data.M.apis.M.apikeys.M.licenseKey.M.value.S,
          },
          serviceSecret: {
            expires: data.M.apis.M.apikeys.M.serviceSecret.M.expires.S,
            value: data.M.apis.M.apikeys.M.serviceSecret.M.value.S,
          },
        },
      },
      isConnected: data.M.isConnected.BOOL,
      storeAlias: data.M.storeAlias.S,
    };
  }

  public getIsConnected(): boolean {
    return this.data.isConnected;
  }

  public getStoreAlias(): string {
    return this.data.storeAlias;
  }

  public getKeys() {
    return {
      licenseKey: `${this.data.apis.apikeys.licenseKey.value}`,
      serviceSecret: `${this.data.apis.apikeys.serviceSecret.value}`,
    };
  }

  public getExpires(): string {
    return this.data.apis.apikeys.licenseKey.expires;
  }
}

export class AmazonParser extends BaseDynamoParser {
  private readonly data: AmazonSchema;

  constructor(key: string, data: any) {
    super(key);
    this.data = {
      apis: {
        apikeys: {
          refreshToken: {
            expires: data.M.apis.M.apikeys.M.refreshToken.M.expires.S,
            value: data.M.apis.M.apikeys.M.refreshToken.M.value.S,
          },
          spapi_oauth_code: {
            expires: data.M.apis.M.apikeys.M.spapi_oauth_code.M.expires.S,
            value: data.M.apis.M.apikeys.M.spapi_oauth_code.M.value.S,
          },
        },
      },
      app: {
        appId: data.M.app.M.appId.S,
        LWA_credentials: {
          client_identifier: data.M.app.M.LWA_credentials.M.client_identifier.S,
          client_secret: data.M.app.M.LWA_credentials.M.client_secret.S,
        },
      },
      isConnected: data.M.isConnected.BOOL,
      storeAlias: data.M.storeAlias.S,
    };
  }

  public getIsConnected(): boolean {
    return this.data.isConnected;
  }

  public getStoreAlias(): string {
    return this.data.storeAlias;
  }

  public getAppId(): string {
    return this.data.app.appId;
  }

  public getRefreshToken(): string {
    return this.data.apis.apikeys.refreshToken.value;
  }

  public getLWA_credentials() {
    return this.data.app.LWA_credentials;
  }

  public getKeys() {
    return {
      refreshToken: this.getRefreshToken(),
    };
  }
}

export class ShopifyParser extends BaseDynamoParser {
  private readonly data: ShopifySchema;

  constructor(key: string, data: any) {
    super(key);
    this.data = {
      apis: {
        apikeys: {
          accessToken: {
            expires: data.M.apis.M.apikeys.M.accessToken.M.expires.S,
            value: data.M.apis.M.apikeys.M.accessToken.M.value.S,
          },
        },
      },
      app: {
        endpoint: data.M.app.M.endpoint.S,
        api_credentials: {
          key: data.M.app.M.api_credentials.M.key.S,
          secretKey: data.M.app.M.api_credentials.M.secretKey.S,
        },
        install_link: {
          expires: data.M.app.M.install_link.M.expires.S,
          value: data.M.app.M.install_link.M.value.S,
        },
      },
      isConnected: data.M.isConnected.BOOL,
      storeAlias: data.M.storeAlias.S,
    };
  }

  getIsConnected(): boolean {
    return this.data.isConnected;
  }

  getStoreAlias(): string {
    return this.data.storeAlias;
  }

  getKeys(): any {
    return { accessToken: `${this.data.apis.apikeys.accessToken.value}` };
  }

  getInstallLink(): KeySchema {
    return this.data.app.install_link;
  }

  getAccessToken(): string {
    return this.data.apis.apikeys.accessToken.value;
  }

  getEndPoint(): string {
    return this.data.app.endpoint;
  }

  getApiCredentials() {
    return {
      key: this.data.app.api_credentials.key,
      secretKey: this.data.app.api_credentials.secretKey,
    };
  }
}
