import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: vi.Mocked<ProjectsService>;

  const mockProject = {
    id: 1,
    name: 'Test Project',
    description: 'Test Description',
    tasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get(ProjectsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the dto', async () => {
      const dto = { name: 'New Project', description: 'New Description' };
      mockService.create.mockResolvedValue(mockProject as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      mockService.findAll.mockResolvedValue([mockProject] as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with numeric id', async () => {
      mockService.findOne.mockResolvedValue(mockProject as any);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { name: 'Updated Name' };
      mockService.update.mockResolvedValue({
        ...mockProject,
        name: 'Updated Name',
      } as any);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should call service.remove with numeric id', async () => {
      mockService.remove.mockResolvedValue(mockProject as any);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProject);
    });
  });
});
