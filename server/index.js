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
        createProducts({name: 'Palmolive'})
    ]);

    console.log(await fetchUsers(), 'Users fetched.');
    console.log(await fetchProducts(), 'Products fetched.');

    const favorites = await Promise.all([
        createFavorite({user_id: Grace.id, products_id: Palmolive.id}),
        createFavorite({user_id: Krystin.id, products_id: Dyson.id }),
        createFavorite({user_id: Arnold.id, products_id: Swiffer.id}),
        createFavorite({user_id: Lauren.id, products_id: Swiffer}),
        createFavorite({user_id: Grace.id, products_id: Tide.id}),
        createFavorite({user_id: Arnold.id, products_id: Dyson.id})
    ]);

    console.log(await fetchFavorites(Lauren.id));
    await destroyFavorite({user_id: Lauren.id, products_id: favorites[0].id});
    console.log(await fetchFavorites(Lauren.id));

    console.log(`curl -X POST localhost:3000/api/users/${Grace.id}/favorites -d '{"products_id": "${Tide.id}"}' -H 'Content-Type:application/json'`);
    console.log(`curl -X DELETE localhost:3000/api/users/${Arnold.id}/favorites/${favorites[0].id}`);

    console.log('Data seeded.');
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`Now listening on port ${port}.`));
}

//init invocation
init();