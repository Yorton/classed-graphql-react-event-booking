const express = require('express');
const bodyParser = require('body-parser');
//const graphqlHttp = require('express-graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const path = require('path');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResovers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method == 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});


app.use(isAuth);

app.use('/graphql', 

    graphqlHttp({

        schema: graphQlSchema,
        rootValue: graphQlResovers,
        graphiql: true //use graphql tool
    })

);


app.use(express.static('public'));
app.get('*', (req, res) => {

    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
                                                                       
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.vjqhc.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(8000);
})
.catch(err => {console.log(err);})

