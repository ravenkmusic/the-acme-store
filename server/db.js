const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS favorite;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE users(
            id UUID PRIMARY KEY,
            username VARCHAR(20) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL
        );
        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE
        );
        CREATE TABLE favorite(
            id UUID PRIMARY KEY,
            products_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            CONSTRAINT unique_user_id_products_id UNIQUE (user_id, products_id)
        );
    `;
    await client.query(SQL);
};

const createproducts = async (name) => {
    const SQL = `
        INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createUser = async ( {username, password}) => {
    const SQL = `
        INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;
    `;
    const response = await client.query(SQL, [uuid.v4(), username, bcrypt.hash(password, 10)]);
    return response.rows[0];
};

const fetchUsers = async () => {
    const SQL = `
        SELECT id, username FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchproducts = async () => {
    const SQL = `
        SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchFavorites = async (user_id) => {
    const SQL = `
        SELECT * FROM favorite
        WHERE user_id = $1
    `;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

const createFavorite = async ({products_id, user_id}) => {
    const SQL = `
        INSERT INTO favorite(id, products_id, user_id) VALUES ($1, $2, $3);
    `;
    const response = await client.query(SQL, [uuid.v4(), products_id, user_id]);
    return response.rows[0];
};

const destroyFavorite = async ({user_id, id}) => {
    const SQL = `
        DELETE FROM favorite
        WHERE user_id = $1 AND id = $2
    `;
    await client.query(SQL);
};


module.exports = {
    client,
    createTables,
    createproducts,
    createUser,
    fetchUsers,
    fetchproducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite
}