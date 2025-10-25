import { Module } from '@nestjs/common';
import { WhishesService } from './whishes.service';
import { whishesController } from './whishes.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';

@Module({
   imports: [
      JwtModule,
      PrismaModule,
      PassportModule,
    ],
  controllers: [whishesController],
  providers: [WhishesService],
})
export class WhishesModule {}
