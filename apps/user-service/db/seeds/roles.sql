-- Seed data for roles table
-- Core administrative roles for managing the application
--
-- Usage:
--   psql -d your_db -f db/seeds/roles.sql
-- Super administrator (full access via wildcard permission)
INSERT INTO roles (
    name,
    display)
VALUES (
    'super_admin',
    'Super Administrator')
ON CONFLICT (
    name)
    DO UPDATE SET
        display = EXCLUDED.display,
        updated_at = now();

-- Admin (full management of users, roles, permissions)
INSERT INTO roles (
    name,
    display)
VALUES (
    'admin',
    'Administrator')
ON CONFLICT (
    name)
    DO UPDATE SET
        display = EXCLUDED.display,
        updated_at = now();

-- User manager (can manage users only)
INSERT INTO roles (
    name,
    display)
VALUES (
    'user_manager',
    'User Manager')
ON CONFLICT (
    name)
    DO UPDATE SET
        display = EXCLUDED.display,
        updated_at = now();

-- Viewer (read-only access)
INSERT INTO roles (
    name,
    display)
VALUES (
    'viewer',
    'Viewer')
ON CONFLICT (
    name)
    DO UPDATE SET
        display = EXCLUDED.display,
        updated_at = now();
