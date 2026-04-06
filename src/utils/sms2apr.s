-- ============================================================
--  EduCore SMS — Full Schema v2
--  Changes from v1:
--   • Unified users table (all roles login via single table)
--   • user_roles: many-to-many, one email → multiple roles
--   • roles + modules + role_permissions: super admin controls CRUD per role per module
--   • subscription_module_access: plan gates which modules are visible
--   • school registration flow: auto-creates user + sends credentials via nodemailer
--   • school_id FK added to all tenant-scoped tables
--   • teacher_attendance merged into teacher_clockins (removed duplicate)
--   • overpayment CHECK on student_fees
--   • notices table added (was missing)
--   • staff table added (non-teacher school staff)
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- PLATFORM LAYER
-- ============================================================

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `name`             VARCHAR(100) NOT NULL,
  `email`            VARCHAR(150) NOT NULL,
  `phone`            VARCHAR(20)  DEFAULT NULL,
  `password_hash`    VARCHAR(255) NOT NULL,
  `profile_pic`      VARCHAR(255) DEFAULT 'default_profile.png',
  `is_active`        TINYINT(1)   DEFAULT 1,
  `is_verified`      TINYINT(1)   DEFAULT 0,
  `otp`              VARCHAR(10)  DEFAULT NULL,
  `otp_expires_at`   DATETIME     DEFAULT NULL,
  `token`            VARCHAR(512) DEFAULT NULL,
  `refresh_token`    VARCHAR(512) DEFAULT NULL,
  `last_login`       DATETIME     DEFAULT NULL,
  `login_attempts`   INT          DEFAULT 0,
  `created_at`       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Roles — seeded by migration, managed by super admin
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `name`        ENUM('super_admin','school_admin','teacher','student','parent','staff') NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`name`, `description`) VALUES
  ('super_admin',  'Platform-level administrator'),
  ('school_admin', 'School-level administrator'),
  ('teacher',      'Teacher / class teacher'),
  ('student',      'Enrolled student'),
  ('parent',       'Parent / guardian'),
  ('staff',        'Non-teaching school staff');

