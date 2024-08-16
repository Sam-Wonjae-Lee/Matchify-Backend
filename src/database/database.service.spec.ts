import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { Pool } from 'pg';

const fs = require('fs');
const path = require('path');

// Use __dirname to get the current directory of the script
const filePath = path.join(__dirname, 'database_schema.sql');
const resetTablesQuery = fs.readFileSync(filePath, 'utf8');

describe('DatabaseService (Integration)', () => {
  let service: DatabaseService;
  let pool: Pool;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await pool.query(resetTablesQuery);
  });

  afterAll(async () => {
    await pool.end();
  });
  
  it('should add the users', async () => {
    await service.addUserInfo('a', 'user1', 'frank', 'george', 'detriot', new Date(), 'loves chicken', 'nice@gmail.com', '/best_girl.jpg', 'playlist1', "gay");
    const result1 = await pool.query('SELECT * FROM users WHERE user_id = $1 AND gender = $2', ['a', 'gay']);
    expect(result1.rows.length).toBe(1);
    await service.addUserInfo('b', 'user1', 'bob', 'george', 'detriot', new Date(), 'loves chicken', 'nice@gmail.com', '/best_girl.jpg','playlist1', "gay");
    const result2 = await pool.query('SELECT * FROM users WHERE user_id = $1', ['b']);
    expect(result2.rows.length).toBe(1);
  });
  it('users send friends requests', async () => {
    await service.send_friend_request('b','a');
    const result1 = await pool.query('SELECT * FROM friend_request WHERE sender = $1 AND receiver = $2', ['a', 'b']);
    expect(result1.rows.length).toBe(1);
  });
  it('users accept friends requests', async () => {
    // check if the friend request is deleted
    await service.acceptFriendRequest('b','a');
    const result1 = await pool.query('SELECT * FROM friend_request WHERE sender = $1 AND receiver = $2', ['a', 'b']);
    expect(result1.rows.length).toBe(0);
    // check if the friend is added
    const result2 = await pool.query('SELECT * FROM friends WHERE user1 = $1 AND user2 = $2', ['a', 'b']);
    expect(result2.rows.length).toBe(1);
  });
  it('should flip the dark_mode value in settings', async () => {
    const user_id = 'a'; // Set user_id to 'a'

    // Initial setup: Add a setting with default boolean values
    await service.create_user_setting(user_id);
    
    // Query the initial value of dark_mode
    let result = await pool.query('SELECT dark_mode FROM settings WHERE user_id = $1', [user_id]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].dark_mode).toBe(true);
    
    // Call the service method to flip the dark_mode value
    await service.update_dark_mode(user_id);
    
    // Query the value after flipping
    result = await pool.query('SELECT dark_mode FROM settings WHERE user_id = $1', [user_id]);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].dark_mode).toBe(false);
  });
  
  
});