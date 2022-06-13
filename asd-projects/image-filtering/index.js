// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#smudge").on("click", ar_Smudge);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here
  applyFilterNoBackground(increaseGreenByBlue);
  applyFilter(decreaseBlue);
  applyFilterNoBackground(reddify);

  // do not change the below line of code
  render($("#display"), image);
}

function ar_Smudge() {
  applyFilter(smudge);
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2 & 4: Create the applyFilter function here
function applyFilter(filterFunction) {
  //have to do the long way here
  //es6 brings in the array methods
  for(let i = 0; i < image.length; i++) {
    for(let j = 0; j < image[i].length; j++) {
      //got rid of rgbString
      //i could get rid of rgbNumber too
      var rgbNumbers = rgbStringToArray(image[i][j]);
      filterFunction(rgbNumbers, i, j);
      image[i][j] = rgbArrayToString(rgbNumbers);
    }
  }
}

// TODO 7: Create the applyFilterNoBackground function
function applyFilterNoBackground(filterFunction) {
  var backgroundColor = image[0][0];
  for(let i = 0; i < image.length; i++) {
    for(let j = 0; j < image[i].length; j++) {
      if(image[i][j] != backgroundColor) {
        //got rid of rgbString
        //i could get rid of rgbNumber too
        var rgbNumbers = rgbStringToArray(image[i][j]);
        filterFunction(rgbNumbers, i, j);
        image[i][j] = rgbArrayToString(rgbNumbers);
      }
    }
  }
}

// TODO 5: Create the keepInBounds function
function keepInBounds(num) {
  return num < 0 ? 0
       : num > 255 ? 255
       : num;
}

// TODO 3: Create reddify function
function reddify(arr) {
  arr[RED] = 200;
}

// TODO 6: Create more filter functions
function decreaseBlue(arr) {
  arr[BLUE] = keepInBounds(arr[BLUE] - 50);
}

function increaseGreenByBlue(arr) {
  arr[GREEN] = keepInBounds(arr[BLUE] + arr[GREEN]);
}

// CHALLENGE code goes below here

function smudge(arr, x, y, val = 0.5) {
  //Fades away
  if(image[x][y+1]) {
    console.log(x, y);
    let arr2 = rgbStringToArray(image[x][y+1]);
    arr[RED] = arr2[RED] * val;
    arr[GREEN] = arr2[GREEN] * val;
    arr[BLUE] = arr2[BLUE] * val;
  }
}