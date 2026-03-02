CREATE TABLE tb_reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES tb_users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_user_id ON tb_reports(user_id);
CREATE INDEX idx_reports_created_at ON tb_reports(created_at);