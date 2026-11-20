CREATE TABLE rooms (
 code TEXT PRIMARY KEY NOT NULL,
 class_name TEXT NOT NULL,
 owner_id TEXT NOT NULL,
 UNIQUE(owner_id,class_name)
);
--> statement-breakpoint
INSERT INTO rooms(code,class_name,owner_id) SELECT upper(hex(randomblob(4))),class_name,owner_id FROM assignments WHERE owner_id IS NOT NULL GROUP BY class_name,owner_id;
--> statement-breakpoint
ALTER TABLE assignments ADD COLUMN room_code TEXT;
--> statement-breakpoint
UPDATE assignments SET room_code=(SELECT code FROM rooms r WHERE r.owner_id=assignments.owner_id AND r.class_name=assignments.class_name);
--> statement-breakpoint
ALTER TABLE assignments ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE assignments ADD COLUMN allow_late INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
CREATE TABLE members(
 room_code TEXT NOT NULL REFERENCES rooms(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 student_name TEXT NOT NULL,
 joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(room_code,student_id)
);
--> statement-breakpoint
CREATE TABLE notebooks(
 assignment_code TEXT NOT NULL REFERENCES assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 cells TEXT NOT NULL DEFAULT '{}',
 feedback TEXT NOT NULL DEFAULT '',
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(assignment_code,student_id)
);
--> statement-breakpoint
CREATE TABLE attempt_history(
 id TEXT PRIMARY KEY NOT NULL,
 assignment_code TEXT NOT NULL REFERENCES assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 answers TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint

CREATE TABLE demo_rooms (
 code TEXT PRIMARY KEY NOT NULL,
 class_name TEXT NOT NULL,
 owner_id TEXT NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
 UNIQUE(owner_id,class_name)
);
--> statement-breakpoint
INSERT INTO demo_rooms(code,class_name,owner_id) SELECT upper(hex(randomblob(4))),class_name,owner_id FROM demo_assignments WHERE owner_id IS NOT NULL GROUP BY class_name,owner_id;
--> statement-breakpoint
ALTER TABLE demo_assignments ADD COLUMN room_code TEXT;
--> statement-breakpoint
UPDATE demo_assignments SET room_code=(SELECT code FROM demo_rooms r WHERE r.owner_id=demo_assignments.owner_id AND r.class_name=demo_assignments.class_name);
--> statement-breakpoint
ALTER TABLE demo_assignments ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE demo_assignments ADD COLUMN allow_late INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
CREATE TABLE demo_members(
 room_code TEXT NOT NULL REFERENCES demo_rooms(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 student_name TEXT NOT NULL,
 joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(room_code,student_id)
);
--> statement-breakpoint
CREATE TABLE demo_notebooks(
 assignment_code TEXT NOT NULL REFERENCES demo_assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 cells TEXT NOT NULL DEFAULT '{}',
 feedback TEXT NOT NULL DEFAULT '',
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(assignment_code,student_id)
);
--> statement-breakpoint
CREATE TABLE demo_attempt_history(
 id TEXT PRIMARY KEY NOT NULL,
 assignment_code TEXT NOT NULL REFERENCES demo_assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 answers TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO members(room_code,student_id,student_name)
SELECT a.room_code,t.student_id,COALESCE(t.student_name,t.student_id) FROM attempts t
JOIN assignments a ON a.code=t.assignment_code WHERE a.room_code IS NOT NULL
ON CONFLICT(room_code,student_id) DO NOTHING;
--> statement-breakpoint
INSERT INTO demo_members(room_code,student_id,student_name)
SELECT a.room_code,t.student_id,COALESCE(t.student_name,t.student_id) FROM demo_attempts t
JOIN demo_assignments a ON a.code=t.assignment_code WHERE a.room_code IS NOT NULL
ON CONFLICT(room_code,student_id) DO NOTHING;
--> statement-breakpoint
CREATE TABLE teacher_requests(
 user_id TEXT PRIMARY KEY NOT NULL,
 email TEXT NOT NULL,
 display_name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
