import TaskModel from '../models/Task';
import { Task } from '../interfaces';
class TaskRepository {
    
    public async getAllTasks(): Promise<Array<Task|null>> {
        return TaskModel.find();
    }
    
    public async createTask(task: Task ): Promise<Task> {
        return await TaskModel.create(task);
    }
    
    public async deleteTask( task: Task ): Promise<void> {
        TaskModel.deleteOne(task); 
    }
}

export default new TaskRepository();