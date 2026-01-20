-- Make business_number column nullable in companies table
-- This allows companies to be created without a business number

ALTER TABLE companies 
ALTER COLUMN business_number DROP NOT NULL;

-- Also drop the unique constraint if it exists and recreate it to allow multiple NULL values
-- PostgreSQL allows multiple NULL values in a unique column
-- But if there's a unique constraint, we need to handle it properly

-- First, drop the existing unique constraint if it exists
ALTER TABLE companies 
DROP CONSTRAINT IF EXISTS companies_business_number_key;

-- Recreate the unique constraint with a partial index that excludes NULL values
-- This allows multiple NULL values while maintaining uniqueness for non-NULL values
CREATE UNIQUE INDEX companies_business_number_unique 
ON companies (business_number) 
WHERE business_number IS NOT NULL;
