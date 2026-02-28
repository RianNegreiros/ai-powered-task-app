CREATE TABLE tb_task_tags (
    task_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tb_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tb_tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_task_tags_tag_id ON tb_task_tags(tag_id);