// cSpell:ignore mockupdate, rakuten, apikeys
export const mockEqualQuery = jest.fn();
export const mockupdateItem = jest.fn();
const mock = jest.fn().mockImplementation(() => {
  return { equalQuery: mockEqualQuery, updateItem: mockupdateItem };
});

export default mock;

export const dynamoQueryResponseRakutenNotConnected = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            licenseKey: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '2022-07-19' },
              },
            },
            serviceSecret: {
              M: {
                value: { S: 'bbb' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    isConnected: { BOOL: false },
    storeAlias: { S: '' },
  },
};

export const dynamoQueryResponseRakutenConnected = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            licenseKey: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '2022-07-19' },
              },
            },
            serviceSecret: {
              M: {
                value: { S: 'bbb' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    isConnected: { BOOL: true },
    storeAlias: { S: 'axB_Rakuten' },
  },
};

export const dynamoQueryResponseAmazonNotConnected = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            refreshToken: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '' },
              },
            },
            spapi_oauth_code: {
              M: {
                value: { S: 'bbb' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    app: {
      M: {
        appId: { S: 'apps' },
        LWA_credentials: {
          M: {
            client_identifier: { S: 'secret' },
            client_secret: { S: 'secret' },
          },
        },
      },
    },
    isConnected: { BOOL: false },
    storeAlias: { S: '' },
  },
};

export const dynamoQueryResponseAmazonConnected = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            refreshToken: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '' },
              },
            },
            spapi_oauth_code: {
              M: {
                value: { S: 'bbb' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    app: {
      M: {
        appId: { S: 'apps' },
        LWA_credentials: {
          M: {
            client_identifier: { S: '' },
            client_secret: { S: '' },
          },
        },
      },
    },
    isConnected: { BOOL: true },
    storeAlias: { S: 'axB_Amazon' },
  },
};

export const dynamoQueryResponseShopifyConnected = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            accessToken: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    app: {
      M: {
        endpoint: { S: 'www.endpoint.com' },
        api_credentials: {
          M: {
            key: { S: '' },
            secretKey: { S: '' },
          },
        },
        install_link: {
          M: {
            value: { S: 'install_link.com' },
            expires: { S: '2023. 2. 9' },
          },
        },
      },
    },
    isConnected: { BOOL: true },
    storeAlias: { S: '' },
  },
};

export const dynamoQueryResponseShopifyNotConnected = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            accessToken: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    app: {
      M: {
        endpoint: { S: 'www.endpoint.com' },
        api_credentials: {
          M: {
            key: { S: '' },
            secretKey: { S: '' },
          },
        },
        install_link: {
          M: {
            value: { S: 'install_link.com' },
            expires: { S: '' },
          },
        },
      },
    },
    isConnected: { BOOL: false },
    storeAlias: { S: 'axB_Shopify' },
  },
};

export const dynamoQueryResponseShopifyConnectedExpiresLink = {
  M: {
    apis: {
      M: {
        apikeys: {
          M: {
            accessToken: {
              M: {
                value: { S: 'aaa' },
                expires: { S: '' },
              },
            },
          },
        },
      },
    },
    app: {
      M: {
        endpoint: { S: 'www.endpoint.com' },
        api_credentials: {
          M: {
            key: { S: '' },
            secretKey: { S: '' },
          },
        },
        install_link: {
          M: {
            value: { S: 'install_link.com' },
            expires: { S: '' },
          },
        },
      },
    },
    isConnected: { BOOL: true },
    storeAlias: { S: 'axB_Shopify' },
  },
};
