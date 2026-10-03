import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { ProjectsController } from './projects.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
