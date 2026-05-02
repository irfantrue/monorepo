-- Seed data for permissions table
-- Core administrative permissions for managing the application
--
-- Usage:
--   psql -d your_db -f db/seeds/permissions.sql
-- User management permissions
INSERT INTO permissions (
    name,
    resource,
    action,
    description,
    category,
    is_active)
VALUES
    (
        'users:read',
        'users',
        'read',
        'Can view user list and profiles',
        'users',
        TRUE),
    (
        'users:write',
        'users',
        'write',
        'Can create and update users',
        'users',
        TRUE),
    (
        'users:delete',
        'users',
        'delete',
        'Can delete users',
        'users',
        TRUE)
ON CONFLICT (
    name)
    DO NOTHING;

-- Role management permissions
INSERT INTO permissions (
    name,
    resource,
    action,
    description,
    category,
    is_active)
VALUES
    (
        'roles:read',
        'roles',
        'read',
        'Can view roles and permissions',
        'roles',
        TRUE),
    (
        'roles:write',
        'roles',
        'write',
        'Can create and update roles',
        'roles',
        TRUE),
    (
        'roles:delete',
        'roles',
        'delete',
        'Can delete roles',
        'roles',
        TRUE)
ON CONFLICT (
    name)
    DO NOTHING;

-- Permission management permissions
INSERT INTO permissions (
    name,
    resource,
    action,
    description,
    category,
    is_active)
VALUES
    (
        'permissions:read',
        'permissions',
        'read',
        'Can view permissions',
        'permissions',
        TRUE),
    (
        'permissions:write',
        'permissions',
        'write',
        'Can create and update permissions',
        'permissions',
        TRUE)
ON CONFLICT (
    name)
    DO NOTHING;

-- Wildcard permission for super admin (full system access)
INSERT INTO permissions (
    name,
    resource,
    action,
    description,
    category,
    is_active)
VALUES (
    '*:*',
    '*',
    '*',
    'Full system access (super admin)',
    'system',
    TRUE)
ON CONFLICT (
    name)
    DO NOTHING;
