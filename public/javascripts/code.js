let margin = { top: 10, bottom: 10, left: 10, right: 10 };

//colorSet = ["#6e40aa", "#9b3db3", "#c83dac", "#ee4395", "#ff5375", "#ff6b53", "#ff8c38", "#e8b02e", "#c9d33a", "#aff05b"]
var colorSet = ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"]

let width = 960;
width = width - margin.left - margin.right;

let mapRatio = 0.5;
let height = width * mapRatio;
let active = d3.select(null);

let currentId = 0;

let globalPopulation = { "Alabama": 4779736, "Alaska": 710231, "Arizona": 6392017, "Arkansas": 2915918, "California": 37253956, "Colorado": 5029196, "Connecticut": 3574097, "Delaware": 897934, "District of Columbia": 601723, "Florida": 18801310, "Georgia": 9687653, "Hawaii": 1360301, "Idaho": 1567582, "Illinois": 12830632, "Indiana": 6483802, "Iowa": 3046355, "Kansas": 2853118, "Kentucky": 4339367, "Louisiana": 4533372, "Maine": 1328361, "Maryland": 5773552, "Massachusetts": 6547629, "Michigan": 9883640, "Minnesota": 5303925, "Mississippi": 2967297, "Missouri": 5988927, "Montana": 989415, "Nebraska": 1826341, "Nevada": 2700551, "New Hampshire": 1316470, "New Jersey": 8791894, "New Mexico": 2059179, "New York": 19378102, "North Carolina": 9535483, "North Dakota": 672591, "Ohio": 11536504, "Oklahoma": 3751351, "Oregon": 3831074, "Pennsylvania": 12702379, "Rhode Island": 1052567, "South Carolina": 4625364, "South Dakota": 814180, "Tennessee": 6346105, "Texas": 25145561, "Utah": 2763885, "Vermont": 625741, "Virginia": 8001024, "Washington": 6724540, "West Virginia": 1852994, "Wisconsin": 5686986, "Wyoming": 563626 };

let statesShootingColor = d3.scaleLinear()
    .domain([0, 635])
    .range([colorSet[6], colorSet[0]]);

let scaleProportionShootingsPerState;

// Now we need to gather all the data and we set it them in a dataset with the id os the state as the key
let numberOfMassShooting = 0;
let maxNumberMassShootingPerState = 0;
let dataset = {};
let dataset2 = {};
let fips;

let capitals = {};

let tableFirstId = 0;

let bigData;

d3.json('data/fipsToState.json').then(function (data) {
    fips = data;

    d3.csv('data/Mass_shooting.csv').then(function (data2) {
        bigData = data2;
    });
    d3.json('data/capital.json').then(function (capitalData) {
        capitalData.states.forEach(function (d) {
            capitals[Number(fips[d.name])] = [d.long, d.lat];
        });
    });
    return data;


}).then(function (fips) {

    d3.json("data/mass-shootings-in-america.json").then(function (data) {

        // Get the number of mass shootings
        numberOfMassShooting = bigData.length;

        // Populate the dataset
        bigData.forEach(function (d) {
            if (dataset2.hasOwnProperty(Number(fips[d.State]))) {
                dataset2[Number(fips[d.State])].push(d);
            } else {
                dataset2[Number(fips[d.State])] = [d];
            }
        });
        data.forEach(function (d) {
            if (dataset.hasOwnProperty(Number(fips[d.fields.state]))) {
                dataset[Number(fips[d.fields.state])].push(d);
            } else {
                dataset[Number(fips[d.fields.state])] = [d];
            }
        });

        // Get the max number of shootings
        for (let id in dataset2) {
            if (dataset2[id].length > maxNumberMassShootingPerState) {
                maxNumberMassShootingPerState = dataset2[id].length;
            }
        }

        // Make the scaling method to get the size of the dot fo mass shootings
        scaleProportionShootingsPerState = d3.scaleSqrt().domain([0, maxNumberMassShootingPerState]).range([1, 20]);

        Promise.resolve(d3.json('javascripts/us.json')).then(ready);
    });
});

// SVGs

// Size of the differents elements
let box = document.querySelector('.barchart');
let bwidth = box.clientWidth;
let bheight = box.clientHeight;

let map_box = document.querySelector('.map');
let map_width = box.clientWidth;
let map_height = box.clientHeight;

let pie_box = document.querySelector('.pie1');
let pie_width = pie_box.clientWidth;
let pie_height = pie_box.clientHeight;

