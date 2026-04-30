-- Users table stores authentication and profile data.
-- Each user belongs to a role and can have permissions through role inheritance.
--
-- Production considerations:
-- - UUID v7 for time-sortable IDs
-- - citext for case-insensitive email comparison
-- - Soft-disable flags for account management
-- - Audit timestamps for security tracking
--
-- Security notes:
-- - Password hash uses bcrypt (cost factor 12)
-- - Email verification required before certain actions
-- - Last login tracking for security audits
-- - Account can be soft-disabled without deletion
CREATE TABLE IF NOT EXISTS auth.users (
    -- Unique identifier using UUID v7 (time-sortable for index efficiency)
    id uuid PRIMARY KEY DEFAULT uuid_generate_v7 () NOT NULL,
    -- User display name
    name varchar(100) NOT NULL,
    -- Email address using citext for case-insensitive comparison
    -- citext extension handles: user@example.com = USER@EXAMPLE.COM = User@Example.com
    email citext NOT NULL,
    -- Bcrypt password hash (cost factor 12)
    password_hash varchar(255) NOT NULL,
    -- Foreign key to roles table for RBAC
    role_id uuid REFERENCES auth.roles (id) ON DELETE SET NULL,
    -- Soft-disable flag for account management
    is_active boolean NOT NULL DEFAULT TRUE,
    -- Email verification status (default false, requires email verification flow)
    is_verified boolean NOT NULL DEFAULT FALSE,
    -- Audit timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    -- Security tracking
    last_login_at timestamptz,
    email_verified_at timestamptz,
    password_changed_at timestamptz,
    CONSTRAINT users_email_unique UNIQUE (email)
);

-- Unique index on email for fast lookups
-- citext ensures case-insensitive uniqueness (user@example.com = USER@EXAMPLE.COM)
CREATE UNIQUE INDEX idx_users_email ON auth.users USING btree (email);

-- Index on role_id for role-based queries
CREATE INDEX idx_users_role_id ON auth.users USING btree (role_id);

-- Index on is_active for filtering active/inactive users
CREATE INDEX idx_users_is_active ON auth.users USING btree (is_active);

-- Composite index for active users by role (common query pattern)
CREATE INDEX idx_users_active_role ON auth.users USING btree (is_active, role_id);

-- Index on created_at for chronological analysis
CREATE INDEX idx_users_created_at ON auth.users USING btree (created_at);

-- Index on last_login_at for inactivity analysis
CREATE INDEX idx_users_last_login ON auth.users USING btree (last_login_at);

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
CREATE TRIGGER users_update_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column ();

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts for authentication and authorization. Uses citext for case-insensitive email comparison.';

COMMENT ON COLUMN users.id IS 'UUID v7 identifier for the user';

COMMENT ON COLUMN users.name IS 'User display name';

COMMENT ON COLUMN users.email IS 'Email address using citext for case-insensitive comparison';

COMMENT ON COLUMN users.password_hash IS 'Bcrypt password hash (cost factor 12)';

COMMENT ON COLUMN users.role_id IS 'Foreign key to roles table for RBAC';

COMMENT ON COLUMN users.is_active IS 'Soft-disable flag for account management';

COMMENT ON COLUMN users.is_verified IS 'Email verification status';

COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created';

COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last modified';

COMMENT ON COLUMN users.last_login_at IS 'Timestamp of last successful login';

COMMENT ON COLUMN users.email_verified_at IS 'Timestamp when email was verified';

COMMENT ON COLUMN users.password_changed_at IS 'Timestamp when password was last changed';
