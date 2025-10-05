-- Rollback Migration: 001_add_metadata_columns_to_tasks
-- Description: Remove metadata columns from tasks table
-- WARNING: This will permanently delete all metadata for tasks!

-- Drop indexes first
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'tasks' AND indexname = 'idx_tasks_created_at') THEN
        DROP INDEX idx_tasks_created_at;
        RAISE NOTICE 'Dropped index: idx_tasks_created_at';
    ELSE
        RAISE NOTICE 'Index does not exist: idx_tasks_created_at';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'tasks' AND indexname = 'idx_tasks_url') THEN
        DROP INDEX idx_tasks_url;
        RAISE NOTICE 'Dropped index: idx_tasks_url';
    ELSE
        RAISE NOTICE 'Index does not exist: idx_tasks_url';
    END IF;
END $$;

-- Drop columns
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'created_at') THEN
        ALTER TABLE tasks DROP COLUMN created_at;
        RAISE NOTICE 'Dropped column: created_at';
    ELSE
        RAISE NOTICE 'Column does not exist: created_at';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'metadata_fetched') THEN
        ALTER TABLE tasks DROP COLUMN metadata_fetched;
        RAISE NOTICE 'Dropped column: metadata_fetched';
    ELSE
        RAISE NOTICE 'Column does not exist: metadata_fetched';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'domain') THEN
        ALTER TABLE tasks DROP COLUMN domain;
        RAISE NOTICE 'Dropped column: domain';
    ELSE
        RAISE NOTICE 'Column does not exist: domain';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'image_url') THEN
        ALTER TABLE tasks DROP COLUMN image_url;
        RAISE NOTICE 'Dropped column: image_url';
    ELSE
        RAISE NOTICE 'Column does not exist: image_url';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'site_name') THEN
        ALTER TABLE tasks DROP COLUMN site_name;
        RAISE NOTICE 'Dropped column: site_name';
    ELSE
        RAISE NOTICE 'Column does not exist: site_name';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'title') THEN
        ALTER TABLE tasks DROP COLUMN title;
        RAISE NOTICE 'Dropped column: title';
    ELSE
        RAISE NOTICE 'Column does not exist: title';
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'url') THEN
        ALTER TABLE tasks DROP COLUMN url;
        RAISE NOTICE 'Dropped column: url';
    ELSE
        RAISE NOTICE 'Column does not exist: url';
    END IF;
END $$;