let svgBarChart = d3.select('.barchart').append('svg')
    .attr('class', 'center-container')
    .attr('height', bheight)
    .attr('width', bwidth)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let svgMap = d3.select('.map').append('svg')
    .attr('class', 'center-container')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr('x', 0)
    .attr('y', 0);

svgMap.append('rect')
    .attr('class', 'background center-container')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)

let svgPie1 = d3.select('.pie1').append('svg')
    .attr('height', pie_height)
    .attr('width', pie_width)
    .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height * 0.45 + ")");

let svgPie2 = d3.select('.pie2').append('svg')
    .attr('height', pie_height)
    .attr('width', pie_width)
    .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height * 0.45 + ")");

let svgPie3 = d3.select('.pie3').append('svg')
    .attr('height', pie_height)
    .attr('width', pie_width)
    .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height * 0.45 + ")");

let projection = d3.geoAlbersUsa()
    .translate([map_width, map_height / 2.5])
    .scale(map_height * 1.8);

let path = d3.geoPath().projection(projection);

let g = svgMap.append("g")
    .attr('class', 'center-container center-items us-state')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', map_width)
    .attr('height', map_height);

function ready(us) {

    let maxShooting = 0;
    let shooting;

    let globalShooting = {}

    for (const [key, value] of Object.entries(dataset2)) {
        shooting = 0
        value.forEach(function (d) {
            if (d["Total victims"] != "") {
                shooting += parseInt(d["Total victims"])
            }
        });
        if (shooting > maxShooting) {
            maxShooting = shooting
        }
        if (value[0]["State"] != "") {
            globalShooting[value[0]["State"]] = shooting;
        }
    }

    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county-boundary")
        .on("click", reset)
        .on('mouseover', function (d) {
            drawPieCharts(currentID);
            showBarChart(currentId);
        });

    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr('fill', function (d) {

            // If the id's are 72 or 78 we pass because it is Puerto Rico and United States Virgin Islands
            if (!(d.id === 72 || d.id === 78)) {
                if (d.id < 10) {
                    return statesShootingColor(globalShooting[getKeyByValue(fips, "0" + d.id)]);
                } else {
                    return statesShootingColor(globalShooting[getKeyByValue(fips, "" + d.id)]);
                }
            }
        })
        .attr("d", path)
        .attr("class", "state")
        .on("click", clicked)

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);

    // Legend plot
    g.append("text")
        .attr('y', function (d) {
            return g.node().getBBox().height + 50;
        })
        .style('font-style', 'italic');

    g.append("text")
        .attr('x', 30)
        .attr('y', map_height / 2)
        .text("0")
        .style('font-size', '12px');

    g.append("text")
        .attr('x', 170)
        .attr('y', map_height / 2)
        .text(maxShooting)
        .style('font-size', '12px');

    g.append("text")
        .attr('id', 'legendDensity')
        .attr('x', 45)
        .attr('y', map_height / 2 + 45)
        .text("Number of victims");

    let rangeColorToPos = d3.scaleLinear()
        .range([0, d3.select("#legendDensity").node().getBBox().width])
        .domain([0, maxShooting]);

    let rangeColor = d3.range(0, maxShooting, 2);
    g.selectAll('rect')
        .data(rangeColor)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return 45 + rangeColorToPos(d);
        })
        .attr('width', 11)
        .attr('height', 15)
        .style('fill', function (d) {
            return statesShootingColor(d);
        })
        .attr('y', map_height / 2 + 10);

    drawPieCharts(0);
    showBarChart(0);
}

function mouseOver(d) {
    drawPieCharts(d.id);
    showBarChart(d.id);
}

function mouseOut(d) {
    drawPieCharts(0);
    showBarChart(0);
}

function clicked(d) {
    console.log(d.id)
    currentId = d.id;
    drawPieCharts(d.id);
    showBarChart(d.id);
}

function reset() {
    currentId = 0;
    drawPieCharts(0);
    showBarChart(0);
}

function clicked_pie1(d) {

    drawPieCharts(currentId);

    svgPie1.append('g').append("text")
        .text(d.data.key + " : " + d.data.value)
        .attr("transform", `translate(${0}, ${pie_height * 0.45})`)
        .style("text-anchor", "middle")

}

