export interface TaskDto {
  id: string;
  title: string;
  description: string;
  isComplete: string;
  createdAt: Date;
}
export interface CreateTaskRequest {
  title: string;
  description: string;
}
