/* IMPORTANT VALUES

This section contains a list of all variables predefined for you to use (that you will need)

The CSS ids you will work with are:

1. bubbleCounter -- the container for the counter text for bubble sort
2. quickCounter  -- the container for the counter text for quick sort

*/

///////////////////////////////////////////////////////////////////////
/////////////////////// YOUR WORK GOES BELOW HERE /////////////////////
///////////////////////////////////////////////////////////////////////

// TODO 2: Implement bubbleSort
async function bubbleSort(arr) {
    //iterate through arr until last item
    for(let i = 0; i < arr.length - 1; i++) {
        //iterate from the end to the current index
        for(let j = arr.length - 1; j > i + 1; j--) {
            if(arr[j].value < arr[j - 1].value) {
                swap(arr, j, j - 1);
                //+1 counter and wait for the next step
                updateCounter(bubbleCounter);
                await sleep();
            }  
        }
    }
}

// TODO 3: Implement quickSort
async function quickSort(arr, left, right) {
    if(right - left > 0) {
        let index = await partition(arr, left, right);
        if(left < index - 1) {
            await quickSort(arr, left, index - 1);
        }
        if(right > index) {
            await quickSort(arr, index, right);
        }
    } else {
        return;
    }
}

// TODOs 4 & 5: Implement partition
async function partition(arr, left, right) {
    //decide pivot
    let pivot = arr[Math.floor((right + left)/2)].value;
    //move left and right
    while(left < right) {
        while(arr[left].value < pivot) {
            left++;
        }
        while(arr[right].value > pivot) {
            right--;
        }
        if(left < right) {
            swap(arr, left, right);
            updateCounter(quickCounter);
            await sleep();
        }
    }
    return left + 1;
}

// TODO 1: Implement swap
function swap(arr, i, j) {
    //make a placeholder
    let temp = arr[i];
    //swap
    arr[i] = arr[j];
    arr[j] = temp;
    //render the swap
    drawSwap(arr, i, j);
}


///////////////////////////////////////////////////////////////////////
/////////////////////// YOUR WORK GOES ABOVE HERE /////////////////////
///////////////////////////////////////////////////////////////////////

//////////////////////////// HELPER FUNCTIONS /////////////////////////

// this function makes the program pause by SLEEP_AMOUNT milliseconds whenever it is called
function sleep(){
    return new Promise(resolve => setTimeout(resolve, SLEEP_AMOUNT));
}

// This function draws the swap on the screen
function drawSwap(array, i, j){
    let element1 = array[i];
    let element2 = array[j];

    let temp = parseFloat($(element1.id).css("top")) + "px";

    $(element1.id).css("top", parseFloat($(element2.id).css("top")) + "px");
    $(element2.id).css("top", temp);
}

// This function updates the specified counter
function updateCounter(counter){
    $(counter).text("Move Count: " + (parseFloat($(counter).text().replace(/^\D+/g, '')) + 1));
}