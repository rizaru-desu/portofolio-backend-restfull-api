import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  Max,
  Min,
  IsNumber,
} from 'class-validator';

export class SaveTestimoniDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class DeleteTestimoniDto {
  @IsString()
  id: string;
}

export class PublishTestimoniDto {
  @IsString()
  id: string;

  @IsBoolean()
  isPublished: boolean;
}

export class ListTestimoniDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
