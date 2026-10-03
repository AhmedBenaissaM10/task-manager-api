import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { Project } from './entities/project.entity.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll() {
    return this.projectRepository.find();
  }

  async findOne(id: number) {
    const project =  this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.projectRepository.update(id, updateProjectDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return this.projectRepository.remove(project);
  }
}
