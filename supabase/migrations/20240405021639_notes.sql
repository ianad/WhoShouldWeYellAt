create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('I have an idea for a website'),
  ('Tell me what you think'),
  ('WhoShouldIYellAt.com'),
  ('Put in your zip code and issue you''re mad about - taxes, abortion, zoning reform'),
  ('You get back - a list of elected officials with that issue under their purview in some way');