const express = require('express');
const app = express();
const {foods} = require('./Data/FoodData')
const cors = require('cors');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://viliyan:viliyan@viliyan.zql7y.mongodb.net/pizza?retryWrites=true&w=majority";
const uri1 = "mongodb+srv://adminUser1:adminUser1@viliyan.zql7y.mongodb.net/pizza?retryWrites=true&w=majority";
app.use(cors());
app.use(express.json());
app.use(express.static('img'));
const multer  = require('multer')
var ObjectId = require('mongodb').ObjectId;
var storage = multer.diskStorage({
  destination: 'img/',
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage })

let foodItems = [];
let toppingsItems = [];

async function insertUser(item){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('users').insertOne(item); 
  
  await client.close();
}

async function insertUserAdmin(item){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('adminuser').insertOne(item); 
  
  await client.close();
}


async function addnewToppings(item){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('toppings').insertOne(item); 
  
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


async function insertNewPizza(food){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('foods').insertOne(food); 
  
  await client.close();
}


async function insertTopping(toppingName){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('toppings').insertOne(toppingName); 
  
  await client.close();
}


async function deletePizza(food){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('foods').deleteOne({_id: new ObjectId(food)}); 
  
  await client.close();
}


async function deleteToppings(food){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('toppings').deleteOne({_id: new ObjectId(food)}); 
  
  await client.close();
}


async function updatePizzaPrice(food, number){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  await db.collection('foods').updateOne({_id: new ObjectId(food)}, { $set: { price: number }},   { upsert: true });
  
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

async function getToppings(){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  toppingsItems = await db.collection('toppings').find({}).toArray();

  await client.close();
}

async function getToppingName(name){
  const client = await MongoClient.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  let topping = await db.collection('toppings').find({"name": name}).toArray();

  await client.close();

  return topping;
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


async function getAdminUser(item){
  const client = await MongoClient.connect(uri1, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

  const db = await client.db('pizza');
  let users = await db.collection('adminuser').find({"username": item.username}).toArray();
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


app.post('/api/authAdmin', function (req, res){
  if(!req.body.username || !req.body.password){
    res.status(400).json({message:'Pleae fill all usercredantials'});
  }
  else{

  let users = getAdminUser(req.body);
  
  let isUserExist = false;

  users.then(function(result){
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        if(element.password === req.body.password)
        {
           isUserExist = true;
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

app.post('/api/post/adminuser', function (req, res){
if(!req.body.username || !req.body.password){
   res.status(400).json({message:"Please fill all necessary fields"}); 
   return;
}
else{
let users = getAdminUser(req.body);

users.then(function(result){
  if(result.length === 0)
  { 
    insertUserAdmin(req.body);
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


app.post('/api/post/pizza',upload.single('img'), function (req, res){
    let newFood = {};
    newFood.name = req.body.name;
    newFood.section = req.body.section;
    newFood.price = req.body.price;
    newFood.img = req.file.originalname;

    insertNewPizza(newFood);
});


app.post('/api/delete/pizza', function (req, res){  
  deletePizza(req.body.id);
});

app.post('/api/delete/toppings', function (req, res){  
  console.log(req.body);

  req.body.forEach(element => {
      deleteToppings(element._id);
  });
});

app.post('/api/update/pizza', function (req, res){  
  
  updatePizzaPrice(req.body.id, req.body.price);
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

app.get('/api/get/toppings', function (req, res){
  getToppings();
  res.json(toppingsItems).send(); 
});

app.post('/api/post/topping', function (req, res){
  console.log(req.body.topping);
  let toppings = getToppingName(req.body.topping);

  toppings.then(function(result){
    if(result.length === 0)
    { 
      let data = {"name": req.body.topping};
      insertTopping(data);
      res.status(200).json({message:"Successful register"});
    }
    else
    {
      res.status(401).json({message:"Topping already exist"});
    }
  });
});


function transferOrders(orders){
orders.date = new Date().toLocaleString();
orders.status = "Draft";

insertOrder(orders);
}

app.listen(5000);