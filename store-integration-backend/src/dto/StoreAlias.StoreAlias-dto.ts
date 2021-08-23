import { IsDefined, IsString } from 'class-validator';

// storeAlias -> validateStoreAlias에 대한 dto
export class ValidateStoreAliasDto {
  constructor(storeAlias: string) {
    this.storeAlias = storeAlias;
  }

  @IsDefined()
  @IsString()
  public storeAlias: string;
}
