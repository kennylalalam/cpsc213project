-- Load up pycrypto so that we can do password hashing
DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE
        CHECK ( email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' ),
    password_hash VARCHAR(100) NOT NULL,
    location VARCHAR(50),
    DOB date NOT NULL
);

-- Define a function that turns a users row
-- email column to lowercase.
CREATE OR REPLACE function clean_user_fields() returns trigger as $$
BEGIN
    NEW.email := lower(NEW.email);
    return NEW;
END;
$$ language plpgsql;

-- This is a "trigger" and it is tiggered prior
-- to and insert or update on the users. It ensures
-- that the email field is stored as lowercase by
-- calling the clean_user_fields() function.
DROP TRIGGER IF EXISTS tg_users_default ON "users";
CREATE TRIGGER tg_users_default
    BEFORE INSERT OR UPDATE
    ON "users"
    FOR EACH ROW
EXECUTE PROCEDURE clean_user_fields();

-- Table of tasks
DROP TABLE IF EXISTS offers CASCADE;
CREATE TABLE IF NOT EXISTS offers (
    -- An auto-incrementing primary key
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- Title of the job
    title VARCHAR(50) NOT NULL
        CHECK (char_length(title) >= 1),
    -- payout of the task
    payout INT NOT NULL,
    -- The criteria of the task
    criteria VARCHAR(5000) NOT NULL,
    -- Time and date
    datetime timestamp NOT NULL,
    -- Location
    location VARCHAR(50) NOT NULL
);

-- Table of transactions
DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE IF NOT EXISTS transactions (
    -- The id of a transaction
    txn_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- The payee of a task
    payee_id INT NOT NULL,
    -- recipient
    recipient_id INT NOT NULL,
    amount INT NOT NULL
);
