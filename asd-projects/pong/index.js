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
  var balls = [];
  var [paddle1, paddle2] = [
    // {
    //   id: "ball",
    //   x: 0,
    //   y: 0,
    //   width: 10,
    //   height: 10,
    //   speed: 0.75,
    //   angle: 0
    // },
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
  function ball(x, y, idNum, speed = undefined) {
    //multi purpose parameters
    if(typeof idNum == "string") {
      this.id = idNum;
      this.idNum = parseFloat(idNum.replace(/ball/i, ''));
    } else if(idNum != undefined) {
      this.id = "ball" + idNum;
      this.idNum = idNum;
    }
    
    if($(`#${this.id}`).length === 0) {
      //couldn't find a matching ball
      console.log(`#${this.id}`);
      $(`<div id="${this.id}" class="ball"></div>`).appendTo("#board");
    }

    [this.x, this.y] = [x, y];
    [this.width, this.height] = [
      $(`#${this.id}`).width(),
      $(`#${this.id}`).height()
    ];
    //don't worry about this frn. ill deal with it later
    this.speed = speed ? speed : 1.5;
    this.angle = 
                (Math.random() < 0.5 ? -Math.PI / 2 : Math.PI / 2)    //picks a left or right direction
              + (Math.PI/4)                                         //tilts it by an eighth of a rotation
              + (Math.random() * (Math.PI / 2));                    //adds a random tilt less than a quarter rotation
    this.die = function() {
      let temp = [];
      $(`#${this.id}`).remove()
      for(let ball of balls) {
        if(ball !== this) {
          temp.push(ball);
        }
      }
      balls = temp;
    }
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
      for(let ball of balls) {
        updateGameItem(ball);
      }
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
        // if(side == "top") {
        //   object.velY = 0;
        //   object.y = 0;
        // }

        // if(side == "bottom") {
        //   object.velY = 0;
        //   object.y = HEIGHT - object.height;
        // }
      });
    } else if(true) {
      //the stuff for the ball

      //trig is fun
      object.x += Math.cos(object.angle) * object.speed * boardRatio * (1/PHYSICS_FRAMES);
      object.y += Math.sin(object.angle) * object.speed * boardRatio * (1/PHYSICS_FRAMES);

      // check collision and pass in/define function to be executed if true
      checkBoardCollision(object, function(side) {
        if(side == "top") {
          object.angle = -object.angle;
          // console.log(object.angle * (180 / Math.PI))
          // object.angle = 0;
        }

        if(side == "bottom") {
          object.angle = -object.angle;
          if(object.angle < Math.PI) {
          }
        }

        if(side == "left" || side == "right") {
          if(side == "left") {
            paddle2.score++;
          }

          if(side == "right") {
            paddle1.score++;
          }
          object.die();
          if(balls.length == 0) {
            resetItems();
          }
        }
      });

      checkItemItemCollision(object, paddle1, function(side, ball, paddle){
        console.log("paddle1", side);
        ball.angle += Math.PI/2;
        ball.angle *= -1;
        ball.angle -= Math.PI/2;
      });

      checkItemItemCollision(object, paddle2, function(side, ball, paddle){
        console.log("paddle2", side);
        ball.angle += Math.PI/2;
        ball.angle *= -1;
        ball.angle -= Math.PI/2;
        // ball.speed = 0;
        // ball.x = paddle.x - paddle.width/2 - ball.width/2;
      });
    }
  }

  function checkBoardCollision(item, onCollision) {
    if(item.y - item.height/2 < 0) {
      onCollision("top");
    }
    if(item.y + item.height/2 > HEIGHT) {
      onCollision("bottom");
    }
    if(item.x - item.width/2 < 0) {
      onCollision("left");
    }
    if(item.x + item.width/2 > WIDTH) {
      onCollision("right");
    }
  }

  function checkItemItemCollision(item1, item2, onCollision) {
    if((item1.x + item1.width/2 > item2.x - item2.width/2 && (item1.x - item1.width/2 < item2.x + item2.width/2))
      && (item1.y + item1.height/2 > item2.y - item2.height/2 && item1.y - item1.width/2 < item2.y + item2.height/2)) {        
        let distance = {
          right: Math.abs((item1.x + item1.width/2) - (item2.x - item2.width/2)),
          left: Math.abs((item1.x - item1.width/2) - (item2.x + item2.width/2)),
          top: Math.abs((item1.y + item1.height/2) - (item2.y - item2.height/2)),
          bottom: Math.abs((item1.y - item1.height/2) - (item2.y + item2.height/2))
        };
        let best;
        for(let side in distance) {
          if(!(distance[side] >= distance[best])) {
            best = side;
          }
        }
        onCollision(best, item1, item2);
    }
  }

  function drawGameItems() {
    //the x/y is the center of the object
    //will draw with that in mind
    for(let ball of balls) {
      $(`#${ball.id}`).css("left", `${ball.x - ball.width/2}px`)
                      .css("top", `${ball.y - ball.height/2}px`);
    }
    $(`#${paddle1.id}`).css("left", `${paddle1.x - paddle1.width/2}px`)
                       .css("top", `${paddle1.y - paddle1.height/2}px`);
    $(`#${paddle2.id}`).css("left", `${paddle2.x - paddle2.width/2}px`)
                       .css("top", `${paddle2.y - paddle2.height/2}px`);

    $("#score1").text(paddle1.score);
    $("#score2").text(paddle2.score);
  }
  
  function resetItems() {
    //ball
    for(let i in balls) {
      //might need to fix wackiness with i
      if(balls[i].id) {
        balls[i] = new ball(WIDTH/2, HEIGHT/2, balls[i].id);
      } else {
        balls[i] = new ball(WIDTH/2, HEIGHT/2, Number(balls[i].id));
      }
    }

    //could have 1 be variable like minBalls
    while(balls.length < 1) {
      balls.push(new ball(WIDTH/2, HEIGHT/2, balls.length));
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
