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
  it('should flip the dark_mode value in settings (testing settings use case)', async () => {
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
  it('should add a thread, add a message to the thread, and then remove both (testing thread and message use case)', async () => {
    // Add a thread to the database
    await service.add_thread(1, 'Test Thread');

    // Query the added thread
    let result = await pool.query('SELECT * FROM thread WHERE thread_id = $1', [1]);
    expect(result.rows.length).toBe(1);

    const messageID = 1; // Set messageID to 1
    const userID = 'a'; // Set userID to 'a'
    const threadID = 1; // Set threadID to 1
    const content = 'Hello, world!'; // Set content to 'Hello, world!'

    // Call the service method to add a message
    await service.add_message(messageID, userID, threadID, content);

    // Query the added message
    const result1 = await pool.query('SELECT * FROM message WHERE message_id = $1', [messageID]);
    expect(result1.rows.length).toBe(1);
    expect(result1.rows[0].user_id).toBe(userID);
    expect(result1.rows[0].thread_id).toBe(threadID);
    expect(result1.rows[0].content).toBe(content);

    // Call the service method to remove the added message
    await service.remove_message(messageID);

    // Query the removed message
    const result2 = await pool.query('SELECT * FROM message WHERE message_id = $1', [messageID]);
    expect(result2.rows.length).toBe(0);

    // Remove the thread from the database
    await service.remove_thread(threadID);

    // Query the removed thread
    const result3 = await pool.query('SELECT * FROM thread WHERE thread_id = $1', [threadID]);
    expect(result3.rows.length).toBe(0);
  });
});