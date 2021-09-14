const express = require('express');
const app = express();
const {foods} = require('./Data/FoodData')
const cors = require('cors');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://viliyan:viliyan@viliyan.zql7y.mongodb.net/pizza?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());
app.use(express.static('img'));
let foodItems = [];

async function insertUser(item){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('users').insertOne(item); 
  
  await client.close();
}


async function insertOrder(order){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('orders').insertOne(order); 
  
  await client.close();
}


async function getFoods(){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  foodItems = await db.collection('foods').find({}).toArray();

  await client.close();
}

async function getUser(item){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  let users = await db.collection('users').find({"username": item.username}).toArray();
  await client.close();

  return users;
}

async function getOrders(username){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});


  const db = await client.db('pizza');
  let finalOrders = await db.collection('orders').find({"user": username}).toArray();

  await client.close();

  return finalOrders;
}

app.get('/', function (req, res) {
    res.send("Hello world");
});

app.post('/api/auth', function (req, res){
    if(!req.body.username || !req.body.password){
      res.status(400).json({message:'Pleae fill all usercredantials'});
    }
    else{

    let users = getUser(req.body);
    
    let isUserExist = false;

    users.then(function(result){
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          if(element.password === req.body.password)
          {
             isUserExist = true;
             console.log("here" + isUserExist);
          }
        }

        if(isUserExist)
        {
          res.status(200).json({status: 200, message: "Successfull"});
        }
        else{
         res.status(404).json({status: 1, message: "Wrong email address or password"});
        }
    });
    }
});

app.post('/api/post/user', function (req, res){
  if(!req.body.username || !req.body.password){
     res.status(400).json({message:"Please fill all necessary fields"}); 
     return;
  }
  else{
  let users = getUser(req.body);
  
  users.then(function(result){
    if(result.length === 0)
    { 
      insertUser(req.body);
      res.status(200).json({message:"Successful register"});
    }
    else
    {
      res.status(401).json({message:"Email address already exist"});
    }
  });
  }
});

app.post('/api/post/order', function (req, res){
  if(req.body.length===0)
  {
    res.status(400).json({message:'Please fill your order before proccess'});
  }
  else
  {
    transferOrders(req.body);
  }
});

app.get('/api/get/orders/:user', function (req, res){
  let orders = getOrders(req.params.user);
  
  orders.then(function(result){
    res.send(result)
    });

  if(!orders || orders.length==0){
    res.status(404).send("Not found");
  }
});

app.get('/api/get/foods', function (req, res){
  getFoods();
  res.json(foods(foodItems)).send(); 
});

function transferOrders(orders){
orders.date = new Date().toLocaleString();
orders.status = "Draft";

insertOrder(orders);
}

app.listen(5000);