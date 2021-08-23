// cSpell:ignore rakuten, prefs
import path from 'path';
import dotenv from 'dotenv';
import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().required(),
    NODE_ENV: Joi.string().valid('dev', 'prod').required(),
    AWS_SDK_LOAD_CONFIG: Joi.number().required(),
    AWS_PROFILE: Joi.string().required(),
    DYNAMO_TABLE_NAME: Joi.string().required(),
    DYNAMO_TABLE_KEY: Joi.string().required(),
    RAKUTEN_KEY_VALIDATE_URL: Joi.string().required(),
    RAKUTEN_ITEM_PARAM: Joi.string().required(),
    WEB_LINK_BASE: Joi.string().required(),
    SP_API_AWS_ACCESS_KEY_ID: Joi.string().required(),
    SP_API_AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    SP_API_AWS_SELLING_PARTNER_ROLE: Joi.string().required(),
  })
  .unknown();

export function envConfig(NODE_ENV: string): void {
  if (NODE_ENV === 'prod') {
    dotenv.config({ path: path.join(__dirname, '../../../env/.env.prod') });
  } else if (NODE_ENV === 'dev') {
    dotenv.config({ path: path.join(__dirname, '../../../env/.env.dev') });
  } else {
    throw new Error('process.env.NODE_ENV를 설정하지 않았습니다!');
  }

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
}
