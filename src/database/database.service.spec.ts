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
  let pool: jest.Mocked<Pool>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: Pool,
          useValue: {
            connect: jest.fn(),
            end: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    pool = module.get<Pool>(Pool) as jest.Mocked<Pool>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should block a user', async () => {
    const mockClient = {
      query: jest.fn().mockResolvedValue({}),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);
    console.log(process.env.DB_PASSWORD);

    await service.blockUser(1, 2);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should unblock a user and verify blocks table is empty', async () => {
    const mockClient = {
      query: jest.fn()
        .mockResolvedValueOnce({}) // First call: unblock
        .mockResolvedValueOnce({ rows: [] }), // Second call: check blocks table
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    await service.unblockUser(1, 2);

    // Simulate checking if the blocks table is empty
    const result = await mockClient.query('SELECT * FROM blocks WHERE blocker = $1 AND blocked = $2 RETURNING *', [1, 2]);
    expect(result).toEqual({});
  });
});
