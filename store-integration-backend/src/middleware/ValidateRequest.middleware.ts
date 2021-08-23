// cSpell:ignore rakuten
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidateKeyDto } from '../dto/Rakuten.ValidateKey-dto';
import { errResponse } from '../common/function/response';
import { PostApiKeyDto } from '../dto/Rakuten.PostApiKey-dto';
import { ValidateStoreNameDto } from '../dto/Amazon.StoreName-dto';
import { ValidateRefreshTokenDto } from '../dto/Amazon.RefreshToken-dto';
import { ValidateStoreAliasDto } from '../dto/StoreAlias.StoreAlias-dto';

type FunctionMapType = {
  [key: string]: Function;
};

const functionMap: FunctionMapType = {
  storeName: validateStoreName,
  keyInput: validateKeyInput,
  refreshToken: validateRefreshToken,
  postApiKey: validatePostApiKey,
  storeAlias: validateStoreAlias,
} as const;

// req.query로 들어오는 storeName을 validate -> 존재하는지, string인지
async function validateStoreName(req: Request) {
  const validateStoreNameDTO = new ValidateStoreNameDto(req.query.storeName as string);
  const errors: ValidationError[] = await validate(validateStoreNameDTO);
  if (errors.length > 0) {
    throw errors;
  }
}

// req.body로 들어오는 serviceSecret, licenseKey를 validate -> 존재하는지, string인지
async function validateKeyInput(req: Request) {
  const validateKeyDto = new ValidateKeyDto(req.body.serviceSecret, req.body.licenseKey);
  const errors: ValidationError[] = await validate(validateKeyDto);
  if (errors.length > 0) {
    throw errors;
  }
}

// req.body로 들어오는 storeAlias를 validate -> 존재하는지, string인지
async function validateStoreAlias(req: Request) {
  const validateStoreAliasDto = new ValidateStoreAliasDto(req.body.storeAlias);
  const errors: ValidationError[] = await validate(validateStoreAliasDto);
  if (errors.length > 0) {
    throw errors;
  }
}

async function validateRefreshToken(req: Request) {
  const validateRefreshTokenDto = new ValidateRefreshTokenDto(req.body.refreshToken);
  const errors: ValidationError[] = await validate(validateRefreshTokenDto);
  if (errors.length > 0) {
    throw errors;
  }
}

// req.body로 들어오는 {serviceSecret, licenseKey}를 validate -> 존재하는지, 형태가 올바른지
async function validatePostApiKey(req: Request) {
  const postApiKeyDto = new PostApiKeyDto(req.body || undefined);
  const errors: ValidationError[] = await validate(postApiKeyDto);
  if (errors.length > 0) {
    throw errors;
  }
}

function validateRequest(args: string[]) {
  const functionList: Function[] = args.map(arg => functionMap[arg]);

  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      for (const func of functionList) {
        await func(req);
      }
      next();
    } catch (error) {
      errResponse(res, 400, 'request error', error);
    }
  };
}

export default { validateRequest };
