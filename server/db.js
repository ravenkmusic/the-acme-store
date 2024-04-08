const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_store');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTables = async () => {
    const SQL = `
        DROP TABLE IF EXISTS user;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS favorite;

        CREATE TABLE user(
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
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES user(id) NOT NULL,
            CONSTRAINT unique_user_id_product_id UNIQUE (user_id, product_id)
        );
    `;
    await client.query(SQL);
};

const createProduct = async (name) => {
    const SQL = `
        INSERT INTO product(id, name) VALUES($1, $2) RETURNING *;
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
        SELECT id, username FROM user;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchProducts = async () => {
    const SQL = `
        SELECT * FROM product;
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

const createFavorite = async ({product_id, user_id}) => {
    const SQL = `
        INSERT INTO favorite(id, product_id, user_id) VALUES ($1, $2, $3);
    `;
    const response = await client.query(SQL, [uuid.v4(), product_id, user_id]);
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
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite
}