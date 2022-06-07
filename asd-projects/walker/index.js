/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var FRICTION = 0.7;

  var KEY = {
    ENTER: 13,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };

  //adding in a placeholder because events are weird
  var MOVEMENT = {
    l: false,
    u: false,
    r: false,
    d: false
  }

  var walker = {
    id: "walker",
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
    speed: 3,
    moving: false
  };
  // Game Item Objects


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
    repositionGameItem(walker);
    redrawGameItem(walker, walker.posX, walker.posY);

    if(!walker.moving) {
      friction(walker, FRICTION);
    }
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    console.log(event.which)
    let temp = {x: walker.velX, y:walker.velY};
    if(event.which == KEY.ENTER) {
      console.log("enter");
    } else if(event.which == KEY.LEFT) {
      walker.velX = -walker.speed;
      MOVEMENT.l = true;
    } else if(event.which == KEY.UP) {
      walker.velY = -walker.speed;
      MOVEMENT.u = true;
    } else if(event.which == KEY.RIGHT) {
      walker.velX = walker.speed;
      MOVEMENT.r = true;
    } else if(event.which == KEY.DOWN) {
      walker.velY = walker.speed;
      MOVEMENT.d = true;
    }

    //long XOR
    if(((MOVEMENT.l || MOVEMENT.r) && !(MOVEMENT.l && MOVEMENT.r)) 
        || ((MOVEMENT.u || MOVEMENT.d) && !(MOVEMENT.u && MOVEMENT.d))) {
      walker.moving = true;
    }
  }

  function handleKeyUp(event) {
    // if(event.which == KEY.LEFT || event.which == KEY.UP || event.which == KEY.RIGHT || event.which == KEY.DOWN) {
    //   walker.moving = false;
    // }

    if(event.which == KEY.LEFT) {
      MOVEMENT.l = false;
    } else if(event.which == KEY.UP) {
      MOVEMENT.u = false;
    } else if(event.which == KEY.RIGHT) {
      MOVEMENT.r = false;
    } else if(event.which == KEY.DOWN) {
      MOVEMENT.d = false;
    }

    if(!((MOVEMENT.l || MOVEMENT.r) && !(MOVEMENT.l && MOVEMENT.r)) 
        || !((MOVEMENT.u || MOVEMENT.d) && !(MOVEMENT.u && MOVEMENT.d))) {
      walker.moving = false;
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function repositionGameItem(item) {
    item.posX += item.velX;
    item.posY += item.velY;
  }

  function redrawGameItem(item, x, y) {
    $(`#${item.id}`).css("left", x);
    $(`#${item.id}`).css("top", y);
  }

  function friction(item, mult=0.5) {
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