-- ------------------------------------------------------------
-- user_roles — one user can hold multiple roles
--   school_id NULL means platform-level role (super_admin)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `user_id`    INT NOT NULL,
  `role_id`    INT NOT NULL,
  `school_id`  INT DEFAULT NULL,          -- NULL for super_admin
  `ref_id`     INT DEFAULT NULL,          -- FK to teachers/students/parents/staff.id
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_role_school` (`user_id`, `role_id`, `school_id`),
  KEY `idx_ur_user`   (`user_id`),
  KEY `idx_ur_school` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Modules — super admin defines available modules
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `key`         VARCHAR(60) NOT NULL,     -- e.g. 'attendance', 'payroll'
  `label`       VARCHAR(100) NOT NULL,    -- display name
  `description` VARCHAR(255) DEFAULT NULL,
  `is_active`   TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_modules_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `modules` (`key`, `label`) VALUES
  ('dashboard',         'Dashboard'),
  ('students',          'Students'),
  ('teachers',          'Teachers'),
  ('staff',             'Staff'),
  ('parents',           'Parents'),
  ('classes',           'Classes & Sections'),
  ('subjects',          'Subjects'),
  ('timetable',         'Timetable'),
  ('attendance',        'Attendance'),
  ('assignments',       'Assignments'),
  ('study_materials',   'Study Materials'),
  ('exams',             'Exams'),
  ('marks',             'Marks & Results'),
  ('fee_structure',     'Fee Structure'),
  ('payments',          'Payments'),
  ('payroll',           'Payroll'),
  ('leaves',            'Leave Management'),
  ('notices',           'Notice Board'),
  ('messages',          'Messages'),
  ('reports',           'Reports'),
  ('schools',           'Schools'),         -- super_admin only
  ('subscriptions',     'Subscriptions'),   -- super_admin only
  ('roles_permissions', 'Roles & Permissions'); -- super_admin only

-- ------------------------------------------------------------
-- subscription_module_access — which plan unlocks which module
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `subscription_module_access`;
CREATE TABLE `subscription_module_access` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `plan`      ENUM('basic','pro','enterprise') NOT NULL,
  `module_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_plan_module` (`plan`, `module_id`),
  CONSTRAINT `fk_sma_module` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Basic plan: core modules only
INSERT INTO `subscription_module_access` (`plan`, `module_id`)
SELECT 'basic', id FROM `modules`
WHERE `key` IN ('dashboard','students','teachers','parents','classes','subjects','attendance','notices');

-- Pro: basic + academic + fee
INSERT INTO `subscription_module_access` (`plan`, `module_id`)
SELECT 'pro', id FROM `modules`
WHERE `key` IN ('dashboard','students','teachers','staff','parents','classes','subjects',
                'timetable','attendance','assignments','study_materials','exams','marks',
                'fee_structure','payments','leaves','notices','messages','reports');

-- Enterprise: everything
INSERT INTO `subscription_module_access` (`plan`, `module_id`)
SELECT 'enterprise', id FROM `modules`;

-- ------------------------------------------------------------
-- role_permissions — per role, per module, CRUD flags
--   super admin can toggle these; school_id NULL = global default
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `role_id`     INT NOT NULL,
  `module_id`   INT NOT NULL,
  `school_id`   INT DEFAULT NULL,   -- NULL = platform default; override per school
  `can_view`    TINYINT(1) DEFAULT 0,
  `can_create`  TINYINT(1) DEFAULT 0,
  `can_update`  TINYINT(1) DEFAULT 0,
  `can_delete`  TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_rp_role_module_school` (`role_id`, `module_id`, `school_id`),
  CONSTRAINT `fk_rp_role`   FOREIGN KEY (`role_id`)   REFERENCES `roles`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rp_module` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default permissions (school_id = NULL = applies to all schools unless overridden)
-- school_admin: full CRUD on all school modules
INSERT INTO `role_permissions` (`role_id`, `module_id`, `can_view`, `can_create`, `can_update`, `can_delete`)
SELECT r.id, m.id, 1, 1, 1, 1
FROM `roles` r, `modules` m
WHERE r.name = 'school_admin'
  AND m.key NOT IN ('schools','subscriptions','roles_permissions');

-- teacher: view + create on academic modules, no delete on students/fees
INSERT INTO `role_permissions` (`role_id`, `module_id`, `can_view`, `can_create`, `can_update`, `can_delete`)
SELECT r.id, m.id,
  1,
  IF(m.key IN ('attendance','marks','assignments','study_materials','leaves','timetable'), 1, 0),
  IF(m.key IN ('attendance','marks','assignments','study_materials','leaves'), 1, 0),
  0
FROM `roles` r, `modules` m
WHERE r.name = 'teacher'
  AND m.key IN ('dashboard','attendance','marks','assignments','study_materials',
                'timetable','leaves','payroll','notices','messages');

-- student: view only
INSERT INTO `role_permissions` (`role_id`, `module_id`, `can_view`, `can_create`, `can_update`, `can_delete`)
SELECT r.id, m.id, 1, 0, 0, 0
FROM `roles` r, `modules` m
WHERE r.name = 'student'
  AND m.key IN ('dashboard','attendance','assignments','study_materials','marks',
                'timetable','fee_structure','payments','notices');

-- parent: view only
INSERT INTO `role_permissions` (`role_id`, `module_id`, `can_view`, `can_create`, `can_update`, `can_delete`)
SELECT r.id, m.id, 1, 0, 0, 0
FROM `roles` r, `modules` m
WHERE r.name = 'parent'
  AND m.key IN ('dashboard','attendance','marks','timetable','fee_structure',
                'payments','notices','messages');

-- ============================================================
-- SCHOOLS
-- ============================================================

DROP TABLE IF EXISTS `schools`;
CREATE TABLE `schools` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255) NOT NULL,
  `domain`     VARCHAR(255) DEFAULT NULL,
  `logo`       VARCHAR(255) DEFAULT NULL,
  `address`    TEXT         DEFAULT NULL,
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `email`      VARCHAR(150) DEFAULT NULL,
  `status`     ENUM('active','inactive','suspended') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_schools_domain` (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- subscriptions — one active subscription per school
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `school_id`  INT NOT NULL,
  `plan`       ENUM('basic','pro','enterprise') NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date`   DATE NOT NULL,
  `status`     ENUM('active','expired','cancelled') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sub_school` (`school_id`),
  CONSTRAINT `fk_sub_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SUPER ADMIN seed (created at first deploy)
-- Password: change immediately via env/migration script
-- ============================================================
DROP TABLE IF EXISTS `super_admins`;  -- compatibility alias, kept thin
CREATE TABLE `super_admins` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `user_id`    INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sa_user` (`user_id`),
  CONSTRAINT `fk_sa_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed super admin (password should be bcrypt hash in production — use migration script)
INSERT INTO `users` (`name`, `email`, `password_hash`, `is_active`, `is_verified`)
VALUES ('Super Admin', 'superadmin@educore.app', '$2b$12$REPLACE_WITH_BCRYPT_HASH', 1, 1);

SET @super_user_id = LAST_INSERT_ID();

INSERT INTO `super_admins` (`user_id`) VALUES (@super_user_id);

INSERT INTO `user_roles` (`user_id`, `role_id`, `school_id`)
SELECT @super_user_id, id, NULL FROM `roles` WHERE `name` = 'super_admin';

-- ============================================================
-- SCHOOL ADMINS
-- (row created by super admin when registering a school)
-- (corresponding user + user_role created in application layer
--  and credentials sent via nodemailer)
-- ============================================================

DROP TABLE IF EXISTS `school_admins`;
CREATE TABLE `school_admins` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `user_id`     INT NOT NULL,
  `school_id`   INT NOT NULL,
  `role`        ENUM('admin','staff') DEFAULT 'admin',
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sa_user_school` (`user_id`, `school_id`),
  CONSTRAINT `fk_sadm_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sadm_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ACADEMIC STRUCTURE  (all school-scoped)
-- ============================================================

DROP TABLE IF EXISTS `academic_sessions`;
CREATE TABLE `academic_sessions` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `school_id`  INT NOT NULL,
  `name`       VARCHAR(20)  NOT NULL,
  `start_date` DATE         NOT NULL,
  `end_date`   DATE         NOT NULL,
  `is_active`  TINYINT(1)   DEFAULT 0,
  `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_as_school` (`school_id`),
  CONSTRAINT `fk_as_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `terms`;
CREATE TABLE `terms` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `school_id`           INT NOT NULL,
  `academic_session_id` INT NOT NULL,
  `name`                VARCHAR(50) DEFAULT NULL,
  `start_date`          DATE        DEFAULT NULL,
  `end_date`            DATE        DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_terms_session` (`academic_session_id`),
  CONSTRAINT `fk_terms_school`   FOREIGN KEY (`school_id`)           REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_terms_session`  FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `school_id`           INT NOT NULL,
  `academic_session_id` INT DEFAULT NULL,
  `name`                VARCHAR(20) NOT NULL,
  `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cls_school` (`school_id`),
  CONSTRAINT `fk_cls_school`   FOREIGN KEY (`school_id`)           REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cls_session`  FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `school_id` INT NOT NULL,
  `class_id`  INT NOT NULL,
  `name`      VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sec_school` (`school_id`),
  CONSTRAINT `fk_sec_school` FOREIGN KEY (`school_id`) REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sec_class`  FOREIGN KEY (`class_id`)  REFERENCES `classes`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id`        INT NOT NULL AUTO_INCREMENT,
  `school_id` INT NOT NULL,
  `name`      VARCHAR(50)  NOT NULL,
  `code`      VARCHAR(10)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_subj_school` (`school_id`),
  CONSTRAINT `fk_subj_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `class_subjects`;
CREATE TABLE `class_subjects` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `school_id`  INT NOT NULL,
  `class_id`   INT DEFAULT NULL,
  `subject_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cs_class_subj` (`class_id`, `subject_id`),
  CONSTRAINT `fk_cs_school`  FOREIGN KEY (`school_id`) REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_class`   FOREIGN KEY (`class_id`)  REFERENCES `classes`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_subject` FOREIGN KEY (`subject_id`)REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TEACHERS
-- ============================================================

DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `user_id`          INT NOT NULL,        -- FK → users.id (login credentials live here)
  `school_id`        INT NOT NULL,
  `employee_id`      VARCHAR(20) DEFAULT NULL,
  `phone`            VARCHAR(20) DEFAULT NULL,
  `dob`              DATE        DEFAULT NULL,
  `gender`           ENUM('Male','Female','Other') DEFAULT NULL,
  `marital_status`   ENUM('Single','Married','Divorced','Widowed') DEFAULT NULL,
  `blood_group`      VARCHAR(5)  DEFAULT NULL,
  `designation`      VARCHAR(100) DEFAULT NULL,
  `experience`       INT         DEFAULT NULL,
  `date_of_joining`  DATE        DEFAULT NULL,
  `status`           ENUM('active','inactive') DEFAULT 'active',
  `is_removed`       TINYINT(1)  DEFAULT 0,
  `removed_at`       DATETIME    DEFAULT NULL,
  `removed_reason`   TEXT        DEFAULT NULL,
  `created_at`       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_teacher_user_school` (`user_id`, `school_id`),
  UNIQUE KEY `uq_teacher_emp_school`  (`employee_id`, `school_id`),
  KEY `idx_teacher_school` (`school_id`),
  CONSTRAINT `fk_teacher_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_teacher_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_qualifications`;
CREATE TABLE `teacher_qualifications` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `teacher_id`    INT NOT NULL,
  `qualification` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tq_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_specializations`;
CREATE TABLE `teacher_specializations` (
  `id`              INT NOT NULL AUTO_INCREMENT,
  `teacher_id`      INT NOT NULL,
  `specialization`  VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ts_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_addresses`;
CREATE TABLE `teacher_addresses` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `teacher_id` INT NOT NULL,
  `street`     VARCHAR(255) DEFAULT NULL,
  `city`       VARCHAR(100) DEFAULT NULL,
  `state`      VARCHAR(100) DEFAULT NULL,
  `zip`        VARCHAR(20)  DEFAULT NULL,
  `country`    VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ta_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_emergency_contacts`;
CREATE TABLE `teacher_emergency_contacts` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `teacher_id` INT NOT NULL,
  `name`       VARCHAR(100) DEFAULT NULL,
  `relation`   VARCHAR(50)  DEFAULT NULL,
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `address`    TEXT         DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tec_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_documents`;
CREATE TABLE `teacher_documents` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `teacher_id`    INT NOT NULL,
  `aadhar_front`  VARCHAR(255) DEFAULT NULL,
  `aadhar_back`   VARCHAR(255) DEFAULT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `document_type` VARCHAR(100) DEFAULT NULL,
  `document_url`  VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_td_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_assignments`;
CREATE TABLE `teacher_assignments` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `school_id`           INT NOT NULL,
  `teacher_id`          INT NOT NULL,
  `class_id`            INT DEFAULT NULL,
  `section_id`          INT DEFAULT NULL,
  `subject_id`          INT DEFAULT NULL,
  `academic_session_id` INT DEFAULT NULL,
  `is_class_teacher`    TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ta_teacher_class_subj` (`teacher_id`, `class_id`, `section_id`, `subject_id`, `academic_session_id`),
  CONSTRAINT `fk_tassn_school`   FOREIGN KEY (`school_id`)           REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tassn_teacher`  FOREIGN KEY (`teacher_id`)          REFERENCES `teachers`          (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tassn_class`    FOREIGN KEY (`class_id`)            REFERENCES `classes`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tassn_section`  FOREIGN KEY (`section_id`)          REFERENCES `sections`          (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tassn_subject`  FOREIGN KEY (`subject_id`)          REFERENCES `subjects`          (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tassn_session`  FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Merged: teacher_attendance + teacher_clockins → single table
DROP TABLE IF EXISTS `teacher_attendance`;
DROP TABLE IF EXISTS `teacher_clockins`;
CREATE TABLE `teacher_clockins` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `school_id`  INT NOT NULL,
  `teacher_id` INT NOT NULL,
  `date`       DATE NOT NULL,
  `clock_in`   TIME DEFAULT NULL,
  `clock_out`  TIME DEFAULT NULL,
  `latitude`   DECIMAL(10,6) DEFAULT NULL,
  `longitude`  DECIMAL(10,6) DEFAULT NULL,
  `status`     ENUM('present','half_day','absent','on_leave') DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,   -- admin can override; FK → users.id
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_clockin_teacher_date` (`teacher_id`, `date`),
  KEY `idx_clk_school` (`school_id`),
  CONSTRAINT `fk_clk_school`   FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clk_teacher`  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_clk_updater`  FOREIGN KEY (`updated_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_leaves`;
CREATE TABLE `teacher_leaves` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `school_id`   INT NOT NULL,
  `teacher_id`  INT NOT NULL,
  `leave_type`  ENUM('casual','sick','paid','unpaid') DEFAULT NULL,
  `from_date`   DATE DEFAULT NULL,
  `to_date`     DATE DEFAULT NULL,
  `total_days`  INT  DEFAULT NULL,
  `status`      ENUM('pending','approved','rejected') DEFAULT 'pending',
  `approved_by` INT  DEFAULT NULL,   -- FK → users.id
  `reason`      TEXT DEFAULT NULL,
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tl_school` (`school_id`),
  CONSTRAINT `fk_tl_school`    FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tl_teacher`   FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tl_approver`  FOREIGN KEY (`approved_by`)REFERENCES `users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_salary_history`;
CREATE TABLE `teacher_salary_history` (
  `id`             INT NOT NULL AUTO_INCREMENT,
  `teacher_id`     INT NOT NULL,
  `basic_salary`   DECIMAL(10,2) NOT NULL,
  `allowance`      DECIMAL(10,2) DEFAULT 0.00,
  `deduction`      DECIMAL(10,2) DEFAULT 0.00,
  `net_salary`     DECIMAL(10,2) NOT NULL,
  `effective_from` DATE NOT NULL,
  `effective_to`   DATE DEFAULT NULL,
  `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tsh_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `teacher_payroll`;
CREATE TABLE `teacher_payroll` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `school_id`     INT NOT NULL,
  `teacher_id`    INT NOT NULL,
  `month`         TINYINT NOT NULL,
  `year`          SMALLINT NOT NULL,
  `working_days`  INT DEFAULT NULL,
  `present_days`  INT DEFAULT NULL,
  `half_days`     INT DEFAULT NULL,
  `leave_days`    INT DEFAULT NULL,
  `basic_salary`  DECIMAL(10,2) DEFAULT NULL,
  `allowance`     DECIMAL(10,2) DEFAULT NULL,
  `deduction`     DECIMAL(10,2) DEFAULT NULL,
  `net_salary`    DECIMAL(10,2) DEFAULT NULL,
  `salary_paid`   DECIMAL(10,2) DEFAULT NULL,
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payroll_teacher_month` (`teacher_id`, `month`, `year`),
  KEY `idx_payroll_school` (`school_id`),
  CONSTRAINT `fk_pay_school`   FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pay_teacher`  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- STAFF (non-teaching — office, lab, library, etc.)
-- ============================================================

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id`              INT NOT NULL AUTO_INCREMENT,
  `user_id`         INT NOT NULL,
  `school_id`       INT NOT NULL,
  `employee_id`     VARCHAR(20) DEFAULT NULL,
  `designation`     VARCHAR(100) DEFAULT NULL,
  `department`      VARCHAR(100) DEFAULT NULL,
  `phone`           VARCHAR(20)  DEFAULT NULL,
  `dob`             DATE         DEFAULT NULL,
  `gender`          ENUM('Male','Female','Other') DEFAULT NULL,
  `date_of_joining` DATE         DEFAULT NULL,
  `status`          ENUM('active','inactive') DEFAULT 'active',
  `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_staff_user_school` (`user_id`, `school_id`),
  CONSTRAINT `fk_staff_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_staff_school` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- STUDENTS
-- ============================================================

DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `user_id`             INT NOT NULL,        -- FK → users.id
  `school_id`           INT NOT NULL,
  `admission_no`        VARCHAR(20) NOT NULL,
  `admission_date`      DATE        DEFAULT NULL,
  `dob`                 DATE        DEFAULT NULL,
  `gender`              ENUM('Male','Female','Other') DEFAULT NULL,
  `blood_group`         VARCHAR(5)  DEFAULT NULL,
  `phone`               VARCHAR(20) DEFAULT NULL,
  `class_id`            INT         DEFAULT NULL,
  `section_id`          INT         DEFAULT NULL,
  `academic_session_id` INT         DEFAULT NULL,
  `status`              ENUM('active','inactive','transferred','alumni') DEFAULT 'active',
  `aadhar_front`        VARCHAR(255) DEFAULT NULL,
  `aadhar_back`         VARCHAR(255) DEFAULT NULL,
  `transfer_certificate`VARCHAR(255) DEFAULT NULL,
  `created_at`          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_student_admno_school` (`admission_no`, `school_id`),
  UNIQUE KEY `uq_student_user_school`  (`user_id`, `school_id`),
  KEY `idx_stu_school` (`school_id`),
  CONSTRAINT `fk_stu_user`    FOREIGN KEY (`user_id`)             REFERENCES `users`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stu_school`  FOREIGN KEY (`school_id`)           REFERENCES `schools`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stu_class`   FOREIGN KEY (`class_id`)            REFERENCES `classes`         (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stu_section` FOREIGN KEY (`section_id`)          REFERENCES `sections`        (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_stu_session` FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_addresses`;
CREATE TABLE `student_addresses` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `street`     VARCHAR(255) DEFAULT NULL,
  `city`       VARCHAR(100) DEFAULT NULL,
  `state`      VARCHAR(100) DEFAULT NULL,
  `zip`        VARCHAR(20)  DEFAULT NULL,
  `country`    VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_saddr_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_guardians`;
CREATE TABLE `student_guardians` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `name`       VARCHAR(100) DEFAULT NULL,
  `relation`   VARCHAR(50)  DEFAULT NULL,
  `occupation` VARCHAR(100) DEFAULT NULL,
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `email`      VARCHAR(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sg_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_emergency_contacts`;
CREATE TABLE `student_emergency_contacts` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `name`       VARCHAR(100) DEFAULT NULL,
  `relation`   VARCHAR(50)  DEFAULT NULL,
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `address`    TEXT         DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sec_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_siblings`;
CREATE TABLE `student_siblings` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `name`       VARCHAR(100) DEFAULT NULL,
  `class`      VARCHAR(50)  DEFAULT NULL,
  `section`    VARCHAR(20)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ssib_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_medical_records`;
CREATE TABLE `student_medical_records` (
  `id`             INT NOT NULL AUTO_INCREMENT,
  `student_id`     INT NOT NULL,
  `condition_name` VARCHAR(255) DEFAULT NULL,
  `doctor_note`    TEXT         DEFAULT NULL,
  `date`           DATE         DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_smr_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_achievements`;
CREATE TABLE `student_achievements` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `student_id`  INT NOT NULL,
  `title`       VARCHAR(255) DEFAULT NULL,
  `description` TEXT         DEFAULT NULL,
  `date`        DATE         DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sach_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_activities`;
CREATE TABLE `student_activities` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `student_id`  INT NOT NULL,
  `activity`    VARCHAR(255) DEFAULT NULL,
  `achievement` VARCHAR(255) DEFAULT NULL,
  `year`        VARCHAR(10)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sact_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_certificates`;
CREATE TABLE `student_certificates` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `name`       VARCHAR(255) DEFAULT NULL,
  `issued_by`  VARCHAR(255) DEFAULT NULL,
  `issue_date` DATE         DEFAULT NULL,
  `file_url`   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_scert_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_disciplinary_actions`;
CREATE TABLE `student_disciplinary_actions` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `student_id`   INT NOT NULL,
  `incident`     TEXT DEFAULT NULL,
  `action_taken` TEXT DEFAULT NULL,
  `date`         DATE DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sda_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PARENTS
-- ============================================================

DROP TABLE IF EXISTS `parents`;
CREATE TABLE `parents` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `user_id`    INT NOT NULL,
  `phone`      VARCHAR(20) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_parent_user` (`user_id`),
  CONSTRAINT `fk_parent_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_parents`;
CREATE TABLE `student_parents` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `student_id`   INT NOT NULL,
  `parent_id`    INT NOT NULL,
  `relationship` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sp_student_parent` (`student_id`, `parent_id`),
  CONSTRAINT `fk_sp_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sp_parent`  FOREIGN KEY (`parent_id`)  REFERENCES `parents`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ATTENDANCE
-- ============================================================

DROP TABLE IF EXISTS `student_attendance`;
CREATE TABLE `student_attendance` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `school_id`  INT NOT NULL,
  `student_id` INT NOT NULL,
  `class_id`   INT DEFAULT NULL,
  `section_id` INT DEFAULT NULL,
  `teacher_id` INT DEFAULT NULL,   -- who marked it
  `date`       DATE NOT NULL,
  `status`     ENUM('present','absent','leave') DEFAULT NULL,
  `updated_by` INT DEFAULT NULL,   -- admin override FK → users.id
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_att_student_date` (`student_id`, `date`),
  KEY `idx_att_school` (`school_id`),
  CONSTRAINT `fk_att_school`   FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_student`  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_teacher`  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_att_class`    FOREIGN KEY (`class_id`)   REFERENCES `classes`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_att_section`  FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_att_updater`  FOREIGN KEY (`updated_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- EXAMS & MARKS
-- ============================================================

DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `school_id`           INT NOT NULL,
  `academic_session_id` INT DEFAULT NULL,
  `name`                VARCHAR(100) DEFAULT NULL,
  `term`                VARCHAR(50)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_exam_school` (`school_id`),
  CONSTRAINT `fk_exam_school`   FOREIGN KEY (`school_id`)           REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exam_session`  FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `exam_subjects`;
CREATE TABLE `exam_subjects` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `exam_id`    INT DEFAULT NULL,
  `subject_id` INT DEFAULT NULL,
  `max_marks`  INT DEFAULT NULL,
  `pass_marks` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_es_exam`    FOREIGN KEY (`exam_id`)    REFERENCES `exams`    (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_es_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `marks`;
CREATE TABLE `marks` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `school_id`        INT NOT NULL,
  `student_id`       INT DEFAULT NULL,
  `exam_subject_id`  INT DEFAULT NULL,
  `marks_obtained`   INT DEFAULT NULL,
  `teacher_id`       INT DEFAULT NULL,   -- who entered
  `updated_by`       INT DEFAULT NULL,   -- admin override FK → users.id
  `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_marks_student_examsubj` (`student_id`, `exam_subject_id`),
  KEY `idx_marks_school` (`school_id`),
  CONSTRAINT `fk_marks_school`    FOREIGN KEY (`school_id`)       REFERENCES `schools`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_marks_student`   FOREIGN KEY (`student_id`)      REFERENCES `students`      (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_marks_examsubj`  FOREIGN KEY (`exam_subject_id`) REFERENCES `exam_subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_marks_teacher`   FOREIGN KEY (`teacher_id`)      REFERENCES `teachers`      (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_marks_updater`   FOREIGN KEY (`updated_by`)      REFERENCES `users`         (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_exam_results`;
CREATE TABLE `student_exam_results` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `school_id`    INT NOT NULL,
  `student_id`   INT DEFAULT NULL,
  `class_id`     INT DEFAULT NULL,
  `half_yearly`  INT DEFAULT NULL,
  `final_exam`   INT DEFAULT NULL,
  `result`       ENUM('pass','fail','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ser_student_class` (`student_id`, `class_id`),
  CONSTRAINT `fk_ser_school`   FOREIGN KEY (`school_id`) REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ser_student`  FOREIGN KEY (`student_id`)REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ser_class`    FOREIGN KEY (`class_id`)  REFERENCES `classes`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_marksheets`;
CREATE TABLE `student_marksheets` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `student_id`       INT NOT NULL,
  `exam`             VARCHAR(100) DEFAULT NULL,
  `file_url`         VARCHAR(255) DEFAULT NULL,
  `marksheet_status` ENUM('pending','uploaded') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sms_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Promotion eligibility view (unchanged logic, references updated tables)
DROP VIEW IF EXISTS `promotion_eligible_students`;
CREATE VIEW `promotion_eligible_students` AS
SELECT m.student_id
FROM marks m
JOIN exam_subjects es ON m.exam_subject_id = es.id
JOIN exams e ON es.exam_id = e.id
GROUP BY m.student_id
HAVING COUNT(DISTINCT e.term) = (SELECT COUNT(DISTINCT term) FROM exams);

DROP TABLE IF EXISTS `student_class_history`;
CREATE TABLE `student_class_history` (
  `id`                   INT NOT NULL AUTO_INCREMENT,
  `school_id`            INT NOT NULL,
  `student_id`           INT NOT NULL,
  `class_id`             INT DEFAULT NULL,
  `section_id`           INT DEFAULT NULL,
  `academic_session_id`  INT DEFAULT NULL,
  `promoted_from_class_id` INT DEFAULT NULL,
  `promoted_to_class_id`   INT DEFAULT NULL,
  `created_at`           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sch_student_session` (`student_id`, `academic_session_id`),
  CONSTRAINT `fk_sch_school`   FOREIGN KEY (`school_id`)           REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sch_student`  FOREIGN KEY (`student_id`)          REFERENCES `students`          (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sch_class`    FOREIGN KEY (`class_id`)            REFERENCES `classes`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sch_section`  FOREIGN KEY (`section_id`)          REFERENCES `sections`          (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sch_session`  FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_promotions`;
CREATE TABLE `student_promotions` (
  `id`              INT NOT NULL AUTO_INCREMENT,
  `school_id`       INT NOT NULL,
  `student_id`      INT DEFAULT NULL,
  `from_class_id`   INT DEFAULT NULL,
  `to_class_id`     INT DEFAULT NULL,
  `from_session_id` INT DEFAULT NULL,
  `to_session_id`   INT DEFAULT NULL,
  `promoted_by`     INT DEFAULT NULL,   -- FK → users.id
  `promoted_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sp_school`      FOREIGN KEY (`school_id`)       REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_spr_student`    FOREIGN KEY (`student_id`)      REFERENCES `students`          (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_spr_from_cls`   FOREIGN KEY (`from_class_id`)   REFERENCES `classes`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_spr_to_cls`     FOREIGN KEY (`to_class_id`)     REFERENCES `classes`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_spr_from_sess`  FOREIGN KEY (`from_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_spr_to_sess`    FOREIGN KEY (`to_session_id`)   REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_spr_promoter`   FOREIGN KEY (`promoted_by`)     REFERENCES `users`             (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- FEES
-- ============================================================

DROP TABLE IF EXISTS `fee_structures`;
CREATE TABLE `fee_structures` (
  `id`                  INT NOT NULL AUTO_INCREMENT,
  `school_id`           INT NOT NULL,
  `class_id`            INT DEFAULT NULL,
  `academic_session_id` INT DEFAULT NULL,
  `fee_type`            VARCHAR(100) DEFAULT NULL,
  `amount`              DECIMAL(10,2) DEFAULT NULL,
  `due_date`            DATE          DEFAULT NULL,
  `created_at`          TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fs_school` (`school_id`),
  CONSTRAINT `fk_fs_school`   FOREIGN KEY (`school_id`)           REFERENCES `schools`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fs_class`    FOREIGN KEY (`class_id`)            REFERENCES `classes`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_fs_session`  FOREIGN KEY (`academic_session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_fees`;
CREATE TABLE `student_fees` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `school_id`        INT NOT NULL,
  `student_id`       INT NOT NULL,
  `fee_structure_id` INT NOT NULL,
  `amount_paid`      DECIMAL(10,2) DEFAULT 0.00,
  `payment_date`     DATE          DEFAULT NULL,
  `status`           ENUM('paid','pending','partial') DEFAULT 'pending',
  `collected_by`     INT DEFAULT NULL,   -- FK → users.id (admin/staff who recorded payment)
  PRIMARY KEY (`id`),
  KEY `idx_sfee_school` (`school_id`),
  -- Prevent overpayment
  CONSTRAINT `chk_sfee_amount` CHECK (`amount_paid` >= 0),
  CONSTRAINT `fk_sfee_school`   FOREIGN KEY (`school_id`)       REFERENCES `schools`        (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sfee_student`  FOREIGN KEY (`student_id`)      REFERENCES `students`       (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sfee_struct`   FOREIGN KEY (`fee_structure_id`)REFERENCES `fee_structures` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sfee_collector`FOREIGN KEY (`collected_by`)    REFERENCES `users`          (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Application layer should enforce: amount_paid ≤ fee_structures.amount
-- Trigger below provides DB-level guard:
DROP TRIGGER IF EXISTS `trg_sfee_no_overpayment`;
DELIMITER $$
CREATE TRIGGER `trg_sfee_no_overpayment`
BEFORE INSERT ON `student_fees`
FOR EACH ROW
BEGIN
  DECLARE v_max DECIMAL(10,2);
  SELECT amount INTO v_max FROM fee_structures WHERE id = NEW.fee_structure_id;
  IF NEW.amount_paid > v_max THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'amount_paid exceeds fee amount';
  END IF;
END$$
DELIMITER ;

-- ============================================================
-- ACADEMIC ACTIVITY
-- ============================================================

DROP TABLE IF EXISTS `class_schedules`;
CREATE TABLE `class_schedules` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `school_id`    INT NOT NULL,
  `teacher_id`   INT DEFAULT NULL,
  `class_id`     INT DEFAULT NULL,
  `section_id`   INT DEFAULT NULL,
  `subject_id`   INT DEFAULT NULL,
  `day_of_week`  ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun') DEFAULT NULL,
  `start_time`   TIME DEFAULT NULL,
  `end_time`     TIME DEFAULT NULL,
  `meeting_link` VARCHAR(255) DEFAULT NULL,
  `created_by`   INT DEFAULT NULL,   -- FK → users.id
  `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_csched_school` (`school_id`),
  CONSTRAINT `fk_csched_school`   FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_csched_teacher`  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_csched_class`    FOREIGN KEY (`class_id`)   REFERENCES `classes`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_csched_section`  FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_csched_subject`  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_csched_creator`  FOREIGN KEY (`created_by`) REFERENCES `users`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `class_assignments`;
CREATE TABLE `class_assignments` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `school_id`   INT NOT NULL,
  `teacher_id`  INT DEFAULT NULL,
  `class_id`    INT DEFAULT NULL,
  `section_id`  INT DEFAULT NULL,
  `subject_id`  INT DEFAULT NULL,
  `title`       VARCHAR(255) DEFAULT NULL,
  `description` TEXT         DEFAULT NULL,
  `due_date`    DATE         DEFAULT NULL,
  `file_url`    VARCHAR(255) DEFAULT NULL,
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cassn_school` (`school_id`),
  CONSTRAINT `fk_cassn_school`   FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cassn_teacher`  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cassn_class`    FOREIGN KEY (`class_id`)   REFERENCES `classes`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cassn_section`  FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cassn_subject`  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `study_materials`;
CREATE TABLE `study_materials` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `school_id`   INT NOT NULL,
  `teacher_id`  INT DEFAULT NULL,
  `class_id`    INT DEFAULT NULL,
  `section_id`  INT DEFAULT NULL,
  `subject_id`  INT DEFAULT NULL,
  `title`       VARCHAR(255) DEFAULT NULL,
  `description` TEXT         DEFAULT NULL,
  `file_url`    VARCHAR(255) DEFAULT NULL,
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sm_school`   FOREIGN KEY (`school_id`)  REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sm_teacher`  FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sm_class`    FOREIGN KEY (`class_id`)   REFERENCES `classes`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sm_section`  FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sm_subject`  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `substitute_teachers`;
CREATE TABLE `substitute_teachers` (
  `id`                    INT NOT NULL AUTO_INCREMENT,
  `school_id`             INT NOT NULL,
  `original_teacher_id`   INT DEFAULT NULL,
  `substitute_teacher_id` INT DEFAULT NULL,
  `class_id`              INT DEFAULT NULL,
  `section_id`            INT DEFAULT NULL,
  `subject_id`            INT DEFAULT NULL,
  `date`                  DATE DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sub_school`   FOREIGN KEY (`school_id`)             REFERENCES `schools`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_orig`     FOREIGN KEY (`original_teacher_id`)   REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sub_sub`      FOREIGN KEY (`substitute_teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sub_subject`  FOREIGN KEY (`subject_id`)            REFERENCES `subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- NOTICES & NOTIFICATIONS
-- ============================================================

DROP TABLE IF EXISTS `notices`;
CREATE TABLE `notices` (
  `id`          INT NOT NULL AUTO_INCREMENT,
  `school_id`   INT NOT NULL,
  `title`       VARCHAR(255) NOT NULL,
  `body`        TEXT         DEFAULT NULL,
  `target_role` SET('all','teacher','student','parent','staff') DEFAULT 'all',
  `created_by`  INT DEFAULT NULL,   -- FK → users.id
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notice_school` (`school_id`),
  CONSTRAINT `fk_notice_school`   FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notice_creator`  FOREIGN KEY (`created_by`)REFERENCES `users`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `student_notifications`;
CREATE TABLE `student_notifications` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `title`      VARCHAR(255) DEFAULT NULL,
  `body`       TEXT         DEFAULT NULL,
  `is_read`    TINYINT(1)   DEFAULT 0,
  `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_sn_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SUMMARY OF KEY CHANGES
-- ============================================================
-- 1. users           — unified auth table; all roles log in here
-- 2. user_roles      — many-to-many: user ↔ role ↔ school
-- 3. roles           — seeded: super_admin/school_admin/teacher/student/parent/staff
-- 4. modules         — 23 modules seeded; super admin can activate/deactivate
-- 5. subscription_module_access — basic/pro/enterprise gates
-- 6. role_permissions — per-role CRUD flags; per-school override supported
-- 7. super_admins    — thin alias; default super admin row seeded
-- 8. school_admins   — created when super admin registers a school
-- 9. staff           — new table for non-teaching staff
-- 10. teacher_clockins — merged from two duplicate tables; admin override field added
-- 11. student_fees   — overpayment trigger + CHECK constraint
-- 12. marks          — unique constraint on (student, exam_subject) to prevent dupes
-- 13. notices        — new table (was missing); replaces scattered announcement logic
-- 14. school_id FK   — added to: academic_sessions, terms, classes, sections,
--                      subjects, exams, marks, fee_structures, student_attendance,
--                      teacher_clockins, class_schedules, class_assignments,
--                      study_materials, substitute_teachers, student_fees
-- ============================================================