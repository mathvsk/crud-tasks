import fs from 'node:fs/promises'
import {randomUUID} from "node:crypto";

const databasePath = new URL('../database/db.json', import.meta.url)

export class Database {
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] || [];

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data) {
        const index = this.#database[table]?.findIndex(item => item.id === id)

        if (index === -1) {
            throw new Error('Item not found')
        }

        const item = this.#database[table][index]
        this.#database[table][index] =  { ...item, ...data }
        this.#persist()

        return data
    }

    delete(table, id) {
        const index = this.#database[table]?.findIndex(item => item.id === id)

        if (index === -1) {
            throw new Error('Item not found')
        }

        this.#database[table].splice(index, 1)
        this.#persist()
    }
}