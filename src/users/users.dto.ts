import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or username is required' })
  @Matches(/^([^\s@]+@[^\s@]+\.[^\s@]+|[a-zA-Z0-9_.-]{3,30})$/, {
    message: 'Invalid email or username',
  })
  identifier: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsBoolean({ message: 'Remember me must be a boolean' })
  @IsOptional()
  rememberMe?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  @MinLength(8, {
    message: 'Current password must be at least 8 characters',
  })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, {
    message: 'New password must be at least 8 characters',
  })
  newPassword: string;
}

export class RequestNewPasswordDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, {
    message: 'New password must be at least 8 characters',
  })
  newPassword: string;
}
