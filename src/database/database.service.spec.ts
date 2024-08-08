import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { Pool } from 'pg';

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('DatabaseService', () => {
  let service: DatabaseService;
  let pool: Pool;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    pool = module.get<Pool>(Pool);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should block a user', async () => {
    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [{ user: 1, blocked_user: 2 }] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const result = await service.blockUser(1, 2);
    expect(result).toEqual({ rows: [{ user: 1, blocked_user: 2 }] });
    expect(mockClient.query).toHaveBeenCalledWith(
      'INSERT INTO blocks VALUES ($1, $2) RETURNING *',
      [1, 2],
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should unblock a user', async () => {
    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [{ user: 1, blocked_user: 2 }] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const result = await service.unblockUser(1, 2);
    expect(result).toEqual({ rows: [{ user: 1, blocked_user: 2 }] });
    expect(mockClient.query).toHaveBeenCalledWith(
      'DELETE FROM blocks WHERE blocker = $1 AND blocked = $2 RETURNING *',
      [1, 2],
    );
    expect(mockClient.release).toHaveBeenCalled();
  });
});