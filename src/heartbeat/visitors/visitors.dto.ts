import { IsString, IsNotEmpty } from 'class-validator';

export class HeartbeatDto {
  @IsString()
  @IsNotEmpty()
  fingerprintId: string; // ID unik dari browser user

  @IsString()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class LeaveHeartbeatDto {
  @IsString()
  @IsNotEmpty()
  fingerprintId: string; // ID unik dari browser user
}
