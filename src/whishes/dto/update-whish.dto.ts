import { IsEnum, IsOptional, IsString, IsBoolean } from "class-validator";

// Enum для приоритетов желания
enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class UpdateWishDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Ссылка должна быть строкой' })
  @IsOptional()
  link?: string;

  @IsEnum(Priority, { message: 'Приоритет должен быть одним из: LOW, MEDIUM, HIGH' })
  @IsOptional()
  priority?: Priority;

  @IsBoolean({ message: 'Статус выполнения должен быть булевым значением' })
  @IsOptional()
  completed?: boolean;
}