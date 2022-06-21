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

  //some one line code to get the board width/height
  const WIDTH = Number($("#board").css("width").replace("px", ''));
  const HEIGHT = Number($("#board").css("height").replace("px", ''));

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
  var [ball, paddle1, paddle2] = [
    {
      id: "ball",
      x: 0,
      y: 0,
      speed: 1,
      //gets a random angle between 0 and 2pi
      angle: Math.random() * (2*Math.PI)
    },
    {
      id: "paddle1",
      width: 10,
      height: 100,
      x: 0,
      y: 0,
      speed: 1,
      movement: {
        moving: false,
        l: false,
        u: false,
        r: false,
        d: false
      }
    },
    {
      id: "paddle2",
      width: 10,
      height: 100,
      x: 0,
      y: 0,
      speed: 1,
      movement: {
        moving: false,
        l: false,
        u: false,
        r: false,
        d: false
      }
    }
  ];
  


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
    let boardRatio = HEIGHT/100;
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
    } else if(true) {
      //the stuff for the ball
    }
    //reposition first to stop spazzy collisions
    // drawGameItem(object);


    //check collision and pass in/define function to be executed if true
    // checkBoardCollision(walker, function(side) {
    //   if(side == "top") {
    //     walker.velY = 0;
    //     walker.posY = 0;
    //   }

    //   if(side == "bottom") {
    //     walker.velY = 0;
    //     walker.posY = board.height - walker.height;
    //   }

    //   if(side == "left") {
    //     walker.velX = 0;
    //     walker.posX = 0;
    //   }

    //   if(side == "right") {
    //     walker.velX = 0;
    //     walker.posX = board.width - walker.width;
    //   }
    // });

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

  function drawGameItems() {
    //the x/y is the center of the object
    //will draw with that in mind
    $(`#${ball.id}`).css("left", `${ball.x - ball.width/2}px`)
                       .css("top", `${ball.y - ball.height/2}px`);
    $(`#${paddle1.id}`).css("left", `${paddle1.x - paddle1.width/2}px`)
                       .css("top", `${paddle1.y - paddle1.height/2}px`);
    $(`#${paddle2.id}`).css("left", `${paddle2.x - paddle2.width/2}px`)
                       .css("top", `${paddle2.y - paddle2.height/2}px`);
  }
  
  function resetItems() {
    //ball
    ball.x = WIDTH/2;

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
