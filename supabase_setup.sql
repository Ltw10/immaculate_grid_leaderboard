-- Supabase table setup for Immaculate Grid Tracker
-- Run this SQL in your Supabase SQL Editor

-- Create the scores table
CREATE TABLE IF NOT EXISTS scores (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 900),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, date)
);

-- Create an index on name and date for faster queries
CREATE INDEX IF NOT EXISTS idx_scores_name_date ON scores(name, date);

-- Create an index on date for sorting
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read scores
CREATE POLICY "Allow public read access" ON scores
  FOR SELECT
  USING (true);

-- Create a policy that allows anyone to insert scores
CREATE POLICY "Allow public insert access" ON scores
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows anyone to update scores
CREATE POLICY "Allow public update access" ON scores
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create a policy that allows anyone to delete scores
CREATE POLICY "Allow public delete access" ON scores
  FOR DELETE
  USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

