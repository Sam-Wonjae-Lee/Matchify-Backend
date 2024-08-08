import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';

describe('SettingsController', () => {
  let controller: SettingsController;
  let service: SettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {
            create: jest.fn(),
            dark_mode: jest.fn(),
            private: jest.fn(),
            notification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SettingsController>(SettingsController);
    service = module.get<SettingsService>(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method of SettingsService', async () => {
    const settingsDto: SettingsDto = { user_id: 1, darkMode: true, privateMode: false, notification: true };
    await controller.create(settingsDto);
    expect(service.create).toHaveBeenCalledWith(settingsDto);
  });

  it('should call dark_mode method of SettingsService', async () => {
    const settingsDto: SettingsDto = { user_id: 1, darkMode: true, privateMode: false, notification: true };
    await controller.dark_mode(settingsDto);
    expect(service.dark_mode).toHaveBeenCalledWith(settingsDto);
  });

  it('should call private method of SettingsService', async () => {
    const settingsDto: SettingsDto = { user_id: 1, darkMode: true, privateMode: false, notification: true };
    await controller.private(settingsDto);
    expect(service.private).toHaveBeenCalledWith(settingsDto);
  });

  it('should call notification method of SettingsService', async () => {
    const settingsDto: SettingsDto = { user_id: 1, darkMode: true, privateMode: false, notification: true };
    await controller.notification(settingsDto);
    expect(service.notification).toHaveBeenCalledWith(settingsDto);
  });
});