const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


let users = [
  { username: 'Test',
    password: 'Test'
  }];


let finalOrder = [];

app.get('/', function (req, res) {
    res.send('hello world')
  });

app.post('/api/auth', function (req, res){
    if(!req.body.username || !req.body.password){
       res.status(400).send("Please fill all necessary fields"); 
    }
    else{
    users.forEach((user) => {
        if(user.username == req.body.username && user.password == req.body.password)
        {
          res.status(200).send("Successful Login!!!");
        }
    });

    res.status(403).send("Not Found");

    }
});

app.post('/api/post/user', function (req, res){
  if(!req.body.username || !req.body.password){
     res.status(400).send("Please fill all necessary fields"); 
     return;
  }
  else{
  users.forEach((user) => {
      if(user.username == req.body.username)
      {
        res.status(401).send("Already Exist");
      }
  });

  users.push(req.body);
  res.status(200).send("Successful register");
  }
});

app.post('/api/post/order', function (req, res){
  transferOrders(req.body);
});

app.get('/api/get/orders/:user', function (req, res){
  let orders = getAllOrdersByUsername(req.params.user);
  if(!orders || orders.length==0){
    res.status(404).send("Not found");
  }
  console.log(orders);
  res.json(orders).send(); 
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
      order.id = getAllOrdersByUsername(orders[1].user).length + 1;

      finalOrder.push(order);
  });
}

app.listen(5000);