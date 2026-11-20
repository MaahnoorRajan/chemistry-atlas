CREATE TABLE demo_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  expires_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX demo_sessions_expiry ON demo_sessions (expires_at);
--> statement-breakpoint
CREATE TABLE demo_assignments (
  code TEXT PRIMARY KEY NOT NULL,
  class_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  quiz_open INTEGER NOT NULL DEFAULT 1,
  video_id TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
  due_date TEXT
);
--> statement-breakpoint
CREATE INDEX demo_assignments_owner ON demo_assignments (owner_id, created_at DESC, code DESC);
--> statement-breakpoint
CREATE TABLE demo_attempts (
  assignment_code TEXT NOT NULL REFERENCES demo_assignments(code) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  student_name TEXT,
  PRIMARY KEY (assignment_code, student_id)
);
