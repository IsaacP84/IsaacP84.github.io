/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  //changes the number of physics calculations per frame
  //higher number, more precise
  const PHYSICS_FRAMES = 5;

  //get the board width/height
  const WIDTH = $("#board").width();
  const HEIGHT = $("#board").height();

  var KEY = {
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    W: 87,
    D: 68,
    S: 83
  };
  
  // Game Item Objects
  var balls = [new Ball()];
  var [ball, paddle1, paddle2] = [
    {
      id: "ball",
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      speed: 0.75,
      angle: 0
    },
    {
      id: "paddle1",
      width: 10,
      height: 100,
      x: 0,
      y: 0,
      speed: 2,

      score: 0
    },
    {
      id: "paddle2",
      width: 10,
      height: 100,
      x: 0,
      y: 0,
      speed: 2,
      
      score: 0
    }
  ];

    //object definitions
    function Ball(x, y, idNum, speed = undefined) {
      //multi purpose parameters
      if(typeof idNum == "string") {
        this.id = idNum;
        this.idNum = parseFloat(idNum.replace(/ball/i, ''));
      } else {
        this.id = "ball" + idNum;
        this.idNum = idNum;
      }
      
      [this.x, this.y] = [x, y];
      [this.width, this.height] = [10, 10];
      //don't worry about this frn. ill deal with it later
      this.speed = speed ? 0.75 : speed;
      this.angle = 
                 (Math.random() < 0 ? -Math.PI / 2 : Math.PI / 2)    //picks a left or right direction
               + (Math.PI/4)                                         //tilts it by an eighth of a rotation
               + (Math.random() * (Math.PI / 2));                    //adds a random tilt less than a quarter rotation
      balls.push(this);
    }
  


  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);
  
  //have this definition make the objects on screen
  $(`#${paddle1.id}`).css("width", `${paddle1.width}px`)
                     .css("height", `${paddle1.height}px`);
  
  $(`#${paddle2.id}`).css("width", `${paddle2.width}px`)
                     .css("height", `${paddle2.height}px`);
  //put objects in place
  resetItems();

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    drawGameItems();
    //for better physics
    for(let i = 0; i < PHYSICS_FRAMES; i++) {
      updateGameItem(ball);
      updateGameItem(paddle1);
      updateGameItem(paddle2);
    }

  }
  
  /* 
  Called in response to events.
  */

  function handleKeyDown(event) {
    if(event.which == KEY.ENTER) {
      //doesnt do anything
    }
    
    //paddle2
    if(event.keyCode == KEY.UP) {
      paddle2.movement.u = true;
    } else if(event.keyCode == KEY.DOWN) {
      paddle2.movement.d = true;
    }

    //paddle1
    if(event.keyCode == KEY.W) {
      paddle1.movement.u = true;
    } else if(event.keyCode == KEY.S) {
      paddle1.movement.d = true;
    }
  }

  function handleKeyUp(event) {
    //paddle2
    if(event.keyCode == KEY.UP) {
      paddle2.movement.u = false;
    } else if(event.keyCode == KEY.DOWN) {
      paddle2.movement.d = false;
    }

    //paddle1
    if(event.keyCode == KEY.W) {
      paddle1.movement.u = false;
    } else if(event.keyCode == KEY.S) {
      paddle1.movement.d = false;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function updateGameItem(object) {
    //changes the movement speed so that it scales with the board
    let boardRatio = HEIGHT/200;
    if(object.movement) {
      //wont need a vel bc no friction and simple physics
      if(object.movement.l && object.movement.r) {
        //do nothing
      } else if(object.movement.l) {
        object.x += -object.speed * boardRatio * (1/PHYSICS_FRAMES);
      } else if(object.movement.r) {
        object.x += object.speed * boardRatio * (1/PHYSICS_FRAMES);
      }

      if(object.movement.u && object.movement.d) {
        //do nothing
      } else if(object.movement.u) {
        object.y += -object.speed * boardRatio * (1/PHYSICS_FRAMES);
      } else if(object.movement.d) {
        object.y += object.speed * boardRatio * (1/PHYSICS_FRAMES);
      }

      // check collision and pass in/define function to be executed if true
      checkBoardCollision(object, function(side) {
        if(side == "top") {
          object.velY = 0;
          object.y = 0;
        }

        if(side == "bottom") {
          object.velY = 0;
          object.y = HEIGHT - object.height;
        }
      });
    } else if(true) {
      //the stuff for the ball

      //trig is fun
      object.x += Math.cos(object.angle) * object.speed;
      object.y += Math.sin(object.angle) * object.speed;

      // check collision and pass in/define function to be executed if true
      checkBoardCollision(object, function(side) {
        // let alpha = Math.abs(object.angle);
        // if(alpha > Math.PI) alpha -= Math.PI;
        // if(alpha > Math.PI / 2) alpha = Math.PI - alpha;
        // if(object.angle > Math.PI * 2) {
        //   let angle = object.angle % Math.PI * 2;
        //   object.angle = angle;
        // } else if (object.angle < 0) {

        // }

        
        
        if(side == "top") {
          object.angle = -object.angle;
          // console.log(object.angle * (180 / Math.PI))
          // object.angle = 0;
        }

        if(side == "bottom") {
          object.angle = -object.angle;
          if(object.angle < Math.PI) {
            // object.angle = Math.PI + object.angle;
          }
          // object.angle = -Math.PI;
        }

        if(side == "left") {
          paddle2.score++;
          resetItems();
        }

        if(side == "right") {
          paddle1.score++;
          resetItems();
        }
      });
    }
    //reposition first to stop spazzy collisions
    // drawGameItem(object);

    // var other;
    // if(walker1 == walker) {
    //   other = walker2;
    // } else {
    //   other = walker1;
    // }
    // checkItemItemCollision(walker, other, function(side, walker, other) {
    //   if(walker.isIt === true) {
    //     other.isIt = true;
    //     walker.isIt = false;

    //     resetGameItems();
    //   }
    // });
    //update movement check. could be used for sprites
    // if(walker.velX !== 0 || walker.velY !== 0) {
    //   walker.movement.moving = true;
    // } else {
    //   walker.movement.moving = false;
    // }
  }

  function checkBoardCollision(item, onCollision) {
    if(item.y < 0) {
      onCollision("top");
    }
    if(item.y + item.height > HEIGHT) {
      onCollision("bottom");
    }
    if(item.x < 0) {
      onCollision("left");
    }
    if(item.x + item.width > WIDTH) {
      onCollision("right");
    }
  }

  function checkItemItemCollision(item1, item2, onCollision) {
    if((item1.x + item1.width > item2.x && item1.x < item2.x + item2.width)
      && (item1.y + item1.height > item2.y && item1.y < item2.y + item2.height)) {
        //if distance on x is greater than distance on y
        if(Math.abs((item1.x + item1.width/2) - (item2.x + item2.width/2))
          > Math.abs((item1.y + item1.height/2) - (item2.y + item2.height/2))) {
          if(item1.x + item1.width/2 < item2.x + item2.width/2) {
            onCollision("right", item1, item2);
          } else {
            onCollision("left", item1, item2);
          }
        } else {
          if(item1.y + item1.height/2 < item2.y + item2.height/2) {
            onCollision("top", item1, item2);
          } else {
            onCollision("bottom", item1, item2);
          }
        }

      
      
    }
  }

  function drawGameItems() {
    //the x/y is the center of the object
    //will draw with that in mind
    $(`#${ball.id}`).css("left", `${ball.x - ball.width/2}px`)
                    .css("top", `${ball.y - ball.height/2}px`);
    $(`#${paddle1.id}`).css("left", `${paddle1.x - paddle1.width/2}px`)
                       .css("top", `${paddle1.y - paddle1.height/2}px`);
    $(`#${paddle2.id}`).css("left", `${paddle2.x - paddle2.width/2}px`)
                       .css("top", `${paddle2.y - paddle2.height/2}px`);

    $("#score1").text(paddle1.score);
    $("#score2").text(paddle2.score);
  }
  
  function resetItems() {
    //ball
    for(let ball of balls) {
      ball = new Ball(WIDTH/2, HEIGHT/2, ball.id);
    }
    
    //paddle1
    paddle1.y = HEIGHT/2;
    paddle1.x = 60;
    paddle1.movement = { //readd it
      moving: false,
      l: false,
      u: false,
      r: false,
      d: false
    };

    //paddle2
    paddle2.y = HEIGHT/2;
    paddle2.x = WIDTH - 60;
    paddle2.movement = { //readd it
      moving: false,
      l: false,
      u: false,
      r: false,
      d: false
    };
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
