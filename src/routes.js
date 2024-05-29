import {Database} from "./database.js";
import {buildRoutePath} from "./utils/build-route-path.js";
import {randomUUID} from "node:crypto";

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search)

            if (!tasks) {
                return res.writeHead(404).end()
            }

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({message: 'Title and description are required'}))
            }

            try {
                database.insert('tasks', {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
            } catch (error) {
                return res.writeHead(500).end()
            }

            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id, ...rest } = { ...req.params, ...req.body };

            if (!rest.title && !rest.description) {
                return res.writeHead(400).end(
                    JSON.stringify({ message: 'title or description are required' })
                )
            }

            const task = database.select('tasks', {id})

            if (!task) {
                return res.writeHead(404).end()
            }

            try {
                database.update('tasks', id, {
                    title: rest.title ?? task.title,
                    description: rest.description ?? task.description,
                    updated_at: new Date()
                });
            } catch (error) {
                return res.writeHead(404).end();
            }

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const task = database.select('tasks', {id})

            if (!task) {
                return res.writeHead(404).end()
            }

            try {
                database.delete('tasks', id)
            } catch (error) {
                return res.writeHead(404).end()
            }

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            const [task] = database.select('tasks', {id})

            if (!task) {
                return res.writeHead(404).end()
            }

            const completed_at = task.completed_at ? null : new Date()

            try {
                database.update('tasks', id, { completed_at })
            } catch (error) {
                return res.writeHead(500).end()
            }

            return res.writeHead(204).end()
        }
    }
]
