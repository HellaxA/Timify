import { CategoryEntity } from '@/src/entities/category';
import {
    type SQLiteDatabase,
} from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let result = await db.getFirstAsync<{ user_version: number; }>('PRAGMA user_version');
    if (result == null) {
        throw new Error('Failed to retrieve the current database version');
    }
    let currentDbVersion = result.user_version;

    console.log('Current db version: ', currentDbVersion);
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, hours INTEGER, minutes INTEGER, category_id INTEGER NOT NULL, FOREIGN KEY (category_id) REFERENCES categories(id));
      CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY NOT NULL, name TEXT);
    `);

    // await db.execAsync(
    //     `INSERT INTO categories (name) VALUES ('New Name')`
    // )
    currentDbVersion = 1;
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
export async function deleteItemAsync(db: SQLiteDatabase, id: number | null): Promise<void> {
    try {
        await db.runAsync('DELETE FROM items where id = ?', id);
    } catch(exc) {
        console.error('Error deleting: ', exc);
    }
}

export async function addItemAsync(db: SQLiteDatabase, hours: number, minutes: number, categoryId: number): Promise<void> {
    if (hours !== 0 && minutes !== 0) {
        try {
            await db.runAsync(
                'INSERT INTO items (hours, minutes, category_id) VALUES (?, ?, ?);',
                hours,
                minutes,
                categoryId
            );
        } catch (error) {
            console.error('Error inserting into database:', error);
        }
    }
}

export async function updateItemAsync(db: SQLiteDatabase, hours: number, minutes: number, id: number): Promise<void> {
    if (hours !== 0 && minutes !== 0) {
        try {
            await db.runAsync(
                'UPDATE items SET hours = ?, minutes = ? WHERE id = ?;',
                hours,
                minutes,
                id
            );
        } catch (error) {
            console.error('Error updating the item:', error);
        }
    }
}
export async function updateItemWithCategoryAsync(db: SQLiteDatabase, hours: number, minutes: number, id: number, categoryId: number): Promise<void> {
    try {
        await db.runAsync(
            'UPDATE items SET description = ?, category_id = ? WHERE id = ?;',
            hours,
            minutes,
            categoryId,
            id
        );
    } catch (error) {
        console.error('Error updating the item:', error);
    }
}

export function fetchCategories(db: SQLiteDatabase) {
    return db.getAllSync<CategoryEntity>('SELECT * FROM categories');
}

export async function deleteCategoryAsync(db: SQLiteDatabase, id: number | null): Promise<void> {
    try {
        await db.runAsync('DELETE FROM categories where id = ?', id);
    } catch(exc) {
        console.error('Error deleting category: ', exc);
    }
}

export async function addCategoryAsync(db: SQLiteDatabase, text: string): Promise<void> {
    if (text !== '') {
        try {
            await db.runAsync(
                'INSERT INTO categories (name) VALUES (?);',
                text
            );
        } catch (error) {
            console.error('Error inserting category into database:', error);
        }
    }
}

export async function updateCategoryAsync(db: SQLiteDatabase, text: string, id: number): Promise<void> {
    if (text !== '') {
        try {
            await db.runAsync(
                'UPDATE categories SET name = ? WHERE id = ?;',
                text,
                id
            );
        } catch (error) {
            console.error('Error updating the category:', error);
        }
    }
}