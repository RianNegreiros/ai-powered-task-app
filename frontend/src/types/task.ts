export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'none'

export interface TaskTag {
  id: number
  name: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  completed: boolean
  createdAt: Date
  priority: Priority
  dueDate: Date | null
  tags: TaskTag[]
}
