import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  MaxLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

// Kita definisikan Enum agar validasi lebih ketat
export enum PortfolioDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very hard',
}

export enum PortfolioStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ON_PROGRESS = 'on progress',
}

export class SavePortfolioDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty({ message: 'Slug tidak boleh kosong' })
  @IsString()
  @MaxLength(255)
  slug: string;

  @IsNotEmpty({ message: 'Title tidak boleh kosong' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsNotEmpty({ message: 'Description tidak boleh kosong' })
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(PortfolioDifficulty, {
    message: 'Difficulty harus salah satu dari: easy, medium, hard, very hard',
  })
  difficulty: PortfolioDifficulty;

  @IsOptional()
  @IsString()
  // @IsUrl() // Aktifkan jika coverImage pasti berupa URL absolut (http://...)
  coverImage?: string;

  @IsOptional()
  @IsUrl({}, { message: 'View Code URL harus berupa link valid' })
  viewCodeUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Live Demo URL harus berupa link valid' })
  liveDemoUrl?: string;

  @IsOptional()
  @IsEnum(PortfolioStatus, {
    message: 'Status harus salah satu dari: draft, published, on progress',
  })
  status?: PortfolioStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Setiap Technology ID harus berupa string' })
  technologyIds?: string[];
}

export class PortfolioQueryDto {
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
  search?: string; // Search by Title or Slug

  @IsOptional()
  @IsEnum(PortfolioStatus)
  status?: PortfolioStatus;

  @IsOptional()
  @IsEnum(PortfolioDifficulty)
  difficulty?: PortfolioDifficulty;
}

export class UpdatePortfolioStatusDto {
  @IsString()
  id: string;
  @IsEnum(PortfolioStatus, {
    message: 'Status harus valid: draft, published, atau on progress',
  })
  status: PortfolioStatus;
}

export class RemovePortfolioDto {
  @IsString()
  id: string;
}
