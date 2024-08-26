/**
 * For manipulating values in database
 */

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
// import { escape } from 'querystring';
// import { Interface } from 'readline';
const dotenv = require('dotenv');
dotenv.config();


@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool;
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async addAccessRefreshToken(user: string, access_token: string, refresh_token: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'DELETE FROM tokens WHERE user_id = $1 RETURNING *',
        [user],
      );
      const res2 = await client.query(
        'INSERT INTO tokens VALUES ($1, $2, $3) RETURNING *',
        [user, access_token, refresh_token],
      );
      return res2;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  async getUserAccessToken(user: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'SELECT access_token FROM tokens WHERE user_id = $1',
        [user],
      );
      if (res.rows.length > 0) {
        return res.rows[0].access_token;
      }
      return null;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  async getUser(user: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'SELECT * FROM users WHERE user_id = $1',
        [user],
      );
      console.log(res.rows[0].dob);
      return res.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  async getUserFriends(user: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'SELECT * FROM friends WHERE user1 = $1 OR user2 = $2',
        [user, user],
      );
      return res.rows;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  async addUserInfo(user_id: string, username: string, first_name: string, last_name: string, location: string, dob: Date, bio: string, email: string, profile_pic: string, favourite_playlist: string, gender: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [user_id, username, first_name, last_name, location, dob, bio, email, gender, profile_pic, favourite_playlist]
      );
      return { success: true }
    } catch (e) {
      console.log(e);
      if (e.code === '23505') { // Unique violation error code in PostgreSQL
        if (e.detail.includes('user_id')) {
          return { success: false, message: 'User ID already exists.' };
        } 
      }
      return { success: false, message: 'Error with account creation.' };
    } finally {
      client.release();
    }
  }

  async updateUserInfo({
    user_id,
    username = null,
    first_name = null,
    last_name = null,
    location = null,
    dob = null,
    bio = null,
    email = null,
    profile_pic = null,
    favourite_playlist = null,
    gender = null
  }) {
    const client = await this.pool.connect();
    try {
      if (username !== null) {
        client.query('UPDATE users SET username = $1 WHERE user_id = $2', [username, user_id]);
      }
      if (first_name !== null) {
        client.query('UPDATE users SET first_name = $1 WHERE user_id = $2', [first_name, user_id]);
      }
      if (last_name !== null) {
        client.query('UPDATE users SET last_name = $1 WHERE user_id = $2', [last_name, user_id]);
      }
      if (location !== null) {
        client.query('UPDATE users SET location = $1 WHERE user_id = $2', [location, user_id]);
      }
      if (dob !== null) {
        client.query('UPDATE users SET dob = $1 WHERE user_id = $2', [dob, user_id]);
      }
      if (bio !== null) {
        client.query('UPDATE users SET bio = $1 WHERE user_id = $2', [bio, user_id]);
      }
      if (email !== null) {
        client.query('UPDATE users SET email = $1 WHERE user_id = $2', [email, user_id]);
      }
      if (profile_pic !== null) {
        client.query('UPDATE users SET profile_pic = $1 WHERE user_id = $2', [profile_pic, user_id]);
      }
      if (favourite_playlist !== null) {
        client.query('UPDATE users SET favourite_playlist = $1 WHERE user_id = $2', [favourite_playlist, user_id]);
      }
      if (gender !== null) {
        client.query('UPDATE users SET gender = $1 WHERE user_id = $2', [gender, user_id]);
      }

    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }
  

  // adds (user, blocked_user) to blocks table
  async blockUser(user: string, blocked_user: string) {
    console.log(process.env.DB_PASSWORD as string);
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'INSERT INTO blocks VALUES ($1, $2) RETURNING *',
        [user, blocked_user],
      );
      return res;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // deletes (user, blocked_user) from blocks table
  async unblockUser(user: string, unblocked_user: string) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'DELETE FROM blocks WHERE blocker = $1 AND blocked = $2 RETURNING *',
        [user, unblocked_user],
      );
      return res;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // message use case
  async add_message(
    messageID: number,
    userID: string,
    threadID: number,
    content: string,
  ) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'INSERT INTO message VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [messageID, userID, threadID, content],
      );
      console.log(res.rows);
      return res;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // removes message from thread
  async remove_message(messageID: number) {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'DELETE FROM message WHERE messageID = $1 RETURNING *',
        [messageID],
      );
      console.log(res.rows);
      return res;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // sends friend request
  async send_friend_request(sender_id: string, receiver_id: string) {
    const client = await this.pool.connect();
    // did this to comply with the database constraint for friends
    let user_id1 = sender_id;
    let user_id2 = receiver_id;
    if (receiver_id < sender_id){
      user_id1 = receiver_id;
      user_id2 = sender_id;
    }
    try {
      const res = await client.query(
        'INSERT INTO friend_request VALUES ($1, $2) RETURNING *',
        [user_id1, user_id2],
      );
      return res;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // adds sender to receiver's friend list and remove the request from the inbox
  async acceptFriendRequest(receiver_id: string, sender_id: string) {
    console.log(process.env.DB_PASSWORD as string);
    const client = await this.pool.connect();
    // did this to comply with the database constraint for friends
    let user_id1 = sender_id;
    let user_id2 = receiver_id;
    if (receiver_id < sender_id){
      user_id1 = receiver_id;
      user_id2 = sender_id;
    }
    try {
      const insertFriend = await client.query(
        'INSERT INTO friends (user1, user2) VALUES ($1, $2) RETURNING *',
        [user_id1, user_id2]
      );
      console.log(insertFriend.rows);
      const deleteRequest = await client.query(
        'DELETE FROM friend_request WHERE receiver = $1 AND sender = $2 RETURNING *',
        [user_id2, user_id1]
      );
      console.log(deleteRequest.rows);
      return {
        insertFriend,
        deleteRequest,
      };
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // remove sender's request from receiver's inbox
  async declineFriendRequest(receiver_id: string, sender_id: string) {
    console.log(process.env.DB_PASSWORD as string);
    const client = await this.pool.connect();

    // did this to comply with the database constraint for friends
    let user_id1 = sender_id;
    let user_id2 = receiver_id;
    if (receiver_id < sender_id){
      user_id1 = receiver_id;
      user_id2 = sender_id;
    }
    try {
      const deleteRequest = await client.query(
        'DELETE FROM friendrequest WHERE receiver = $1 AND sender = $2 RETURNING *',
        [user_id2, user_id1]
      );
      console.log(deleteRequest.rows);
      return deleteRequest;
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // create user settings
  async create_userSetting(userid: string) {
    console.log(process.env.DB_PASSWORD as string);
    const client = await this.pool.connect();
    try {
      const create_userSetting = await client.query(
        'INSERT INTO settings (userid, darkMode, private, notification) VALUES ($1, $2, $3, $4) RETURNING *',
        [userid, false, false, false]
      );
      console.log(create_userSetting.rows);
      return create_userSetting.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update options setting for user
  async update_options(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT options FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentOptions = result.rows[0].options.valueOf();
      const newOptions = !currentOptions;
      const updateOptions = await client.query(
        'UPDATE settings SET options = $1 WHERE user_id = $2 RETURNING *',
        [newOptions, user_id]
      );
      return updateOptions.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update dark_mode setting for user
  async update_dark_mode(user_id: string) {
    console.log(process.env.DB_PASSWORD as string);
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT dark_mode FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentDarkMode = result.rows[0].dark_mode.valueOf();
      console.log(currentDarkMode);
      const newDarkMode = !currentDarkMode;
      console.log(newDarkMode);
      const updateDarkMode = await client.query(
        'UPDATE settings SET dark_mode = $1 WHERE user_id = $2 RETURNING *',
        [newDarkMode, user_id]
      );
      console.log(updateDarkMode.rows);
      return updateDarkMode.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update friend_message setting for user
  async update_friend_message(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT friend_message FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentFriendMessage = result.rows[0].friend_message.valueOf();
      const newFriendMessage = !currentFriendMessage;
      const updateFriendMessage = await client.query(
        'UPDATE settings SET friend_message = $1 WHERE user_id = $2 RETURNING *',
        [newFriendMessage, user_id]
      );
      return updateFriendMessage.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update friend_visibility setting for user
  async update_friend_visibility(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT friend_visibility FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentFriendVisibility = result.rows[0].friend_visibility.valueOf();
      const newFriendVisibility = !currentFriendVisibility;
      const updateFriendVisibility = await client.query(
        'UPDATE settings SET friend_visibility = $1 WHERE user_id = $2 RETURNING *',
        [newFriendVisibility, user_id]
      );
      return updateFriendVisibility.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update friend_request setting for user
  async update_friend_request(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT friend_request FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentFriendRequest = result.rows[0].friend_request.valueOf();
      const newFriendRequest = !currentFriendRequest;
      const updateFriendRequest = await client.query(
        'UPDATE settings SET friend_request = $1 WHERE user_id = $2 RETURNING *',
        [newFriendRequest, user_id]
      );
      return updateFriendRequest.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update playlist_update setting for user
  async update_playlist_update(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT playlist_update FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentPlaylistUpdate = result.rows[0].playlist_update.valueOf();
      const newPlaylistUpdate = !currentPlaylistUpdate;
      const updatePlaylistUpdate = await client.query(
        'UPDATE settings SET playlist_update = $1 WHERE user_id = $2 RETURNING *',
        [newPlaylistUpdate, user_id]
      );
      return updatePlaylistUpdate.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update new_events setting for user
  async update_new_events(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT new_events FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentNewEvents = result.rows[0].new_events.valueOf();
      const newNewEvents = !currentNewEvents;
      const updateNewEvents = await client.query(
        'UPDATE settings SET new_events = $1 WHERE user_id = $2 RETURNING *',
        [newNewEvents, user_id]
      );
      return updateNewEvents.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }

  // Update event_reminder setting for user
  async update_event_reminder(user_id: string) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(
        'SELECT event_reminder FROM settings WHERE user_id = $1',
        [user_id]
      );
      const currentEventReminder = result.rows[0].event_reminder.valueOf();
      const newEventReminder = !currentEventReminder;
      const updateEventReminder = await client.query(
        'UPDATE settings SET event_reminder = $1 WHERE user_id = $2 RETURNING *',
        [newEventReminder, user_id]
      );
      return updateEventReminder.rows[0];
    } catch (e) {
      console.log(e);
    } finally {
      client.release();
    }
  }


  async unsend_friend_request(sender_id: string, receiver_id: string) {
        const client = await this.pool.connect();
        
        
        // did this to comply with the database constraint for friends
        let user_id1 = sender_id;
        let user_id2 = receiver_id;
        if (receiver_id < sender_id){
          user_id1 = receiver_id;
          user_id2 = sender_id;
        } 
        try {
            const res = await client.query("DELETE FROM friendrequest WHERE sender = $1 AND receiver = $2 RETURNING *", [user_id1, user_id2]);
            console.log(res.rows);
        return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }


    private async _check_concert(concert_id: string): Promise<boolean> {
      const client = await this.pool.connect();
      try {
        const res = await client.query<{ concert_count: number }>(
          "SELECT COUNT(*) AS concert_count FROM concert WHERE concert_id= $1;",
          [concert_id]
        );
        return (res.rows[0].concert_count >= 1);
      } catch (e) {
        console.log(e);
        throw e;
      } finally {
        client.release();
      }
    }

    // adds upcoming concert to the database
    //  TODO: add genre, artists, etc.
    async update_concerts(concert_list: {
        concert_id: string;
        name: string;
        location: string;
        url: string;
        date: string;
        image: string;
        venue: string;
        genre: string;
        popularity_rank: number;
    }[]) {
        const client = await this.pool.connect();
        try {
            for (let concert of concert_list) {
                // check if concert already exists
                if (await this._check_concert(concert.concert_id)) {
                  console.log("concert already exists");
                }
                else {
                    const res = await client.query("INSERT INTO concert VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", 
                      [concert.concert_id, concert.name, concert.location, concert.image, concert.date, concert.url, concert.venue, concert.genre, concert.popularity_rank]);
                    console.log(concert);
                }

        }
              // const res = await client.query("INSERT INTO concerts VALUES ($1, $2, $3, $4) RETURNING *", [concertID, concertName, concertDate, concertLocation]);
              // console.log(res.rows);
        // return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }

    // for testing purposes
    async _delete_all_concerts() {
        const client = await this.pool.connect();
        try {
            const res = await client.query("DELETE FROM concert RETURNING *");
            console.log(res.rows);
            return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }


    // delete concerts with dates before the current
    async delete_old_concerts() {
        const client = await this.pool.connect();
        try {
            const res = await client.query("DELETE FROM concert WHERE CAST(concert_date AS DATE) < NOW() RETURNING *");
            // const res = await client.query("SELECT concert_date FROM concert");
            // const res = await client.query("DELETE FROM concert RETURNING *");
            console.log(res.rows);

            return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }
   
    async search_concert(concert_name: string) {
      const client = await this.pool.connect();
      try{
        const res = await client.query("SELECT * FROM concert WHERE concert_name ILIKE $1 LIMIT 8", [`%${concert_name}%`]);
        console.log(res.rows);
        return res.rows;
      }
      catch (e){
        console.log(e);
      }
      finally {
        client.release();
      }

    }

    async add_thread(threadID: number, threadName: string) {
        const client = await this.pool.connect();
        try {
            const res = await client.query("INSERT INTO thread VALUES ($1, $2) RETURNING *", [threadID, threadName]);
            console.log(res.rows);
            return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }

    async remove_thread(threadID: number) {
        const client = await this.pool.connect();
        try {
          // Currently this is not working because threadID is thread_id in the database
            const res = await client.query("DELETE FROM thread WHERE threadID = $1 RETURNING *", [threadID]);
            console.log(res.rows);
            return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }

    async add_user_to_concert(userID: string, concertID: string) {
        const client = await this.pool.connect();
        try {
            const res = await client.query("INSERT INTO user_concert VALUES ($1, $2) RETURNING *", [userID, concertID]);
            console.log(res.rows);
            return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }

    async remove_user_from_concert(userID: string, concertID: string) {
        const client = await this.pool.connect();
        try {
            const res = await client.query("DELETE FROM user_concert WHERE userID = $1 AND concertID = $2 RETURNING *", [userID, concertID]);
            console.log(res.rows);
            return res;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }

    // if user is attending concert then return 1, else return 0
    async is_user_attending_concert(userID: string, concertID: string) {
        const client = await this.pool.connect();
        try {
            const res = await client.query("SELECT COUNT(*) FROM user_concert WHERE user_id = $1 AND concert_id = $2", [userID, concertID]);
            console.log(res.rows);
            return res.rows[0].count;
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }

    // TODO: still needs alot work here
    async get_concerts(userID: string) {
        const client = await this.pool.connect();
        console.log(userID);
        try {
            // const favorite_artist = await client.query("SELECT favorite_artist FROM users WHERE user_id = $1", [userID]);
            // const res = await client.query("SELECT * FROM concert_artist WHERE artist_name = $1 LIMIT 8", [favorite_artist]);
            // let count = res.rows.length
            let count = 0;

            // if (count < 8) {
                let remaining = 8 - count;
                const res = await client.query("SELECT * FROM concert WHERE concert_id NOT IN (SELECT concert_id FROM concert_artist WHERE artist_name = $1) ORDER BY popularity_rank ASC LIMIT $2", ["favorite_artist", remaining]);
                // res.rows.push(res2.rows[0]);
                count++;
            // }

            // while (count < 8) {
            //     const res2 = await client.query("SELECT * FROM concert");
            //     res.rows.push(res2.rows[0]);
            //     count++;
            // }
            
            return {concerts: res.rows, success: true};
        } 
        catch (e) {
            console.log(e);
        } 
        finally {
            client.release();
        }
    }
}
