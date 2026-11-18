CREATE TABLE assignments (
  code TEXT PRIMARY KEY NOT NULL,
  class_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE attempts (
  assignment_code TEXT NOT NULL REFERENCES assignments(code),
  student_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (assignment_code, student_id)
);
