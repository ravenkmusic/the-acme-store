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
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE products(
            id UUID PRIMARY KEY,
            name VARCHAR(255)
        );

        CREATE TABLE favorite(
            id UUID PRIMARY KEY,
            product_id UUID REFERENCES products(id) NOT NULL,
            user_id UUID REFERENCES user(id) NOT NULL,
            CONSTRAINT user_id product_id UNIQUE
        );
    `;
    await client.query(SQL);
};

const createProduct = async () => {};

const createUser = async () => {};

const fetchUsers = async () => {};

const fetchProducts = async () => {};

const fetchFavorites = async () => {};

const createFavorite = async () => {};

const destroyFavorite = async () => {};


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