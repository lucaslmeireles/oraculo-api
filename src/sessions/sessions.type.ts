import { IsString, IsNotEmpty, IsDate } from 'class-validator';
export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  seekerId: string;

  @IsString()
  @IsNotEmpty()
  oracleId: string;
}

export class UpdateOracleDto {
  @IsString()
  @IsNotEmpty()
  oracleId: string;

  @IsDate()
  matchedAt: Date;
}

export class CloseSessionDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
