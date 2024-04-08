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
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan('dev'));

//routes

//get users

app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers());
    } catch (error) {
        next(error);
    }
});

//get products
app.get('/api/products', async(req, res, next) =>{
    try {
        res.send(await fetchProducts());
    } catch (error) {
        next(error);
    }
});

//get user favorites
app.get('/api/users/:id/favorites', async(req, res, next)=>{
    try {
        res.send(await fetchFavorites(req.params.id));
    } catch (error) {
        next(error);
    }
});

//add to user favorites
app.post('/api/users/:id/favorites', async(req, res, next)=> {
    try {
        res.status(201).send(await createFavorite({user_id: req.params.id, products_id: req.body.products_id}));
    } catch (error) {
        next(error);
    }
});

//delete user favorite
app.delete('/api/users/:userId/favorites/:id', async(req, res, next) => {
    try {
        console.log('Made it here.');
        await destroyFavorite({user_id: req.params.userId, id: req.params.id});
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
})

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
        createFavorite({user_id: Lauren.id, products_id: Swiffer.id}),
        createFavorite({user_id: Grace.id, products_id: Tide.id}),
        createFavorite({user_id: Arnold.id, products_id: Dyson.id})
    ]);

    console.log(await fetchFavorites(Grace.id));
    await destroyFavorite({user_id: Grace.id, id: favorites[0].id});
    console.log(await fetchFavorites(Lauren.id));

    console.log(`curl -X POST localhost:3000/api/users/${Grace.id}/favorites -d '{"products_id": "${Tide.id}"}' -H 'Content-Type:application/json'`);
    console.log(`curl -X DELETE localhost:3000/api/users/${Arnold.id}/favorites/${favorites[0].id}`);

    console.log('Data seeded.');
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`Now listening on port ${port}.`));
}

//init invocation
init();