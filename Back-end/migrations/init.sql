-- Create portfolio database schema for projects, skills, and contact submissions.

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  category TEXT,
  live_url TEXT,
  repo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  items TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO skills (category, items) VALUES
  ('Frontend', ARRAY['HTML', 'CSS', 'JavaScript', 'React'])
ON CONFLICT DO NOTHING;

INSERT INTO skills (category, items) VALUES
  ('Backend', ARRAY['Node.js', 'Express', 'PostgreSQL'])
ON CONFLICT DO NOTHING;

INSERT INTO skills (category, items) VALUES
  ('Tools', ARRAY['Git', 'VS Code', 'Figma'])
ON CONFLICT DO NOTHING;
