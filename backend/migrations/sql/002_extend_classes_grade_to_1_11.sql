-- Migration: 002_extend_classes_grade_to_1_11
-- Description: Allow grades 1-4 in classes table (extend from 5-11 to 1-11)
-- Created: 2025-02-19

-- Drop the old CHECK constraint (PostgreSQL default name for classes.grade)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'classes'::regclass
          AND conname = 'classes_grade_check'
          AND contype = 'c'
    ) THEN
        ALTER TABLE classes DROP CONSTRAINT classes_grade_check;
        RAISE NOTICE 'Dropped old constraint classes_grade_check (grade 5-11)';
    ELSE
        RAISE NOTICE 'Old constraint classes_grade_check not found (may already be migrated)';
    END IF;
END $$;

-- Add new CHECK constraint allowing grades 1-11
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'classes'::regclass
          AND conname = 'classes_grade_range_check'
          AND contype = 'c'
    ) THEN
        ALTER TABLE classes ADD CONSTRAINT classes_grade_range_check
            CHECK (grade >= 1 AND grade <= 11);
        RAISE NOTICE 'Added constraint classes_grade_range_check (grade 1-11)';
    ELSE
        RAISE NOTICE 'Constraint classes_grade_range_check already exists';
    END IF;
END $$;
