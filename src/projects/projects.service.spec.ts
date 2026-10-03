import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { Project } from './entities/project.entity.js';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockProject: Project = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a project', async () => {
      const dto = { name: 'New Project', description: 'New Description' };
      mockRepository.create.mockReturnValue(mockProject);
      mockRepository.save.mockResolvedValue(mockProject);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProject);
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return an array of projects ordered by createdAt DESC', async () => {
      mockRepository.find.mockResolvedValue([mockProject]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should return a project by id with tasks relation', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { tasks: true },
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Project with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a project', async () => {
      const dto = { name: 'Updated Name' };
      mockRepository.findOne.mockResolvedValue({ ...mockProject });
      mockRepository.save.mockResolvedValue({
        ...mockProject,
        name: 'Updated Name',
      });

      const result = await service.update(1, dto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { tasks: true },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when updating non-existent project', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a project', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.remove.mockResolvedValue(mockProject);

      const result = await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { tasks: true },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProject);
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when removing non-existent project', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
