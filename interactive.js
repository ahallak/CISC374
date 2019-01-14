//about javascript synchronous/asynchronous
//https://stackoverflow.com/questions/2035645/when-is-javascript-synchronous
//as a note, setTimeout does NOT stop the code below it from running.
/***************
 *  CONSTANTS  *
 ***************/

//sets the [default] range of values for random number generation
const MIN = 0;
const MAX = 1;

//sets the [default] size of our matrix of data
const ROWS = 10;
const COLS = 10;

//sets how long the visuals will be displayed
const WAIT_MILLIS = 5000;

//name of the DOM element where we're putting our visuals
const PLOT_NAME = 'graph';

//defines which graphs we plot
const PLOTS = [
    plotRandTable,
    plotRandAnnotatedHeatmap
];

//for ordering async events
const EVENT_QUEUE = [];

/***************
 *  FUNCTIONS  *
 ***************/

// generates a random int between min and max
function randGen(min, max)
{
    return Math.round(Math.random() * (max-min) + min);
}

// Generates a rows by cols matrix of ints between min and max
function matrixGen(co, ro, min, max)
{
    var matrix = [];

    for (let i = 0; i < co; i++)
        {
            temp = [];
            for (let j = 0; j < ro; j++)
            {
                temp.push(randGen(min,max));
            }
            matrix.push(temp);
        }

    return matrix;
}

//plots a table of default size in the default range
function plotRandTable(name) {
    console.log('plotRandTable called');    

    //original
    //var valueArray = matrixGen(COLS, ROWS, MIN, MAX);

    //avoiding empty header
    var valueArray = matrixGen(COLS, ROWS-1, MIN, MAX);
    var valueHeader = [];
    for (j = 0; j < 10; j++) {
        valueHeader.push([randGen(0,1)]);
    }

    var tableParams = [{
            type: 'table',
            header: {
                //values: [], //original
                values: valueHeader, //avoiding empty header
                align: "center",
                line: {width: 1, color: 'black'},
                fill: {color: "white"},
                font: {family: "Arial", size: 11, color: "black"},
                height: 20
            },
        cells: {
            values: valueArray,
            align: "center",
            line: {color: "black", width: 1},
            font: {family: "Arial", size: 11, color: ["black"]},
            height: 20
        }
    }]

    Plotly.plot(name, tableParams);
}

//plots an annotated heatmap that looks like a table
function plotRandAnnotatedHeatmap(name) {
    console.log('plotRandAnnotatedHeatmap called');

    //the actual values we want to display
    var matrix = matrixGen(ROWS, COLS, MIN, MAX);

    //make all the backgrounds pure white (can change later)
    var colorscaleValue = [
        [0, '#ffffff'],
        [1, '#ffffff']
    ];

    var data = [{
        z: matrix,
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: false
    }];

    //set up all the settings for the heatmap
    var layout = {
        annotations: [],
        xaxis: {
            ticks: '',
            side: 'top',
            showgrid: true,
            showline: false,
            showzeroline: false,
            showticklabels: false
        },
        yaxis: {
            ticks: '',
            ticksuffix: ' ',
            width: 700,
            height: 700,
            autosize: false,
            showgrid: true,
            showline: false,
            showzeroline: false,
            showticklabels: false
        }
    };

    //set all the actual annotations
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            var result = {
                x: j,
                y: i,
                text: matrix[i][j],
                font: {
                    family: 'Arial',
                    size: 12,
                    color: 'rgb(50, 171, 96)'
                },
                showarrow: false,
                font: {
                    color: 'black'
                }
            };
            layout.annotations.push(result);
        }
    }

    Plotly.newPlot(name, data, layout);
}	

//clears visuals and adds the option to give user input
//input may need to be reworked/given more names, 
//etc to put it in a table
clearVis = function(name) 
{
    Plotly.purge(name);
    document.getElementById('userinput').innerHTML = "<div><label>Your guess here: </label><input type=\"text\" id=\"usertext\"></div><div><button id=\"userclick\" onclick = \"offerInput();\">Submit</button></div>";
}

//when the user clicks submit, this function is called.
offerInput = function() {
    var inputobj = document.getElementById('usertext').value;
    //some sort of input cleansing???
    //do something with this thing... record it?
    alert(inputobj);
    document.getElementById('userinput').innerHTML = "";

    //repeat it all 
    // Joy - not sure if this is the best way to do this,
    //       but it'll work for now'
    //main();

    //run the next event we have queued up
    var runNext = EVENT_QUEUE.shift();
    if (runNext != null) {
        runNext();
    }
}

function plotVis(plot) {
    plot(PLOT_NAME);

    //delete the plot after WAIT_MILLIS
    setTimeout(() => clearVis(PLOT_NAME),
                WAIT_MILLIS);
}

/***************
 *  MAIN BODY  *
 ***************/

function main() {
    //add all of our ploting events to the queue
    for (let i = 0; i < PLOTS.length; i++) {
        let plot = PLOTS[i];
        EVENT_QUEUE.push(() => plotVis(plot));
    }

    console.log(PLOTS);
    console.log(EVENT_QUEUE);

    //start the first event
    var runNext = EVENT_QUEUE.shift();
    runNext();


    /* 
    plotRandAnnotatedHeatmap(PLOT_NAME);	
    
    //delete the table after WAIT_MILLIS
    setTimeout(() => clearVis(PLOT_NAME), WAIT_MILLIS);
    */
}
