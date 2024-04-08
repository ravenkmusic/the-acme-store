const {
    client,
    createTables,
    createProducts,
    createUser,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//routes

//init function
const init = async ()=> {
    await client.connect();
    console.log('Client connected.');
    await createTables();
    console.log('Tables created.');
    const [Grace, Arnold, Lauren, Krystin, Swiffer, Dyson, Tide, Palmolive] = await Promise.all([
        createUser({username: 'Grace', password: 'Grace_pw' }),
        createUser({username: 'Arnold', password: 'Arnold_pw}'}),
        createUser({username: 'Lauren', password: 'Lauren_pw' }),
        createUser({username: 'Krystin', password: 'Krystin_pw' }),
        createProducts({name: 'Swiffer'}),
        createProducts({name: 'Dyson'}),
        createProducts({name: 'Tide'}),
        createProducts({name: 'Palmolive'}),
    ]);

    console.log(await fetchUsers(), 'Users fetched.');
    console.log(await fetchProducts(), 'Products fetched.');

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`Now listening on port ${port}.`));
}

//init invocation
init();