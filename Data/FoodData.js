module.exports = {
foods: (items) => items.reduce((res, food) => {
  if (!res[food.section]) {
    res[food.section] = [];
  }

  if(food.hasOwnProperty("img")){
  if(!food.img.includes('http://localhost:5000/'))
  {
    food.img = 'http://localhost:5000/' + food.img;
  }
}

  res[food.section].push(food);
  return res;
}, {})
}