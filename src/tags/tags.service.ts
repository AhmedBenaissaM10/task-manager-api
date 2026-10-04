import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}
  create(dto: CreateTagDto) {
    const tag = this.tagRepository.create(dto);
    return this.tagRepository.save(tag);
  }

  findAll() {
    return this.tagRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: { tasks: true },
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: number, dto: UpdateTagDto) {
    const tag = await this.findOne(id);
    Object.assign(tag, dto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    return this.tagRepository.remove(tag);
  }
}
