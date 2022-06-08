/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var FRICTION = 0.9;

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
  var board = {
    id: "board",
    width: 440,
    height: 440
  }

  //uses ARROWS
  var walker1 = {
    id: "walker1",
    width: 50,
    height: 50,
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
    speed: 3,
    //events are weird. Makes movement accurate
    movement: {
      moving: false,
      l: false,
      u: false,
      r: false,
      d: false
    }
  };

  //uses WASD
  var walker2 = {
    id: "walker2",
    width: 50,
    height: 50,
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
    speed: 3,
    //events are weird. Makes movement accurate
    movement: {
      moving: false,
      l: false,
      u: false,
      r: false,
      d: false
    }
  };
  //set walker2 placement
  walker2.posX = board.width - walker2.width;
  walker2.posY = board.height - walker2.height;

  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);                          // change 'eventType' to the type of event you want to handle

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    //could make a for loop if adding more walkers
    updateWalker(walker1);
    redrawGameItem(walker1, walker1.posX, walker1.posY);

    updateWalker(walker2);
    redrawGameItem(walker2, walker2.posX, walker2.posY);
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if(event.which == KEY.ENTER) {
      //doesnt do anything
    }
    
    //walker1
    if(event.which == KEY.LEFT) {
      walker1.movement.l = true;
    } else if(event.which == KEY.UP) {
      walker1.movement.u = true;
    } else if(event.which == KEY.RIGHT) {
      walker1.movement.r = true;
    } else if(event.which == KEY.DOWN) {
      walker1.movement.d = true;
    }

    //walker2
    if(event.which == KEY.A) {
      walker2.movement.l = true;
    } else if(event.which == KEY.W) {
      walker2.movement.u = true;
    } else if(event.which == KEY.D) {
      walker2.movement.r = true;
    } else if(event.which == KEY.S) {
      walker2.movement.d = true;
    }
  }

  function handleKeyUp(event) {
    //walker1
    if(event.which == KEY.LEFT) {
      walker1.movement.l = false;
    } else if(event.which == KEY.UP) {
      walker1.movement.u = false;
    } else if(event.which == KEY.RIGHT) {
      walker1.movement.r = false;
    } else if(event.which == KEY.DOWN) {
      walker1.movement.d = false;
    }

    //walker2
    if(event.which == KEY.A) {
      walker2.movement.l = false;
    } else if(event.which == KEY.W) {
      walker2.movement.u = false;
    } else if(event.which == KEY.D) {
      walker2.movement.r = false;
    } else if(event.which == KEY.S) {
      walker2.movement.d = false;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function updateWalker(walker) {
    //could make this function built into the walker objects
    if(walker.movement.l && walker.movement.r) {
      //do nothing
    } else if(walker.movement.l) {
      walker.velX = -walker.speed;
    } else if(walker.movement.r) {
      walker.velX = walker.speed;
    }

    if(walker.movement.u && walker.movement.d) {
      //do nothing
    } else if(walker.movement.u) {
      walker.velY = -walker.speed;
    } else if(walker.movement.d) {
      walker.velY = walker.speed;
    }
    //reposition first to stop spazzy collisions
    repositionGameItem(walker);
    //check collision and pass in/define function to be executed if true
    checkBoardCollision(walker, function(side) {
      if(side == "top") {
        walker.velY = 0;
        walker.posY = 0;
      }

      if(side == "bottom") {
        walker.velY = 0;
        walker.posY = board.height - walker.height;
      }

      if(side == "left") {
        walker.velX = 0;
        walker.posX = 0;
      }

      if(side == "right") {
        walker.velX = 0;
        walker.posX = board.width - walker.width;
      }
    });
    //update movement check. could be used for sprites
    if(walker.velX !== 0 || walker.velY !== 0) {
      walker.movement.moving = true;
    } else {
      walker.movement.moving = false;
    }
    
    friction(walker);
  }
  
  
  function repositionGameItem(item) {
    item.posX += item.velX;
    item.posY += item.velY;
  }

  function redrawGameItem(item, x, y) {
    $(`#${item.id}`).css("left", x);
    $(`#${item.id}`).css("top", y);
  }

  function checkBoardCollision(item, onCollision) {
    if(item.posY < 0) {
      onCollision("top");
    }
    if(item.posY + item.height > board.height) {
      onCollision("bottom");
    }
    if(item.posX < 0) {
      onCollision("left");
    }
    if(item.posX + item.width > board.height) {
      onCollision("right");
    }
  }

  function friction(item, mult=FRICTION) {
    item.velX *= mult;
    item.velY *= mult;

    if(Math.abs(item.velX) < 0.01) {
      item.velX = 0;
    }

    if(Math.abs(item.velY) < 0.05) {
      item.velY = 0;
    }
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