function clicked_pie2(d) {

    drawPieCharts(currentId);

    svgPie2.append('g').append("text")
        .text(d.data.key + " : " + d.data.value)
        .attr("transform", `translate(${0}, ${pie_height * 0.45})`)
        .style("text-anchor", "middle")

}

function clicked_pie3(d) {

    drawPieCharts(currentId);

    svgPie3.append('g').append("text")
        .text(d.data.key + " : " + d.data.value)
        .attr("transform", `translate(${0}, ${pie_height * 0.45})`)
        .style("text-anchor", "middle")

}


//Mental Health issues
//Cause of the shooting
//Race of the shooter
function drawPieCharts(id) {

    svgPie1.selectAll("*").remove();
    svgPie2.selectAll("*").remove();
    svgPie3.selectAll("*").remove();

    dataCause = {}
    dataRace = {}
    dataMental = { "Yes": 0, "No": 0, "Unknown": 0 }

    if (id === 0) {
        dataToLoop = bigData;
    } else {
        if (!dataset[id]) { return; }
        dataToLoop = dataset2[id];
    }

    dataToLoop.forEach(function (d) {
        if (d.Target === 'Random') {
            if (dataCause[d["Cause"]]) {
                dataCause[d["Cause"]] += 1;
            } else {
                if (d["Cause"] == "") {
                    if (dataCause["unknown"]) {
                        dataCause["unknown"] += 1;
                    } else {
                        dataCause["unknown"] = 1;
                    }
                } else {
                    dataCause[d["Cause"]] = 1;
                }
            }

            if (dataRace[d["Race"]]) {
                dataRace[d["Race"]] += 1;
            } else {
                if (d["Race"] == "") {
                    if (dataRace["Unknown"]) {
                        dataRace["Unknown"] += 1;
                    } else {
                        dataRace["Unknown"] = 1;
                    }
                } else {
                    dataRace[d["Race"]] = 1;
                }
            }

            if (d["Mental Health Issues"] === "Yes") {
                dataMental["Yes"] += 1
            } else if (d["Mental Health Issues"] === "No") {
                dataMental["No"] += 1
            } else {
                dataMental["Unknown"] += 1
            }
        }
    });

    if (dataMental["Yes"] === 0) {
        if (dataMental["No"] === 0) {
            if (dataMental["Unknown"] === 0) {
                return;
            }
        }
    }



    let radius = pie_height / 2;
    var pie = d3.pie().value(function (d) { return d.value; })
        .sort(function (a, b) { return d3.descending(a.value, b.value); })

    var data_ready_Mental = pie(d3.entries(dataMental))
    var data_ready_Cause = pie(d3.entries(dataCause))
    var data_ready_Race = pie(d3.entries(dataRace))
    
    var colorMental = d3.scaleOrdinal()
        .domain(data_ready_Mental)
        .range(colorSet)

    var colorCause = d3.scaleOrdinal()
        .domain(data_ready_Cause)
        .range(colorSet)

    var colorRace = d3.scaleOrdinal()
        .domain(data_ready_Race)
        .range(colorSet)

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

    var arc = d3.arc()
        .innerRadius(radius * 0.2)
        .outerRadius(radius * 0.8)

    var path = svgPie1.selectAll('mySlices')
        .data(data_ready_Mental)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return (colorMental(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .on("click", clicked_pie1)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '0.75');
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
        })


    path.exit()
        .remove()

    svgPie1.selectAll('mySlices')
        .data(data_ready_Mental)
        .enter()
        .append('text')
        .text(function (d) {
            if (d.data.value > 0) {
                return d.data.key
            } else {
                return ""
            }

        })
        .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 17)


    var lenght_Cause = 0

    for (const [key, value] of Object.entries(dataCause)) {
        lenght_Cause += value;
    }

    svgPie2.selectAll('mySlices')
        .data(data_ready_Cause)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return (colorCause(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .on("click", clicked_pie2)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '0.75');
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
        })

    svgPie2.selectAll('mySlices')
        .data(data_ready_Cause)
        .enter()
        .append('text')
        .text(function (d) {
            if (d.data.value > lenght_Cause / 7) {
                return d.data.key
            } else {
                return ""
            }

        })
        .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 17)

    var lenght_Race = 0

    for (const [key, value] of Object.entries(dataRace)) {
        lenght_Race += value;
    }

    svgPie3.selectAll('mySlices')
        .data(data_ready_Race)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return (colorRace(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .on("click", clicked_pie3)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '0.75');
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
        })

    svgPie3.selectAll('mySlices')
        .data(data_ready_Race)
        .enter()
        .append('text')
        .text(function (d) {
            if (d.data.value > lenght_Race / 7) {
                return d.data.key
            } else {
                return ""
            }

        })
        .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .style("font-size", 17)
}


