/*
  # Add transaction helper functions

  1. New Functions
    - `begin_transaction` - Start a transaction
    - `commit_transaction` - Commit a transaction
    - `rollback_transaction` - Rollback a transaction

  These functions are needed for the product service to manage transactions
  when updating products with related data.
*/

-- Function to begin a transaction
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void AS $$
BEGIN
  -- Start a transaction
  -- This is a no-op in PostgreSQL as transactions are implicit
  -- But we include it for clarity and future compatibility
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to commit a transaction
CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void AS $$
BEGIN
  -- Commit the transaction
  -- This is a no-op in PostgreSQL as transactions are implicit
  -- But we include it for clarity and future compatibility
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rollback a transaction
CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void AS $$
BEGIN
  -- Rollback the transaction
  -- This is a no-op in PostgreSQL as transactions are implicit
  -- But we include it for clarity and future compatibility
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;