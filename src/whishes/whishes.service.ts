import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWhishDto } from './dto/create-whishes.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class WhishesService {
  //Внедрение Prisma
  constructor(private readonly prismaService: PrismaService ) {}

  //Получение всех желаний
  async findAll(userId: number, role: string) {
    if (role === 'ADMIN') return this.prismaService.whish.findMany();

    return this.prismaService.whish.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  //Получение одного желания
  async findOne(id: number) {
    const whish = await this.prismaService.whish.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!whish) throw new NotFoundException(`Запись с id ${id} не найдена`);
    return whish;
  }

  //Создание желания
  async create(userId: number, dto: CreateWhishDto) {
    return this.prismaService.whish.create({
      data: { ...dto, userId },
    });
  }

  //Удаления определённого желания
  async delete(id: number) {
    const whish = await this.prismaService.whish.findUnique({ where: { id } });
    if (!whish) throw new NotFoundException(`Запись с id ${id} не найдена`);
    
    return this.prismaService.whish.delete({ where: { id } });
  }
}