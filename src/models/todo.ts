import mongoose, { Schema, Document } from 'mongoose';

export interface Todo extends Document {
    title: string;
    completed: boolean;
}

enum TodoState {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

const todoSchema: Schema = new Schema({
    title: { type: String, required: true },
    createdOn: { type: Number, required: true },
    updatedOn: { type: Number, required: true },
    state: { type: String, enum: Object.values(TodoState), default: TodoState.TODO },
});

export default mongoose.model<Todo>('Todo', todoSchema);
