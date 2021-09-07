const express = require('express');
const app = express();
const {foods} = require('./Data/FoodData')
const cors = require('cors');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://viliyan:viliyan@viliyan.zql7y.mongodb.net/pizza?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());
app.use(express.static('img'));
let finalOrder = [];
let users = [];
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
  users = await db.collection('users').find({"username": item.username}).toArray();
  await client.close();
}

app.get('/', function (req, res) {
    res.send("Hello world");
});

app.post('/api/auth', function (req, res){
    if(!req.body.username || !req.body.password){
      res.status(400).json({message:'Pleae fill all usercredantials'});
    }
    else{
    getUser(req.body);
    
    users.forEach((user) => {
        if(user.password == req.body.password)
        {
         res.status(200).json("Successful Login!!!");
        }
    });

     res.status(404).json({status: 1, message: "Wrong email address or password"});
    }
});

app.post('/api/post/user', function (req, res){
  if(!req.body.username || !req.body.password){
     res.status(400).json({message:"Please fill all necessary fields"}); 
     return;
  }
  else{
  getUser(req.body);
  users.forEach((user) => {
      if(user.username == req.body.username)
      {
        res.status(401).json({message:"Email address already exist"});
      }
  });

  insertUser(req.body);
  res.status(200).json({message:"Successful register"});
  }
});

app.post('/api/post/order', function (req, res){
  if(req.body[0].length===0)
  {
    res.status(400).json({message:'Please fill your order before proccess'});
  }
  transferOrders(req.body);
});

app.get('/api/get/orders/:user', function (req, res){
  let orders = getAllOrdersByUsername(req.params.user);
  if(!orders || orders.length==0){
    res.status(404).send("Not found");
  }

  res.json(orders).send(); 
});

app.get('/api/get/foods', function (req, res){
  getFoods();
  res.json(foods(foodItems)).send(); 
});

function getAllOrdersByUsername(username){
  return finalOrder.filter(o => o.user === username);
}

function transferOrders(orders){
  orders[0].forEach(element => {
      let order = new Object();
      order.name = element.name;
      order.toppings = element.toppings.filter(t => t.checked).map(topping => topping.name).join(", ");
      let subtotal = (element.price * element.quantity) + order.toppings.length * 0.6;
      order.price = subtotal + subtotal*0.1;
      order.user = orders[1].user;
      order.status = "Draft";
      order.id = getAllOrdersByUsername(orders[1].user).length + 1;
      finalOrder.push(order);
  });
}

app.listen(5000);