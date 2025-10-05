-- Migration Template
-- Copy this file and rename it to: XXX_your_migration_name.sql
-- Replace XXX with the next sequential number (e.g., 002, 003, etc.)

-- Migration: XXX_your_migration_name
-- Description: Brief description of what this migration does
-- Created: YYYY-MM-DD

-- Example: Add a new column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'your_table' AND column_name = 'your_column') THEN
        ALTER TABLE your_table ADD COLUMN your_column TEXT;
        RAISE NOTICE 'Added column: your_column';
    ELSE
        RAISE NOTICE 'Column already exists: your_column';
    END IF;
END $$;

-- Example: Create an index
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'your_table' AND indexname = 'idx_your_table_your_column') THEN
        CREATE INDEX idx_your_table_your_column ON your_table(your_column);
        RAISE NOTICE 'Created index: idx_your_table_your_column';
    ELSE
        RAISE NOTICE 'Index already exists: idx_your_table_your_column';
    END IF;
END $$;

-- Example: Insert default data
INSERT INTO your_table (column1, column2) 
SELECT 'value1', 'value2'
WHERE NOT EXISTS (SELECT 1 FROM your_table WHERE column1 = 'value1');

-- Example: Update existing data
UPDATE your_table 
SET column1 = 'new_value' 
WHERE column1 = 'old_value';

-- Example: Create a new table
CREATE TABLE IF NOT EXISTS your_new_table (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: Add foreign key constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_your_table_other_table'
    ) THEN
        ALTER TABLE your_table ADD CONSTRAINT fk_your_table_other_table 
        FOREIGN KEY (other_table_id) REFERENCES other_table(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint: fk_your_table_other_table';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists: fk_your_table_other_table';
    END IF;
END $$;
