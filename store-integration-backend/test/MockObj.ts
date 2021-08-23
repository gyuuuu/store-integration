// cSpell:ignore rakuten, apikeys
const DynamoParserNoCustomerErrorValue = {
  errorType: 'customerId not found',
  detailError: {
    statusCode: 400,
    message: 'customerId error!',
  },
};
const customNoStoreErrorValue = {
  errorType: 'no store error',
  detailError: {
    statusCode: 400,
    message: 'There is no store to link. Please contact axB',
  },
};

export default {
  DynamoParserNoCustomerErrorValue,
  customNoStoreErrorValue,
};
