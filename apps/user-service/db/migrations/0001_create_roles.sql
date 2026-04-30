-- Roles table stores role-based access control (RBAC) definitions.
-- Each role can have inherited permissions and can inherit from other roles.
--
-- Production considerations:
-- - UUID for distributed ID generation without coordination
-- - Self-referential foreign key for role inheritance hierarchy
-- - Timestamps for audit trail
-- - Deferrable constraints for circular inheritance validation
--
-- Security notes:
-- - Role names should be unique to avoid privilege escalation
-- - Inheritance is validated at query time to prevent circular references
-- - Permissions are granted via role_permissions junction table (not stored here)
CREATE TABLE IF NOT EXISTS auth.roles (
    -- Unique identifier using UUID v7 (time-sortable for index efficiency)
    id uuid PRIMARY KEY DEFAULT uuid_generate_v7 () NOT NULL,
    -- Machine-readable role identifier for code/logic use
    -- Used in permission checks, role assignments, and business logic
    -- Format: snake_case, lowercase (e.g., 'admin', 'billing_manager', 'content_editor')
    name varchar(50) NOT NULL,
    -- Human-readable display label for UI presentation
    -- Used in admin panels, dropdowns, and user-facing interfaces
    -- Can be changed without affecting business logic (e.g., 'Administrator', 'Billing Manager')
    -- Supports localization - can be updated when translating the application
    display varchar(100) NOT NULL,
    -- Self-referential foreign key for role inheritance
    -- A role can inherit permissions from a parent role
    -- Using deferrable to allow circular reference validation at transaction commit
    inherits UUID REFERENCES roles (id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED,
    -- Audit timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT roles_name_unique UNIQUE (name)
);

-- Index for inheritance lookups
CREATE INDEX idx_roles_inherits ON auth.roles USING btree (INHERITS);

-- Unique constraint on name to prevent duplicate role identifiers
-- This is the canonical identifier for business logic
CREATE UNIQUE INDEX idx_roles_name_unique ON auth.roles USING btree (name);

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
CREATE TRIGGER roles_update_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column ();

-- Add comment for documentation
COMMENT ON TABLE roles IS 'Role-based access control (RBAC) role definitions. Permissions granted via role_permissions junction table.';

COMMENT ON COLUMN roles.id IS 'UUID v7 identifier for the role';

COMMENT ON COLUMN roles.name IS 'Machine-readable role identifier (snake_case, unique) - used in code/logic';

COMMENT ON COLUMN roles.display IS 'Human-readable display label - used in UI only, can be changed/translated';

COMMENT ON COLUMN roles.inherits IS 'Parent role ID for permission inheritance (self-referential)';