// 4 Charts

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function showBarChart(stateId) {

    svgBarChart.selectAll("*").remove();

    let theData;

    if (stateId === 0) {
        theData = bigData;
    } else {
        theData = dataset2[stateId];
    }

    // If there is no shooting we return
    //if (!theData || theData.length === 0) {
    //    return;
    //}

    let dataToDisplay = [];
    let shootingsPerTarget = {};
    let Target;


    theData.forEach(function (d) {

        Target = d['Target'];

        if (stateId === 0) {
            if (shootingsPerTarget[Target]) {
                shootingsPerTarget[Target]++;
            } else {
                shootingsPerTarget[Target] = 1;
            }
        } else {

            if (shootingsPerTarget[Target]) {
                shootingsPerTarget[Target]++;
            } else {
                shootingsPerTarget[Target] = 1;
            }
        }
    });

    let other = 0;

    if (stateId === 0) {

        for (key in shootingsPerTarget) {
            if (key === '') {
                other = other + shootingsPerTarget[key]
            } else {
                if (shootingsPerTarget != null) {
                    if (shootingsPerTarget[key] >= 5) {
                        dataToDisplay.push({ Target: key, value: shootingsPerTarget[key] });

                    } else {
                        other = other + shootingsPerTarget[key]
                    }
                } else {
                    other = other + shootingsPerTarget[key]
                }
            }

        }
        dataToDisplay.push({ Target: "Other", value: other });
    } else {
        for (key in shootingsPerTarget) {

            if (shootingsPerTarget != null) {
                if (key === '') {
                    other = other + shootingsPerTarget[key]
                } else {
                    dataToDisplay.push({ Target: key, value: shootingsPerTarget[key] });
                }
            }
        }
        if (other != 0) {
            dataToDisplay.push({ Target: "Other", value: other });
        }
    }

    let colorScaleChart = d3.scaleLinear().domain([1, d3.max(dataToDisplay, d => { return d.value; })]).range(['orange', 'red']);
    let barColor = d3.interpolateInferno(0.1);
    let highlightColor = d3.interpolateInferno(0.3);


    let max = 0;
    dataToDisplay.forEach(element => {

        if (element['value'] > max) {
            max = element['value']
        }
    });

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, max + 1])
        .range([0, bwidth * 0.75]);
    svgBarChart.append("g")
        .attr("transform", `translate(${bwidth * 0.18}, ${bheight * 0.9})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .range([0, bheight * 0.8])
        .domain(dataToDisplay.map(d => d.Target))
        .padding(.1);
    svgBarChart.append("g")
        .attr("transform", `translate(${bwidth * 0.18}, ${bheight * 0.1})`)
        .call(d3.axisLeft(y))

    //Bars
    svgBarChart.selectAll("myRect")
        .data(dataToDisplay)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.Target))
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth() * 0.75)
        .attr("fill", colorSet[1])
        .attr("transform", `translate(${bwidth * 0.18}, ${bheight * 0.1})`);

    // Labels
    svgBarChart.selectAll(".label")
        .data(dataToDisplay)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => { return d.value === null ? "none" : null; })
        .style('opacity', 0.9)
        .attr("y", (d => { return y(d.Target) + (y.bandwidth() / 2) + 14; }))
        .attr("x", d => { return height * 0.7; })
        .attr("height", 0)
        .text(d => { return d.value; })
        .attr("x", d => { return x(d.value) + .1; })
        .attr("dy", "-.7em")
        .attr("transform", `translate(${bwidth * 0.18}, ${bheight * 0.1})`);

    svgBarChart.append('g').append("text")
        .attr("transform", `translate(${bwidth * 0.5 - margin.left}, ${bheight * 0.05})`)
        .style("text-anchor", "middle")
        .attr('y', function (d) {
            return 0;
        })
        .text(function (d) {
            if (stateId === 0) {
                return "Number of mass shooting per target type in the US";
            }
            if (stateId < 10) {
                return "Targets of mass shooting in " + getKeyByValue(fips, "0" + stateId);
            }
            return "Targets of mass shooting in " + getKeyByValue(fips, "" + stateId);
        }).attr('x', function () {
            return 0;
        });

}
