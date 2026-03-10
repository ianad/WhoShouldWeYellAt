insert into
public.issues (name)
values
('abortion'),
('drug prices'),
('climate change'),
('zoning'),
('taxes'),
('housing');

-- Committee-issue mappings (populated after running seed:committees)
-- These are inserted by scripts/seed-committee-issues.sql or manually after committees exist