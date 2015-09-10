import express from 'express';
import {graphql} from 'graphql';
import Schema from './data/schema.js';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';


let app = express();

app.use(express.static('client'));
app.use(bodyParser.urlencoded());

async function graphQLHandler(req, res, schema){
  const {query, variables = {}} = req.body;
  console.log(query);
  console.log(variables);
  const result = await graphql(
    schema,
    query,
    {},
    variables
  );
  res.send(result);
}

// app.post('/', graphQLHandler);

// var Sandal = require('sandle');
var cb = Sandal(Schema, 'postgres://localhost/test'); // => function(req, res) { }
app.post('/',cb);



function Sandal(schema,uri){//query, mutation, uri) {
  var sequelize = new Sequelize(uri);

  let User = sequelize.define('users', {
    name: {
      type: Sequelize.STRING,
      field: 'name'
    },
    age: {
      type: Sequelize.INTEGER,
      field: 'age'
    },
  });

  // get rid of this
  User.belongsToMany(User, {as: 'friends', through: 'friendships'});

  // get rid of this
  sequelize.sync();

  console.log(schema);//._schemaConfig.query._fields);
  schema._schemaConfig.query._fields.getUser.resolve = (root, {name})=>{
    console.log('resolving in getUser');
    console.log('root in getUser: ',root);
    console.log('name arg in getUser: ',name);
    //return User
    console.log('User in getUser: ', User);
    console.log('got here!');
    return User
      .findOne({
        where: { name : name }
      })
    console.log('getUser returned: ',user);
  }
  console.log(schema._schemaConfig.query._fields);
  return function(req, res) {
    graphQLHandler(req, res, schema);
  }
}

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening on port 3000.");
  //sequelize = new Sequelize('postgres://localhost/test');
});

module.exports = app;
//module.exports.sequelize = sequelize;
