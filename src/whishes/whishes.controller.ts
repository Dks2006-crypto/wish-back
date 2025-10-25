import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { WhishesService } from './whishes.service';
import { CreateWhishDto } from './dto/create-whishes.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

//Декоратор базового маршрута
@Controller('whishes')
@UseGuards(AuthGuard('jwt'))
export class whishesController {
  constructor(
    private readonly whishesService: WhishesService,
    private prisma: PrismaService
  ) {}

  //Получение всех желаний
  @Get()
  async findAll(@Req() req) {
    return this.whishesService.findAll(req.user.userId, req.user.role);
  }

  //Получение определённого желания
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.whishesService.findOne(parseInt(id));
  }

  //Создания нового желания
  @Post()
  async create(@Req() req, @Body() dto: CreateWhishDto) {
    return this.whishesService.create(req.user.userId, dto);
  }

  //Обновление желания
  @Patch(':id')
  async updateWhish(
    @Param('id', ParseIntPipe ) id: number, 
    @Body() body: any, 
    @Req() req: any) 
    {
      //Проврка существования желания
      const existingWhish = await this.prisma.whish.findFirst({
        where: {
          id: id,
          userId: req.user.userId,
        }
      });

      if(!existingWhish) {
        throw new NotFoundException('Желание не найдено');
      }

      //Обновление желания
      const updateWhish = await this.prisma.whish.update({
        where: { id: id},
        data: {
          title: body.title,
          description: body.description,
          link: body.link,
          priority: body.priority,
          completed: body.completed,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      return updateWhish;
    }

  //Удаление желания
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const existingWhish = await this.prisma.whish.findFirst({
      where: {
        id: id,
        userId: req.user.userId,
      }
    });

    if (!existingWhish) {
      throw new NotFoundException('Желание не найдено');
    }

    return this.whishesService.delete(id);
  }
}
