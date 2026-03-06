-- Seed data for testing

-- Before create user on /auth/register
-- Get user_id for reference
DO $$
DECLARE
    v_user_id BIGINT;
BEGIN
    SELECT id INTO v_user_id FROM tb_users WHERE email = 'john.doe@mail.com';

    -- Insert tags
    INSERT INTO tb_tags (name, user_id) VALUES
    ('work', v_user_id),
    ('personal', v_user_id),
    ('urgent', v_user_id),
    ('backend', v_user_id),
    ('frontend', v_user_id),
    ('meeting', v_user_id);

    -- Insert tasks
    INSERT INTO tb_tasks (user_id, title, description, priority, due_date, completed, created_at, updated_at) VALUES
    (v_user_id, 'Complete API documentation', 'Finish writing REST API documentation for the task management endpoints', 'HIGH', '2026-03-08 17:00:00-03:00', false, '2026-03-01 09:15:00', '2026-03-01 09:15:00'),
    (v_user_id, 'Fix authentication bug', 'Users are experiencing session timeout issues after 10 minutes instead of 30', 'CRITICAL', '2026-03-06 12:00:00-03:00', false, '2026-03-04 14:20:00', '2026-03-05 08:45:00'),
    (v_user_id, 'Review pull requests', 'Review and merge pending PRs from the team', 'MEDIUM', '2026-03-07 16:00:00-03:00', false, '2026-03-05 07:00:00', '2026-03-05 07:00:00'),
    (v_user_id, 'Update dependencies', 'Update Spring Boot and other dependencies to latest stable versions', 'LOW', '2026-03-15 18:00:00-03:00', false, '2026-03-02 11:30:00', '2026-03-02 11:30:00'),
    (v_user_id, 'Prepare sprint demo', 'Create slides and demo environment for Friday sprint review', 'HIGH', '2026-03-07 10:00:00-03:00', false, '2026-03-05 06:30:00', '2026-03-05 06:30:00'),
    (v_user_id, 'Database backup setup', 'Configure automated daily backups for production database', 'MEDIUM', '2026-03-10 15:00:00-03:00', true, '2026-02-28 13:00:00', '2026-03-03 16:45:00'),
    (v_user_id, 'Team meeting notes', 'Document action items from Monday standup', 'LOW', '2026-03-03 18:00:00-03:00', true, '2026-03-03 10:00:00', '2026-03-03 11:20:00'),
    (v_user_id, 'Refactor task service', 'Clean up TaskService class and improve error handling', 'MEDIUM', '2026-03-12 17:00:00-03:00', false, '2026-03-04 15:45:00', '2026-03-04 15:45:00');

    -- Link tasks with tags
    INSERT INTO tb_task_tags (task_id, tag_id)
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Complete API documentation' AND tg.name IN ('work', 'backend')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Fix authentication bug' AND tg.name IN ('work', 'urgent', 'backend')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Review pull requests' AND tg.name IN ('work', 'backend')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Update dependencies' AND tg.name IN ('work', 'backend')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Prepare sprint demo' AND tg.name IN ('work', 'meeting', 'urgent')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Database backup setup' AND tg.name IN ('work', 'backend')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Team meeting notes' AND tg.name IN ('work', 'meeting')
    UNION ALL
    SELECT t.id, tg.id FROM tb_tasks t, tb_tags tg
    WHERE t.user_id = v_user_id AND tg.user_id = v_user_id
    AND t.title = 'Refactor task service' AND tg.name IN ('work', 'backend');

    -- Insert reports
    INSERT INTO tb_reports (user_id, content, created_at) VALUES
    (v_user_id, 'Weekly Progress Report - Week of Feb 24-28:

Completed Tasks:
- Database backup setup configured and tested
- Team meeting notes documented

In Progress:
- API documentation (70% complete)
- Authentication bug investigation ongoing

Blockers:
- Waiting for DevOps team to provision staging environment

Next Week Focus:
- Complete API documentation
- Fix critical authentication bug
- Prepare sprint demo', '2026-02-28 17:30:00'),
    
    (v_user_id, 'Sprint Review Summary - Sprint 12:

Achievements:
- Delivered 8 out of 10 planned story points
- Zero production incidents
- Improved test coverage to 85%

Challenges:
- Authentication issues discovered late in sprint
- Two team members out sick mid-sprint

Action Items:
- Schedule technical debt refinement session
- Update authentication library
- Review sprint planning estimation process', '2026-03-03 16:00:00');

END $$;
