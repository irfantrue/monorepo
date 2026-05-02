-- Seed data for users table
-- Test users with various administrative roles
--
-- Usage:
--   psql -d your_db -f db/seeds/users.sql
--
-- Note: Password hashes are placeholders - replace with real bcrypt hashes
-- Generate: go run -c 'bcrypt.GenerateFromPassword("password123", 12)'
-- Super admin user
INSERT INTO users (
    name,
    email,
    password_hash,
    role_id,
    is_active,
    is_verified)
VALUES (
    'Super Admin',
    'superadmin@example.com',
    '$2a$12$TKh8H1.PfQx37YgCxDfOuCV34r5B1Y6VtbxWYXi9K2QpZ1D7E3mFO',
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'super_admin'), TRUE, TRUE)
ON CONFLICT (email)
    DO UPDATE SET
        name = EXCLUDED.name,
        role_id = EXCLUDED.role_id,
        is_active = EXCLUDED.is_active,
        is_verified = EXCLUDED.is_verified,
        updated_at = now();

-- Admin user
INSERT INTO users (
    name,
    email,
    password_hash,
    role_id,
    is_active,
    is_verified)
VALUES (
    'Admin User',
    'admin@example.com',
    '$2a$12$TKh8H1.PfQx37YgCxDfOuCV34r5B1Y6VtbxWYXi9K2QpZ1D7E3mFO',
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'admin'), TRUE, TRUE)
ON CONFLICT (email)
    DO UPDATE SET
        name = EXCLUDED.name,
        role_id = EXCLUDED.role_id,
        is_active = EXCLUDED.is_active,
        is_verified = EXCLUDED.is_verified,
        updated_at = now();

-- User manager
INSERT INTO users (
    name,
    email,
    password_hash,
    role_id,
    is_active,
    is_verified)
VALUES (
    'User Manager',
    'manager@example.com',
    '$2a$12$TKh8H1.PfQx37YgCxDfOuCV34r5B1Y6VtbxWYXi9K2QpZ1D7E3mFO',
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'user_manager'), TRUE, TRUE)
ON CONFLICT (email)
    DO UPDATE SET
        name = EXCLUDED.name,
        role_id = EXCLUDED.role_id,
        is_active = EXCLUDED.is_active,
        is_verified = EXCLUDED.is_verified,
        updated_at = now();

-- Viewer (read-only user)
INSERT INTO users (
    name,
    email,
    password_hash,
    role_id,
    is_active,
    is_verified)
VALUES (
    'Viewer User',
    'viewer@example.com',
    '$2a$12$TKh8H1.PfQx37YgCxDfOuCV34r5B1Y6VtbxWYXi9K2QpZ1D7E3mFO',
    (
        SELECT
            id
        FROM
            roles
        WHERE
            name = 'viewer'), TRUE, TRUE)
ON CONFLICT (email)
    DO UPDATE SET
        name = EXCLUDED.name,
        role_id = EXCLUDED.role_id,
        is_active = EXCLUDED.is_active,
        is_verified = EXCLUDED.is_verified,
        updated_at = now();
