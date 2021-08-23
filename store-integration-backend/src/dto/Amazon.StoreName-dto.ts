import { IsDefined, IsString } from 'class-validator';

export class ValidateStoreNameDto {
  constructor(storeName: string) {
    this.storeName = storeName;
  }

  @IsDefined()
  @IsString()
  storeName: string;
}
