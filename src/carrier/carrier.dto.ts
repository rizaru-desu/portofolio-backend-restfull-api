import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveCarrierDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(10)
  periodStart: string; // "2021"

  @IsString()
  @MaxLength(10)
  periodEnd: string; // "PRESENT"

  @IsString()
  @MaxLength(255)
  companyName: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  description: string;
}

export class DeleteDto {
  @IsString()
  id: string;
}
