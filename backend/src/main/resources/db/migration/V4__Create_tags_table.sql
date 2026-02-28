CREATE TABLE tb_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE,
    UNIQUE(name, user_id)
);

CREATE INDEX idx_tags_user_id ON tb_tags(user_id);
CREATE INDEX idx_tags_name ON tb_tags(name);