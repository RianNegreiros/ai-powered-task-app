CREATE TABLE tb_tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES tb_users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20),
    tag VARCHAR(255),
    due_date TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tb_tasks(user_id);

CREATE INDEX idx_tasks_title ON tb_tasks(title);