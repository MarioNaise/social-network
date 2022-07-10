DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;

   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       first VARCHAR NOT NULL CHECK (first != ''),
       last VARCHAR NOT NULL CHECK (last != ''),
       email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
       password VARCHAR NOT NULL CHECK (password != '')
   );

CREATE TABLE reset_codes (
       id SERIAL PRIMARY KEY,
       email VARCHAR NOT NULL CHECK (email != ''),
       code VARCHAR NOT NULL CHECK (code != ''),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );