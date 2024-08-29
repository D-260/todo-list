const express = require('express');
const { ObjectId } = require('mongodb'); // Import ObjectId for use in delete and update operations
const router = express.Router();
const { getConnectedClient } = require('./database');

// Helper function to get the todos collection
const getCollection = () => {
    const client = getConnectedClient();
    if (!client) {
        throw new Error('MongoDB client is not connected');
    }
    return client.db('todosdb').collection('todos');
};

// GET all todos
router.get('/todo-list', async (req, res) => {
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST a new todo
router.post('/todo-list', async (req, res) => {
    try {
        const collection = getCollection();
        let { todo } = req.body;

        if (!todo) {
            return res.status(400).json({ message: 'Todo is required' });
        }
		todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
        const newTodo = await collection.insertOne({ todo, status: false });
        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE a todo by ID
router.delete('/todo-list/:id', async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);

        const deleteTodo = await collection.deleteOne({ _id });

        if (deleteTodo.deletedCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(deleteTodo);
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT (update) a todo by ID
router.put('/todo-list/:id', async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const { status } = req.body;

        if (typeof status !== 'boolean') {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updateTodo = await collection.updateOne(
            { _id },
            { $set: { status: !status }});

        if (updateTodo.matchedCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(updateTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
