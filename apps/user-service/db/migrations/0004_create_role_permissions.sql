-- Role permissions junction table for RBAC.
-- Links roles to their granted permissions with audit trail.
--
-- Production considerations:
-- - Composite primary key prevents duplicate role-permission pairs
-- - CASCADE on role/permission FKs for cleanup
-- - Partial index on active permissions for performance
-- - Audit trail: granted_by, granted_at, notes
CREATE TABLE IF NOT EXISTS auth.role_permissions (
    -- Foreign key to roles table
    role_id uuid NOT NULL REFERENCES auth.roles (id) ON DELETE CASCADE,
    -- Foreign key to permissions table
    permission_id uuid NOT NULL REFERENCES auth.permissions (id) ON DELETE CASCADE,
    -- User who granted this permission (audit trail)
    granted_by uuid NOT NULL REFERENCES auth.users (id) ON DELETE SET NULL,
    -- When the permission was granted
    granted_at timestamptz NOT NULL DEFAULT now(),
    -- Soft-disable flag for temporary permission revocation
    is_active boolean NOT NULL DEFAULT TRUE,
    -- Optional notes explaining why permission was granted/revoked
    notes varchar(500),
    -- Composite primary key prevents duplicate role-permission pairs
    CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id)
);

-- Index on granted_by for audit queries and cleanup
CREATE INDEX idx_role_permissions_granted_by ON auth.role_permissions USING btree (granted_by);

-- Partial index for active permissions only
-- Optimizes queries filtering only active role-permission assignments
CREATE INDEX idx_role_permissions_active ON auth.role_permissions USING btree (role_id, permission_id)
WHERE
    is_active = TRUE;

-- Add comments for documentation
COMMENT ON TABLE role_permissions IS 'Junction table linking roles to permissions. Composite PK prevents duplicates.';

COMMENT ON COLUMN role_permissions.role_id IS 'Foreign key to roles table';

COMMENT ON COLUMN role_permissions.permission_id IS 'Foreign key to permissions table';

COMMENT ON COLUMN role_permissions.granted_by IS 'User who granted this permission (audit trail)';

COMMENT ON COLUMN role_permissions.granted_at IS 'When the permission was granted';

COMMENT ON COLUMN role_permissions.is_active IS 'Soft-disable flag for temporary permission revocation';

COMMENT ON COLUMN role_permissions.notes IS 'Optional notes explaining permission grant/revocation';
