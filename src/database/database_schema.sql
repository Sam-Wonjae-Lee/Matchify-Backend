DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS fav_playlist_song CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS friends CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS friend_request CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

DROP TABLE IF EXISTS user_concert CASCADE;
DROP TABLE IF EXISTS concert CASCADE;
DROP TABLE IF EXISTS concert_artist CASCADE;

DROP TABLE IF EXISTS message CASCADE;
DROP TABLE IF EXISTS thread CASCADE;
DROP TABLE IF EXISTS user_thread CASCADE;

DROP TABLE IF EXISTS tokens CASCADE;

--please check favourite song and spotify for users--
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    location TEXT NOT NULL,
    dob DATE NOT NULL,
    bio TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT NOT NULL,
    profile_pic TEXT NOT NULL,
    favourite_playlist TEXT NOT NULL
);

--please check favourite song and spotify for users--
CREATE TABLE fav_playlist_song (
    playlist_id TEXT NOT NULL,
    song_id TEXT NOT NULL,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES users(user_id)
);

--please check favourite song and spotify for users--
CREATE TABLE songs (
    song_id TEXT PRIMARY KEY,
    song_name TEXT NOT NULL,
    song_pic TEXT NOT NULL,
    artist TEXT NOT NULL,
    danceability FLOAT NOT NULL,
    acousticness FLOAT NOT NULL,
    energy FLOAT NOT NULL,
    instrumentalness FLOAT NOT NULL,
    liveness FLOAT NOT NULL,
    loudness FLOAT NOT NULL,
    speechiness FLOAT NOT NULL,
    tempo FLOAT NOT NULL,
    valence FLOAT NOT NULL
);

-- very good --
CREATE TABLE friends (
    user1 TEXT NOT NULL,
    user2 TEXT NOT NULL,
    PRIMARY KEY (user1, user2),
    FOREIGN KEY (user1) REFERENCES users(user_id),
    FOREIGN KEY (user2) REFERENCES users(user_id)
);

-- very good block --
CREATE TABLE blocks (
    blocker TEXT NOT NULL,
    blocked TEXT NOT NULL,
    PRIMARY KEY (blocker, blocked),
    FOREIGN KEY (blocker) REFERENCES users(user_id),
    FOREIGN KEY (blocked) REFERENCES users(user_id)
);

-- confused? should we have check here? --
CREATE TABLE friend_request (
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL,
    PRIMARY KEY (sender, receiver),
    FOREIGN KEY (sender) REFERENCES users(user_id),
    FOREIGN KEY (receiver) REFERENCES users(user_id)
);

--please check options for settings--
CREATE TABLE settings (
    user_id TEXT PRIMARY KEY,
    options TEXT NOT NULL,
    dark_mode BOOLEAN NOT NULL,
    friend_message BOOLEAN NOT NULL,
    friend_visibility BOOLEAN NOT NULL,
    friend_request BOOLEAN NOT NULL,
    playlist_update BOOLEAN NOT NULL,
    new_events BOOLEAN NOT NULL,
    event_reminder BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE concert (
    concert_id TEXT PRIMARY KEY,
    concert_name TEXT NOT NULL,
    concert_location TEXT NOT NULL,
    concert_image TEXT NOT NULL,
    concert_date TEXT NOT NULL,
    link TEXT NOT NULL,
    venue TEXT NOT NULL,
    genre TEXT NOT NULL,
    -- concert_month TEXT NOT NULL,
    popularity_rank INT NOT NULL
);

CREATE TABLE user_concert (
    user_id TEXT NOT NULL,
    concert_id TEXT NOT NULL,
    PRIMARY KEY (user_id, concert_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (concert_id) REFERENCES concert(concert_id)
);

CREATE TABLE concert_artist (
    concert_id TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    PRIMARY KEY (concert_id, artist_name),
    FOREIGN KEY (concert_id) REFERENCES concert(concert_id)
);




-- messaging tables --
CREATE TABLE thread (
    thread_id SERIAL PRIMARY KEY,
    thread_name TEXT NOT NULL
);

CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    thread_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (thread_id) REFERENCES thread(thread_id)
);

CREATE TABLE user_thread (
    user_id TEXT NOT NULL,
    thread_id INT NOT NULL,
    PRIMARY KEY (user_id, thread_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (thread_id) REFERENCES thread(thread_id)
);

CREATE TABLE tokens (
    user_id TEXT PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);