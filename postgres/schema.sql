CREATE SCHEMA IF NOT EXISTS chemistry_atlas;
REVOKE ALL ON SCHEMA chemistry_atlas FROM PUBLIC, anon, authenticated;
SET search_path=chemistry_atlas,public;
CREATE TABLE assignments (
  code TEXT PRIMARY KEY NOT NULL,
  class_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')
);

CREATE TABLE attempts (
  assignment_code TEXT NOT NULL REFERENCES assignments(code),
  student_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
  PRIMARY KEY (assignment_code, student_id)
);

ALTER TABLE assignments ADD COLUMN quiz_open INTEGER NOT NULL DEFAULT 1;

ALTER TABLE assignments ADD COLUMN video_id TEXT NOT NULL DEFAULT 'jNfgGh-aL2g';

ALTER TABLE assignments ADD COLUMN owner_id TEXT;

CREATE INDEX assignments_owner_created ON assignments (owner_id, created_at DESC, code DESC);

ALTER TABLE attempts ADD COLUMN student_name TEXT;

ALTER TABLE assignments ADD COLUMN due_date TEXT;

CREATE TABLE demo_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX demo_sessions_expiry ON demo_sessions (expires_at);

CREATE TABLE demo_assignments (
  code TEXT PRIMARY KEY NOT NULL,
  class_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
  quiz_open INTEGER NOT NULL DEFAULT 1,
  video_id TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
  due_date TEXT
);

CREATE INDEX demo_assignments_owner ON demo_assignments (owner_id, created_at DESC, code DESC);

CREATE TABLE demo_attempts (
  assignment_code TEXT NOT NULL REFERENCES demo_assignments(code) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
  student_name TEXT,
  PRIMARY KEY (assignment_code, student_id)
);

CREATE TABLE rooms (
 code TEXT PRIMARY KEY NOT NULL,
 class_name TEXT NOT NULL,
 owner_id TEXT NOT NULL,
 UNIQUE(owner_id,class_name)
);

INSERT INTO rooms(code,class_name,owner_id) SELECT upper(substr(md5(random()::text),1,8)),class_name,owner_id FROM assignments WHERE owner_id IS NOT NULL GROUP BY class_name,owner_id;

ALTER TABLE assignments ADD COLUMN room_code TEXT;

UPDATE assignments SET room_code=(SELECT code FROM rooms r WHERE r.owner_id=assignments.owner_id AND r.class_name=assignments.class_name);

ALTER TABLE assignments ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;

ALTER TABLE assignments ADD COLUMN allow_late INTEGER NOT NULL DEFAULT 1;

CREATE TABLE members(
 room_code TEXT NOT NULL REFERENCES rooms(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 student_name TEXT NOT NULL,
 joined_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
 PRIMARY KEY(room_code,student_id)
);

CREATE TABLE notebooks(
 assignment_code TEXT NOT NULL REFERENCES assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 cells TEXT NOT NULL DEFAULT '{}',
 feedback TEXT NOT NULL DEFAULT '',
 updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
 PRIMARY KEY(assignment_code,student_id)
);

CREATE TABLE attempt_history(
 id TEXT PRIMARY KEY NOT NULL,
 assignment_code TEXT NOT NULL REFERENCES assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 answers TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')
);


CREATE TABLE demo_rooms (
 code TEXT PRIMARY KEY NOT NULL,
 class_name TEXT NOT NULL,
 owner_id TEXT NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
 UNIQUE(owner_id,class_name)
);

INSERT INTO demo_rooms(code,class_name,owner_id) SELECT upper(substr(md5(random()::text),1,8)),class_name,owner_id FROM demo_assignments WHERE owner_id IS NOT NULL GROUP BY class_name,owner_id;

ALTER TABLE demo_assignments ADD COLUMN room_code TEXT;

UPDATE demo_assignments SET room_code=(SELECT code FROM demo_rooms r WHERE r.owner_id=demo_assignments.owner_id AND r.class_name=demo_assignments.class_name);

ALTER TABLE demo_assignments ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;

ALTER TABLE demo_assignments ADD COLUMN allow_late INTEGER NOT NULL DEFAULT 1;

CREATE TABLE demo_members(
 room_code TEXT NOT NULL REFERENCES demo_rooms(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 student_name TEXT NOT NULL,
 joined_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
 PRIMARY KEY(room_code,student_id)
);

CREATE TABLE demo_notebooks(
 assignment_code TEXT NOT NULL REFERENCES demo_assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 cells TEXT NOT NULL DEFAULT '{}',
 feedback TEXT NOT NULL DEFAULT '',
 updated_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS'),
 PRIMARY KEY(assignment_code,student_id)
);

CREATE TABLE demo_attempt_history(
 id TEXT PRIMARY KEY NOT NULL,
 assignment_code TEXT NOT NULL REFERENCES demo_assignments(code) ON DELETE CASCADE,
 student_id TEXT NOT NULL,
 answers TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')
);

INSERT INTO members(room_code,student_id,student_name)
SELECT a.room_code,t.student_id,COALESCE(t.student_name,t.student_id) FROM attempts t
JOIN assignments a ON a.code=t.assignment_code WHERE a.room_code IS NOT NULL
ON CONFLICT(room_code,student_id) DO NOTHING;

INSERT INTO demo_members(room_code,student_id,student_name)
SELECT a.room_code,t.student_id,COALESCE(t.student_name,t.student_id) FROM demo_attempts t
JOIN demo_assignments a ON a.code=t.assignment_code WHERE a.room_code IS NOT NULL
ON CONFLICT(room_code,student_id) DO NOTHING;

CREATE TABLE teacher_requests(
 user_id TEXT PRIMARY KEY NOT NULL,
 email TEXT NOT NULL,
 display_name TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS')
);
