-- Migration: 001_add_metadata_columns_to_tasks
-- Description: Add metadata columns to tasks table for link recognition and metadata fetching
-- Created: 2024

-- Check and add url column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'url') THEN
        ALTER TABLE tasks ADD COLUMN url TEXT;
        RAISE NOTICE 'Added column: url';
    ELSE
        RAISE NOTICE 'Column already exists: url';
    END IF;
END $$;

-- Check and add title column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'title') THEN
        ALTER TABLE tasks ADD COLUMN title TEXT;
        RAISE NOTICE 'Added column: title';
    ELSE
        RAISE NOTICE 'Column already exists: title';
    END IF;
END $$;

-- Check and add site_name column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'site_name') THEN
        ALTER TABLE tasks ADD COLUMN site_name TEXT;
        RAISE NOTICE 'Added column: site_name';
    ELSE
        RAISE NOTICE 'Column already exists: site_name';
    END IF;
END $$;

-- Check and add image_url column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'image_url') THEN
        ALTER TABLE tasks ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added column: image_url';
    ELSE
        RAISE NOTICE 'Column already exists: image_url';
    END IF;
END $$;

-- Check and add domain column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'domain') THEN
        ALTER TABLE tasks ADD COLUMN domain TEXT;
        RAISE NOTICE 'Added column: domain';
    ELSE
        RAISE NOTICE 'Column already exists: domain';
    END IF;
END $$;

-- Check and add metadata_fetched column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'metadata_fetched') THEN
        ALTER TABLE tasks ADD COLUMN metadata_fetched BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added column: metadata_fetched';
    ELSE
        RAISE NOTICE 'Column already exists: metadata_fetched';
    END IF;
END $$;

-- Check and add created_at column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'created_at') THEN
        ALTER TABLE tasks ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added column: created_at';
    ELSE
        RAISE NOTICE 'Column already exists: created_at';
    END IF;
END $$;

-- Create index on url column for better performance
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'tasks' AND indexname = 'idx_tasks_url') THEN
        CREATE INDEX idx_tasks_url ON tasks(url) WHERE url IS NOT NULL;
        RAISE NOTICE 'Created index: idx_tasks_url';
    ELSE
        RAISE NOTICE 'Index already exists: idx_tasks_url';
    END IF;
END $$;

-- Create index on created_at column for better performance
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'tasks' AND indexname = 'idx_tasks_created_at') THEN
        CREATE INDEX idx_tasks_created_at ON tasks(created_at);
        RAISE NOTICE 'Created index: idx_tasks_created_at';
    ELSE
        RAISE NOTICE 'Index already exists: idx_tasks_created_at';
    END IF;
END $$;
