import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  Min,
  Max,
  ValidateNested,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class DateRangeDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

export class ListBlogDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['draft', 'published', 'unpublished'])
  status?: 'draft' | 'published' | 'unpublished';

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;
}

export class SaveBlogDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  contentMdx: string;

  @IsOptional()
  @IsIn(['draft', 'published', 'unpublished'])
  status?: 'draft' | 'published' | 'unpublished';
}

export class ChangeStatusDto {
  @IsString()
  id: string;

  @IsIn(['draft', 'published', 'unpublished'])
  status: 'draft' | 'published' | 'unpublished';
}

export class detailDto {
  @IsString()
  id: string;
}
