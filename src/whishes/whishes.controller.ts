import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, NotFoundException,UsePipes,ValidationPipe } from '@nestjs/common';
import { WhishesService } from './whishes.service';
import { CreateWhishDto } from './dto/create-whishes.dto';
import { UpdateWishDto } from './dto/update-whish.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

//Декоратор базового маршрута для работы с желаниями
@Controller('whishes')
@UseGuards(AuthGuard('jwt'))
export class WhishesController {
  constructor(
    private readonly whishesService: WhishesService,
    private prisma: PrismaService
  ) {}

  //Получение всех желаний
  @Get()
  async findAll(@Req() req) {
    return this.whishesService.findAll(req.user.userId, req.user.role);
  }

  //Получение определённого желания по ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.whishesService.findOne(parseInt(id));
  }

  //Создание нового желания
  @Post()
  async create(@Req() req, @Body() dto: CreateWhishDto) {
    return this.whishesService.create(req.user.userId, dto);
  }

  //Обновление желания
  @Patch(':id')
  @UsePipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  async updateWhish(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: any
  ) {
    //Проверка существования желания
    const existingWhish = await this.prisma.whish.findFirst({
      where: {
        id: id,
        userId: req.user.userId, //Проверка принадлежит ли пользователю
      }
    });

    if (!existingWhish) {
      throw new NotFoundException('Желание не найдено');
    }

    const updateWhish = await this.prisma.whish.update({
      where: { id: id },
      data: {
        ...updateWishDto,
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
    //Проверка существования желания и прав доступа
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