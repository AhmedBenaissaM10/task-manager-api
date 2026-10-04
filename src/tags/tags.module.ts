import { Module } from '@nestjs/common';
import { TagsService } from './tags.service.js';
import { TagsController } from './tags.controller.js';
import { Tag } from './entities/tag.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
