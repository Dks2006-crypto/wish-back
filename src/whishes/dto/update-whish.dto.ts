//Валидация для обновления желания
import { IsEnum, IsOptional, IsString } from "class-validator";


enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export class UpdateWishDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}