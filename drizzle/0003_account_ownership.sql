ALTER TABLE assignments ADD COLUMN owner_id TEXT;
--> statement-breakpoint
CREATE INDEX assignments_owner_created ON assignments (owner_id, created_at DESC, code DESC);
--> statement-breakpoint
ALTER TABLE attempts ADD COLUMN student_name TEXT;
