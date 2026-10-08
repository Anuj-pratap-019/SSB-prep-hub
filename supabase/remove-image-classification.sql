-- Remove classification fields so PPDT pictures remain unclassified.
alter table if exists public.ppdt_images
  drop column if exists category,
  drop column if exists tone,
  drop column if exists difficulty;

alter table if exists public.ppdt_attempts
  drop column if exists category,
  drop column if exists difficulty;
