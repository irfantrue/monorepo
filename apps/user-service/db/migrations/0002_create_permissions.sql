-- Permissions table stores granular action permissions for RBAC.
-- Each permission defines access to a resource with a specific action.
--
-- Production considerations:
-- - UUID v7 for time-sortable IDs
-- - Composite unique index on (resource, action) prevents duplicate permissions
-- - Boolean flag for soft-disable without deletion
-- - Timestamps for audit trail
--
-- Security notes:
-- - Permissions should be non-editable in production once assigned
-- - Consider using immutability patterns for audit compliance
-- - Inactive permissions remain in DB for audit history
CREATE TABLE IF NOT EXISTS auth.permissions (
    -- Unique identifier using UUID v7 (time-sortable for index efficiency)
    id uuid PRIMARY KEY DEFAULT uuid_generate_v7 () NOT NULL,
    -- Machine-readable permission identifier
    -- Format: dot-separated (e.g., 'users.read', 'billing.export', 'orders.delete')
    name varchar(100) NOT NULL,
    -- Resource being accessed (e.g., 'users', 'billing', 'reports')
    resource varchar(50) NOT NULL,
    -- Action being performed (e.g., 'read', 'write', 'delete', 'export')
    action varchar(50) NOT NULL,
    -- Human-readable description of this permission
    description varchar(255),
    -- Grouping category for UI organization (e.g., 'User Management', 'Billing')
    category varchar(50),
    -- Soft-disable flag: inactive permissions are ignored in permission checks
    is_active boolean NOT NULL DEFAULT TRUE,
    -- Audit timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT permissions_name_unique UNIQUE (name),
    CONSTRAINT permissions_resource_action_unique UNIQUE (resource, action)
);

-- Unique constraint on name for fast lookups and canonical reference
CREATE UNIQUE INDEX idx_permissions_name ON auth.permissions USING btree (name);

-- Composite unique index on resource + action pair
-- Ensures no duplicate (resource, action) combinations
CREATE UNIQUE INDEX idx_permissions_resource_action ON auth.permissions USING btree (resource, action);

-- Index on category for grouping/organization queries
CREATE INDEX idx_permissions_category ON auth.permissions USING btree (category);

-- Index on is_active for filtering active/inactive permissions
CREATE INDEX idx_permissions_is_active ON auth.permissions USING btree (is_active);

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column ()
    RETURNS TRIGGER
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on row changes
CREATE TRIGGER permissions_update_updated_at
    BEFORE UPDATE ON permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column ();

-- Add comments for documentation
COMMENT ON TABLE permissions IS 'Granular permissions for RBAC. Defines access to resources with specific actions.';

COMMENT ON COLUMN permissions.id IS 'UUID v7 identifier for the permission';

COMMENT ON COLUMN permissions.name IS 'Machine-readable permission identifier (dot-separated, unique)';

COMMENT ON COLUMN permissions.resource IS 'Resource being accessed (e.g., users, billing)';

COMMENT ON COLUMN permissions.action IS 'Action being performed (e.g., read, write, delete)';

COMMENT ON COLUMN permissions.description IS 'Human-readable description of the permission';

COMMENT ON COLUMN permissions.category IS 'Grouping category for UI organization';

COMMENT ON COLUMN permissions.is_active IS 'Soft-disable flag: inactive permissions are ignored in permission checks';

COMMENT ON COLUMN permissions.created_at IS 'Timestamp when the permission was created';

COMMENT ON COLUMN permissions.updated_at IS 'Timestamp when the permission was last modified';
