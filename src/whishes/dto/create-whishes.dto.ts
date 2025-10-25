//Валидация для создания желания
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';


export class CreateWhishDto {
    @IsString()
  @MinLength(2, { message: "Минимальная длина 2 символа" })
  title: string;

    @IsString()
    link: string;
  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
