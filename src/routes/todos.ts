import express, { Request, Response } from 'express';
import Todo from '../models/todo';
import TodoState from '../models/todo';

const router = express.Router();

router.get('/', async (_: Request, res: Response) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
});

router.post('/add', async (req: Request, res: Response) => {
    try {
        const todoExists = await Todo.findOne({ title: req.body.title });
        if (todoExists) {
            res.status(400).json({ message: `Task already exists (Did you mean to update it?)` })
            return
        }
        const { title, state } = req.body;
        if (state != undefined && !Object.values(TodoState).includes(state)) {
            res.status(400).json({ message: `Provided state is not supported: ${state}` })
            return
        }
        const currentTime = Date.now();
        const todo = new Todo({
            title: title,
            state: state,
            createdOn: currentTime,
            updatedOn: currentTime
        });
        await todo.save().then(() => res.status(200).json({ todo: todo }));
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

router.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const existingTask = await Todo.findById(id);
        if (!existingTask) {
            res.status(400).json({ message: `Task does not exists (Did you mean to add it?)` })
            return
        }
        const { title, state } = req.body;
        if (title != undefined) {
            res.status(400).json({ message: `Updating title is not supported, rather create a new task` })
            return
        }
        if (state == undefined) {
            res.status(400).json({ message: `No updated state provided` })
            return
        }
        if (!Object.values(TodoState).includes(state)) {
            res.status(400).json({ message: `Provided state is not supported: ${state}` })
            return
        }
        const currentTime = Date.now();
        await existingTask.updateOne({
            state: state,
            updatedOn: currentTime,
        }).then(() => res.status(200).json({ message: `Updated ${id} to ${state}` }));
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
});

export default router;
