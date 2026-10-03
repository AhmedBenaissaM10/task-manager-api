import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ProjectsService } from '../projects/projects.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    private readonly projectsService: ProjectsService,
  ) {}

  async create(dto: CreateTaskDto) {
    // throws 404 if the project doesn't exist
    await this.projectsService.findOne(dto.projectId);

    const task = this.tasksRepo.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
    return this.tasksRepo.save(task);
  }

  async findAll(query: FindTasksQueryDto) {
    const { status, projectId, page, limit } = query;

    const where: FindOptionsWhere<Task> = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;

    const [data, total] = await this.tasksRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const task = await this.tasksRepo.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    const { dueDate, ...rest } = dto;

    Object.assign(task, rest);
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);

    return this.tasksRepo.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);
  }
}
