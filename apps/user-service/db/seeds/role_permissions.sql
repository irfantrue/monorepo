-- Seed data for role_permissions junction table
-- Assigns permissions to roles based on typical admin hierarchy
--
-- Usage:
--   psql -d your_db -f db/seeds/role_permissions.sql
-- =============================================================================
-- Super Admin - Full system access via wildcard
-- =============================================================================
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Super admin - full system access'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'super_admin'
    AND p.name = '*:*'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- =============================================================================
-- Admin - Full management of users, roles, and permissions
-- =============================================================================
-- Users management (full access)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Admin - user management'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'admin'
    AND p.resource = 'users'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- Roles management (full access)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Admin - role management'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'admin'
    AND p.resource = 'roles'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- Permissions management (full access)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Admin - permission management'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'admin'
    AND p.resource = 'permissions'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- =============================================================================
-- User Manager - Can only manage users
-- =============================================================================
-- Users management (full access)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'User manager - user management'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'user_manager'
    AND p.resource = 'users'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- =============================================================================
-- Viewer - Read-only access to everything
-- =============================================================================
-- Users (read only)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Viewer - view users'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'viewer'
    AND p.name = 'users:read'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- Roles (read only)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Viewer - view roles'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'viewer'
    AND p.name = 'roles:read'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;

-- Permissions (read only)
INSERT INTO role_permissions (
    role_id,
    permission_id,
    is_active,
    notes)
SELECT
    r.id,
    p.id,
    TRUE,
    'Viewer - view permissions'
FROM
    roles r,
    permissions p
WHERE
    r.name = 'viewer'
    AND p.name = 'permissions:read'
ON CONFLICT (role_id,
    permission_id)
    DO UPDATE SET
        is_active = TRUE;
