
let gVisArray = [];
let gVisIndex = 0;
let gTrialIndex = 0;
let gVis;
// const TRIALS = 20;
const TRIALS = 2;

let notFirstTrial = false;

let gResults;

function start()
{
    window.location.replace(window.location.href + "startExperiment");
}

function main()
{
    // new chart on enter
    window.addEventListener("keydown", enter, {passive: true});

    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Svg is used to make all the chart types
    let svg = d3.select("#vis")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    console.log("vid " +gVisIndex);

    // Create vis to test
    gVisArray.push(new BarChart(svg, width, height));
    gVisArray.push(new RadarChart(svg, width, height));
    gVisArray.push(new TreeMap(svg, width, height));

    // Create a new results instance for this trial
    gResults = new ResultsController();

    // First test (the form leads to new tests)
    makeNewChart();
}

function makeNewChart()
{
    if(notFirstTrial === true)
    {
        let answer = document.getElementById("answer").value;
        console.log(answer);
        if(answer === '')
        {
            document.getElementById("answer").style.backgroundColor = "red";
            return;
        }
    }

    // Check if the vis index needs to be reset
    if (gVisIndex === gVisArray.length)
    {
        gVisIndex = 0;

        if (gTrialIndex === TRIALS)
        {
            // Fetch answer and enter the result
            let answer = document.getElementById("answer").valueAsNumber;
            gResults.enterResult(gVis.type, gVis.answer, answer);

            // Saves the result
            gResults.saveResult();

            // should not be active on the end page
            window.removeEventListener("keydown", enter, {passive: true});

            // Ends the test, redirects users
            //window.location.replace("endExperiment");
        }
        else
        {
            gTrialIndex++;
        }
    }
    // make the new vis with the current index

    // first trial will not have an input
    if (notFirstTrial)
    {
        // Fetch answer and enter the result
        let answer = document.getElementById("answer").valueAsNumber;
        gResults.enterResult(gVis.type, gVis.answer, answer);
        console.log(gVis);

        // Update needs to happen after previous answer is recorded
        gVis = gVisArray[gVisIndex];
    }
    else
    {
        gVis = gVisArray[gVisIndex];
    }

    notFirstTrial = true;

    // remove current vis
    gVis.remove();

    // make the new vis with random values and make
    gVis.newRandom();
    gVis.make();

    // Clear answer field
    document.getElementById("answer").value = '';

    gVisIndex++;
}


function enter(event)
{
    if(event.key)
    {
        document.getElementById("answer").style.backgroundColor = "";
    }

    if (event.key === 'Enter')
    {
        makeNewChart();
    }
}
