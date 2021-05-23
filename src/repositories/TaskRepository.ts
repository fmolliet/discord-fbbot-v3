import TaskModel from '../models/Task';
import { Task } from '../interfaces';

export default class TaskRepository {
    
    public async getAllTasks(): Promise<Array<Task|null>> {
        return await TaskModel.find();
    }
    
    public async createTask(task: Task ): Promise<Task> {
        return await TaskModel.create(task);
    }
    
    public async deleteTask( task: Task ): Promise<void> {
        await TaskModel.deleteOne(task);
    }
}