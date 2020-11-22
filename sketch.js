//Create variables here
var dog,dogImg,happyDogImg,milkImg,foodS,foodStock,database;
var feed, addFoods, fedTime, lastFed;
var foodObj,Hour,sadDogImg;
var gameState, changeState, readState;
var bedroomImg, gardenImg, washroomImg;
var currentTime;

function preload()
{
  //load images here
  dogImg = loadImage("Dog.png");
  happyDogImg =loadImage("happydog.png");
  bedroomImg = loadImage("images/Bed Room.png"); 
  bedroomImg = loadImage("images/Wash Room.png"); 
  bedroomImg = loadImage("images/Garden.png"); 
  
}

function setup() {

  database = firebase.database();

  foodStock = database.ref('food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

	createCanvas(500, 500);
  dog = createSprite(250,250);
  dog.addImage(dogImg);
  dog.scale = 0.08;

  foodObj = new Food();

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);  

  addFoods = createButton("Add Food");
  addFoods.position(800,95);
  addFoods.mousePressed(addFood);
}


function draw() {  
  background(46,139,87)

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

 /* if(keyWentDown(UP_ARROW))
  {
    writeStock(foodS);
    dog.addImage(happyDogImg);
  } */

  if(gameState !== "Hungry")
  {
    feed.hide();
    addFoods.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFoods.show();
    dog.addImage(dogImg);
  }

  currentTime = hour();
  if(currentTime === (lastFed))
  {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed + 2))
  {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+ 2) && currentTime<=(lastFed + 4))
  {
    update("Bathing");
    foodObj.washroom();
  }
  else
  {
    update("Hungry");
    foodObj.display();
  }
   
  drawSprites();
 
  //text to display food remaining
  textSize(18);
 // stroke("White");
 // text("Food Remaining : " + foodS, 230,200);
 // text("Note: Press the UP arrow to feed your pet milk !", 20,30);

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12)
  {
    text("Last Fed : "+lastFed % 12 + "PM",300,30);
  }
  else if(lastFed === 0)
  {
    text("Last Fed : 12 AM", 300,30);
  } 
  else 
  {
    text("Last Fed : "+lastFed+ "AM",300,30)
  }
}

/*function to read values in database
function readStock(data)
{
  foodS = data.val();
}

//function to write values in database
function writeStock(x)
{

  if(x<=0)
  {
    x=20;
  }
  else
  {
    x=x-1;
  }

  database.ref('/').update({
    food:x
  })
}*/

function feedDog()
{
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.foodStock - 1);
  database.ref('/').update({
   // food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFood()
{
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

async function hour()
{
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var Hour = datetime.slice(11,13);
}

function update(state)
{
  database.ref('/').update({
    gameState: state
  });
}