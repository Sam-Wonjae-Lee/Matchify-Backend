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
    await service.addUserInfo('c', 'user1', 'bob', 'george', 'detriot', new Date(), 'loves chicken', 'nice@gmail.com', '/best_girl.jpg','playlist1', "gay");
    const result3 = await pool.query('SELECT * FROM users WHERE user_id = $1', ['c']);
    expect(result3.rows.length).toBe(1);
  });
  it('users send friends requests', async () => {
    await service.send_friend_request('b','a');
    const result1 = await pool.query('SELECT * FROM friend_request WHERE sender = $1 AND receiver = $2', ['a', 'b']);
    expect(result1.rows.length).toBe(1);
    await service.send_friend_request('a','c');
    const result2 = await pool.query('SELECT * FROM friend_request WHERE sender = $1 AND receiver = $2', ['a', 'c']);
    expect(result2.rows.length).toBe(1);
  });
  it('users accept friends requests', async () => {
    // check if the friend request is deleted
    await service.acceptFriendRequest('b','a');
    const result1 = await pool.query('SELECT * FROM friend_request WHERE sender = $1 AND receiver = $2', ['a', 'b']);
    expect(result1.rows.length).toBe(0);
    await service.acceptFriendRequest('a','c');
    const result3 = await pool.query('SELECT * FROM friend_request WHERE sender = $1 AND receiver = $2', ['a', 'b']);
    expect(result3.rows.length).toBe(0);
    // check if the friend is added
    const result2 = await pool.query('SELECT * FROM friends WHERE user1 = $1 AND user2 = $2', ['a', 'b']);
    expect(result2.rows.length).toBe(1);
  });
  it('users get friends', async () => {
    const result1 = await service.getUserFriends('a');
    expect(result1.length).toBe(2);
    const result2 = await service.getUserFriends('b');
    expect(result2.length).toBe(1);
  });
  it('should update user info', async () => {
    // did not check user's dob change upon update user
    // Add a user to update
    await service.addUserInfo('d', 'user2', 'john', 'doe', 'new york', new Date(), 'loves pizza', 'john@gmail.com', '/john.jpg', 'playlist2', "male");

    // Update the user's info
    await service.updateUserInfo({
      user_id: 'd',
      username: 'new_user2',
      first_name: 'johnny',
      last_name: 'doe',
      location: 'los angeles',
      dob: new Date('1990-01-01'),
      bio: 'loves burgers',
      email: 'johnny@gmail.com',
      profile_pic: '/johnny.jpg',
      favourite_playlist: 'playlist3',
      gender: 'male'
    });

    // Verify the updates
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', ['d']);
    expect(result.rows.length).toBe(1);
    const user = result.rows[0];
    expect(user.username).toBe('new_user2');
    expect(user.first_name).toBe('johnny');
    expect(user.last_name).toBe('doe');
    expect(user.location).toBe('los angeles');
    expect(user.bio).toBe('loves burgers');
    expect(user.email).toBe('johnny@gmail.com');
    expect(user.profile_pic).toBe('/johnny.jpg');
    expect(user.favourite_playlist).toBe('playlist3');
    expect(user.gender).toBe('male');
  });


  it('should block a user', async () => {
    // Add users to block
    await service.addUserInfo('e', 'user3', 'alice', 'smith', 'chicago', new Date(), 'loves cats', 'alice@gmail.com', '/alice.jpg', 'playlist4', "female");
    await service.addUserInfo('f', 'user4', 'bob', 'johnson', 'miami', new Date(), 'loves dogs', 'bob@gmail.com', '/bob.jpg', 'playlist5', "male");

    // Block the user
    const res = await service.blockUser('e', 'f');

    // Verify the block in the database
    const result = await pool.query('SELECT * FROM blocks WHERE user = $1 AND blocked = $2', ['e', 'f']);
    console.log(result);
    expect(result.length).toBe(1);
  });

  it('should not block a user twice', async () => {
    // Attempt to block the same user again
    try {
      await service.blockUser('e', 'f');
    } catch (e) {
      expect(e).toBeDefined();
    }

    // Verify that the block is still only recorded once in the database
    const result = await pool.query('SELECT * FROM blocks WHERE blocker = $1 AND blocked = $2', ['e', 'f']);
    expect(result.length).toBe(1);
  });
});