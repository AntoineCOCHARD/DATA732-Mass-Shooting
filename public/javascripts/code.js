let margin = {top: 10, bottom: 10, left: 10, right:10};

let width = 960;
    width = width - margin.left - margin.right;

let mapRatio = 0.5;
let height = width * mapRatio;
let active = d3.select(null);

let currentId = 0;

let globalPopulation = {"Alabama":4779736,"Alaska":710231,"Arizona":6392017,"Arkansas":2915918,"California":37253956,"Colorado":5029196,"Connecticut":3574097,"Delaware":897934,"District of Columbia":601723,"Florida":18801310,"Georgia":9687653,"Hawaii":1360301,"Idaho":1567582,"Illinois":12830632,"Indiana":6483802,"Iowa":3046355,"Kansas":2853118,"Kentucky":4339367,"Louisiana":4533372,"Maine":1328361,"Maryland":5773552,"Massachusetts":6547629,"Michigan":9883640,"Minnesota":5303925,"Mississippi":2967297,"Missouri":5988927,"Montana":989415,"Nebraska":1826341,"Nevada":2700551,"New Hampshire":1316470,"New Jersey":8791894,"New Mexico":2059179,"New York":19378102,"North Carolina":9535483,"North Dakota":672591,"Ohio":11536504,"Oklahoma":3751351,"Oregon":3831074,"Pennsylvania":12702379,"Rhode Island":1052567,"South Carolina":4625364,"South Dakota":814180,"Tennessee":6346105,"Texas":25145561,"Utah":2763885,"Vermont":625741,"Virginia":8001024,"Washington":6724540,"West Virginia":1852994,"Wisconsin":5686986,"Wyoming":563626};

let minPopulation = globalPopulation['Alabama'];
let maxPopulation = globalPopulation['Alabama'];

for(key in globalPopulation) {
    if (globalPopulation[key] > maxPopulation) {
        maxPopulation = globalPopulation[key];
    }

    if (globalPopulation[key] < minPopulation) {
        minPopulation = globalPopulation[key];
    }
}

let statesPopulationColor = d3.scaleLinear()
    .domain([0, 635])
    .range(["#8BD9AD", '#ff0000']);


let scaleProportionShootingsPerState;
let scaleColor = d3.scaleLinear()
    .domain([0, 5, 10])
    .range(['#5c7658', '#e6d385', '#d25959']);

// Male, Female, Male/Female, Unknown
let colorsSex = {"Male" : "#00adb5", "Female" : '#ff2e63', "Unknown" : "#8785a2"};
let colorsRace = {"White" : "#00adb5", "Black" : '#ff2e63', "Asian" : '#fce38a', "Native" : "#8785a2", "Other" : "#758184"};

// Now we need to gather all the data and we set it them in a dataset with the id os the state as the key
let numberOfMassShooting = 0;
let maxNumberMassShootingPerState= 0;
let dataset = {};
let dataset2 = {};
let fips;

let capitals = {};

let tableFirstId = 0;

let bigData;
let bigData2;
let dataHAHAH

d3.json('data/fipsToState.json').then(function (data) {
    fips = data;

    d3.csv('data/Mass_shooting.csv').then(function (data2) {
        bigData2 = data2;
        dataHAHAH = data2
    });
    d3.json('data/capital.json').then(function (capitalData) {
        capitalData.states.forEach(function (d) {
            capitals[Number(fips[d.name])] = [d.long, d.lat];
        });
    });
    

    return data;


}).then(function (fips) {

    d3.json("data/mass-shootings-in-america.json").then(function (data) {

        // We store the Big data
        bigData = data;

        // Get the number of mass shootings
        numberOfMassShooting = dataHAHAH.length;

        // Populate the dataset
        dataHAHAH.forEach(function (d) {

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

let svgTitle = d3.select('.title').append('svg')
    .attr('class', 'center-container')
    .attr('height', 50)
    .attr('width', (width + width * 0.8) + 2 * margin.left + 2 * margin.right)
    .attr('x', 0)
    .attr('y', 0);

svgTitle.append('g')
    .append('text')
    .text('Mass Shootings repartition in the US')
    .style('font-size', '35px')
    .attr('x', function () {
        return (width + width * 0.8) / 2 - d3.select(this).node().getBBox().width / 2;
    })
    .attr('y', function () {
        return 50 - d3.select(this).node().getBBox().height / 2;
    });

let box = document.querySelector('.barchart');
let bwidth = box.clientWidth;
let bheight = box.clientHeight;

let map_box = document.querySelector('.map');
let map_width = box.clientWidth;
let map_height = box.clientHeight;
    
let pie_box = document.querySelector('.pie1');
let pie_width = box.clientWidth;
let pie_height = box.clientHeight;

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
    .on('click', clicked);



let svgPie1 = d3.select('.pie1').append('svg')
    .attr('height', pie_height)
    .attr('width', pie_width)
    .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height / 3 + ")");

let svgPie2 = d3.select('.pie2').append('svg')
    .attr('height', pie_height)
    .attr('width', pie_width)
    .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height /3 + ")");

let svgPie3 = d3.select('.pie3').append('svg')
.attr('height', pie_height)
.attr('width', pie_width)
    .append("g")
    .attr("transform", "translate(" + pie_width / 2 + "," + pie_height /3+ ")");


let projection = d3.geoAlbersUsa()
    .translate([width /1.7 , height / 2.2])
    .scale(map_width*1.5);

let path = d3.geoPath().projection(projection);




let g = svgMap.append("g")
    .attr('class', 'center-container center-items us-state')
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .attr('width', map_width)
    .attr('height', map_height);

function ready(us) {

    let count = 0;
    let step = 0;

    let maxShooting = 0;
    let shooting;

    let globalShooting = {}

    for (const [key, value] of Object.entries(dataset2)) {
        shooting = 0 
        value.forEach(function (d) {
            if (d["Total victims"] != "") {
                shooting +=  parseInt(d["Total victims"])
                
            }
        });
        if (shooting >maxShooting ) {
            maxShooting = shooting
        }
        if (value[0]["State"] != "") {
            globalShooting[value[0]["State"]] = shooting;
        }
      }
      console.log(globalShooting)

    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county-boundary")
        .on("click", reset)
        .on('mouseover', function (d) {
            tableFirstId = 0;
            //drawPieCharts2(getStateDataForPie(currentId));
            drawPieCharts(currentID);
            setViewLabel(currentId);
            showTable(currentId);
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
                    //console.log(globalPopulation[getKeyByValue(fips, "0" + d.id)]);
                    return statesPopulationColor(globalShooting[getKeyByValue(fips, "0" + d.id)]);
                } else {
                    //console.log(globalPopulation[getKeyByValue(fips, "" + d.id)]);
                    return statesPopulationColor(globalShooting[getKeyByValue(fips, "" + d.id)]);
                }
            }
        })
        .attr("d", path)
        .attr("class", "state")
        .on("click", clicked)
        .on("mouseover", mouseOver)
        .on('mouseout', mouseOut);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("id", "state-borders")
        .attr("d", path);

    // Legend plot
    g.append("text")
        .attr('y', function (d) {
            return g.node().getBBox().height + 50;
        })
        .style('font-style', 'italic')
        .text(function (d) {
            return "Map of the United States Of America representing number of victims of mass shootings per state";
        }).attr('x', function () {
            return 0;
        });

    // We plot the points representing the density of the mass shootings per states
    /*for (let id in dataset) {
        g.append("g").append("circle")
            .attr("fill", "red")
            .attr("stroke", "red")
            .attr("stroke-width", "2")
            .style("opacity", 0.5)
            .attr("r", function (d) {
                return scaleProportionShootingsPerState(dataset[id].length);
            })
            .attr("class", "statesPoints")
            .attr("cx", function (d) {
                return projection(capitals[Number(id)])[0];
            })
            .attr("cy", function (d) {
                return projection(capitals[Number(id)])[1];
            })
            .on('mouseover', function () {
                mouseOver({id : Number(id)});
            })
            .on('mouseout', reset());
    }*/

    // Then I need to make the scaling map

    

    g.append("text")
        .attr('x', 0)
        .attr('y', 0)
        .text("0")
        .style('font-size', '12px');

    g.append("text")
        .attr('x', 120)
        .attr('y', 0)
        .text(maxShooting)
        .style('font-size', '12px');


    g.append("text")
        .attr('id', 'legendDensity')
        .attr('x', 15)
        .attr('y', function (d) {
            return 45;
        })
        .text("Number of victims");

    let rangeColorToPos = d3.scaleLinear()
        .range([0, d3.select("#legendDensity").node().getBBox().width])
        .domain([0, maxShooting]);

    let rangeColor = d3.range(0, maxShooting, 2);
    g.selectAll('rect')
        .data(rangeColor)
        .enter()
        .append('rect')
        .attr('x', function(d) {
            return 15 + rangeColorToPos(d);
        })
        .attr('width', 11)
        .attr('height', 15)
        .style('fill', function(d) {
            return statesPopulationColor(d);
        })
        .attr('y', '10');

    tableFirstId = 0;
    //drawPieCharts2(getStateDataForPie(0));
    drawPieCharts(0);
    //setViewLabel(0);
    showBarChart(0);
}

function mouseOver(d) {
    tableFirstId = 0;
    //drawPieCharts2(getStateDataForPie(d.id));
    drawPieCharts(d.id);
    //setViewLabel(d.id);
    showBarChart(d.id);
}

function mouseOut(d) {
    tableFirstId = 0;
    //drawPieCharts2(getStateDataForPie(0));
    drawPieCharts(0);
    //setViewLabel(0);
    showBarChart(0);
}

function clicked(d) {

    currentId = 0;

    if (d3.select('.background').node() === this) return reset();

    if (active.node() === this) return reset();

    currentId = d.id;

    tableFirstId = 0;
    //drawPieCharts2(getStateDataForPie(d.id));
    drawPieCharts(d.id);
    setViewLabel(d.id);
    showTable(d.id);
    showBarChart(d.id);

    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    let bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    g.transition()
        .duration(1000)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

    d3.selectAll(".pointsToView").remove();

    // Now we need to show the points of where the mass shooting come from

    // If there is not shooting we abort
    if (dataset[d.id]) {
        dataset[d.id].forEach(function (data) {

            g.append("circle")
                .attr("fill", "red")
                .attr("r", 2)
                .attr("class", "pointsToView")
                .style("opacity", 0.5)
                .attr("cx", function (d) {
                    return projection(data.geometry.coordinates)[0];
                })
                .attr("cy", function (d) {
                    return projection(data.geometry.coordinates)[1]
                });
        });
    }

    // Hide the states dots
    d3.selectAll(".statesPoints").transition().duration(750).style('visibility', "hidden");
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    d3.selectAll(".pointsToView").transition().duration(750).remove();
    d3.selectAll(".statesPoints").transition().delay(750).duration(1500).style('visibility', "visible");

    g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr('transform', 'translate('+margin.left+','+margin.top+')');
}


let svgTitle2 = d3.select('.title2').append('svg')
    .attr('class', 'center-container')
    .attr('height', 50)
    .attr('width', (width + width * 0.8) + 2 * margin.left + 2 * margin.right)
    .attr('x', 0)
    .attr('y', 0);

svgTitle2.append('g')
    .append('text')
    .text("More informations about random targets' mass shootings")
    .style('font-size', '25px')
    .attr('x', function () {
        return (width + width * 0.8) / 2 - d3.select(this).node().getBBox().width / 2;
    })
    .attr('y', function () {
        return 50 - d3.select(this).node().getBBox().height / 2;
    });

// History of Mental Illness - General
// Type of Gun - General
// Shooter Race
// Shooter Sex

function drawPieCharts(id) {


    var data =  {a: 9, b: 20, c:30, d:8, e:12}

    var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

    if (!data) {
        return;
    }

    dataCause = {}
    dataMental = {"Yes": 0, "No": 0, "Unknown": 0}

    if (id === 0) {
        dataToLoop = bigData2;
    } else {
        if (!dataset[id]) {return;}
        dataToLoop = dataset2[id];   
    }

    dataToLoop.forEach(function (d) {
        if (d.Target === 'Random') {
            if(dataCause[d["Cause"]]) {
                dataCause[d["Cause"]] += 1;
            } else {
                if(d["Cause"] == "") {
                    if (dataCause["unknown"]) {
                        dataCause["unknown"] += 1;
                    } else {
                        dataCause["unknown"] = 1;
                    }
                } else {
                    dataCause[d["Cause"]] = 1;
                }
            }

            if (d["Mental Health Issues"] === "Yes") {
                dataMental["Yes"]+=1
            } else if (d["Mental Health Issues"] === "No") {
                dataMental["No"]+=1
            } else {
                dataMental["Unknown"]+=1
            }
        }
    });
    console.log(dataCause)

    var colorMental = d3.scaleOrdinal()
        .domain(dataMental)
        .range(["#5A60FA", "#77FA42", "#AD5024"])

    var colorCause = d3.scaleOrdinal()
        .domain(dataMental)
        .range(["#FFDA3B", "#E68C27", "#FA583C", "#E32BBD","#8130FB" ,"#9F3BFF" , "#274CE6","#3DE4FA","#2BE372","#89FB30" ])

    let radius = 100;
    var pie = d3.pie().value(function(d) {return d.value; }).sort(null);
    var data_ready = pie(d3.entries(data))

    var data_ready_Mental = pie(d3.entries(dataMental))
    var data_ready_Cause = pie(d3.entries(dataCause))

    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)


    svgPie1.selectAll("*").remove();
    svgPie2.selectAll("*").remove();
    svgPie3.selectAll("*").remove();

    svgPie1.selectAll('mySlices')
    .data(data_ready_Mental)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(colorMental(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

    svgPie1.selectAll('mySlices')
        .data(data_ready_Mental)
        .enter()
        .append('text')
        .text(function(d){ return d.data.key})
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
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
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(colorCause(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "1px")

    svgPie2.selectAll('mySlices')
        .data(data_ready_Cause)
        .enter()
        .append('text')
        .text(function(d){ 
            if (d.data.value > lenght_Cause/5) {
                return d.data.key
            } else {
                return ""
            }
            
            })
        .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
        .style("text-anchor", "middle")
        .style("font-size", 17)

    svgPie3.selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

}


// 4 Charts
function drawPieCharts2(data) {

    if (!data) {
        return;
    }

    let radius = 100;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let pie = d3.pie().value(function(d) {return d.value; }).sort(null);
    let arc = d3.arc().innerRadius(radius - 60).outerRadius(radius - 20);

    let g;
    let path;
    let text;
    let circle;

    let count = 0;

    svgGender.selectAll("*").remove();

    let max = 0;
    for(let key in data[0].data) {
        max += data[0].data[key].value;
    }

    for (let i = 0; i < 3; i++) {       

            g = svgGender.append("g")
                .attr('class', 'center-container')
                //.attr("transform", "translate(" + (radius * (2 * i + 1)) + "," + radius + ")")
                .attr("transform", "translate(" + (radius * (3 * i + 1)) + "," + (radius) + ")")
                .attr('width', width * 0.8 + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            path = g.datum(data[count].data).selectAll("path")
                .data(pie)
                .enter().append("path")
                .attr("fill", function(d, i) {

                    // Race
                    if (count === 2) {
                        return colorsRace[d.data.title];
                    }

                    // Sex
                    else if (count === 3) {
                        return colorsSex[d.data.title];
                    }
                    
                    return color(i);
                })
                .attr("d", arc)
                .on('mouseover', function (d) {
                    d3.select(this.parentNode).append('text')
                        .text(function () {
                            return (Math.round((d.value / max) * 100)).toFixed(2) + "%";
                        })
                        .attr('id', 'tempText')
                        .attr('x', function () {
                            return - (d3.select(this).node().getBBox().width / 2);
                        })
                        .attr('y', function () {
                            return (d3.select(this).node().getBBox().height / 2);
                        })
                }).on('mouseout', function (d) {
                    d3.select(this.parentNode).selectAll('#tempText').remove();
                })
                .each(function(d) { this._current = d; });

            circle = g.datum(data[count].data).selectAll("circle")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("circle")
                .attr('r', 10)
                .attr('cx', radius * 1)
                .attr('cy', function (d) {
                    return (radius * 0.5) + (d.id * -25);
                })
                .attr('fill', function (d) {
                    // Race
                    if (count === 2) {
                        return colorsRace[d.title];
                    }

                    // Sex
                    else if (count === 3) {
                        return colorsSex[d.title];
                    }

                    return color(d.id);
                });

            g.datum(data[count].data).selectAll("text")
                .data(function (d) {
                    return d;
                }).enter()
                .append("text")
                .attr('x', radius * 1.15)
                .attr('y', function (d) {
                    return ((radius * 0.5) + (d.id * -25)) + 5;
                })
                .text(function (d) {
                    return d.title;
                });

            text = g.append("text")
                .attr('y', function (d) {
                    return radius;
                })
                .style('font-style', 'italic')
                .text(function (d) {
                    return "Fig ."+count+" : " + data[count].title;
                }).attr('x', function () {
                    return - (radius * 0.75);
                });

            count++;
        
    }
}

/*function setViewLabel(id) {

    // Know which state we are focusing on
    svgGender.append("g")
        .append("text")
        .attr('id', 'stateText')
        .text(function () {
            if (id == 0) {
                return 'Global view';
            } else {
                if (id < 10) {
                    return getKeyByValue(fips, "0" + id) + '\'s view';
                }
                return getKeyByValue(fips, "" + id) + '\'s view';
            }
        })
        .style('font-size', '32px')
        .attr('y', function () {
            //return (d3.select(this).node().getBBox().height);
            return svgGender.node().getBBox().height + d3.select(this).node().getBBox().height;
        })
        .attr('x', function () {
            return svgGender.node().getBBox().width / 2 - d3.select(this).node().getBBox().width / 2;
        });

    d3.select("#stateDeaths").remove();

    

}*/

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}



function showBarChart(stateId) {

    svgBarChart.selectAll("*").remove();

    let theData;
    

    if (stateId === 0) {
        theData = bigData2;
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
            if (shootingsPerTarget != null){
                if (shootingsPerTarget[key] >= 5) {
                    dataToDisplay.push({Target : key, value : shootingsPerTarget[key]});
                
                } else {
                    other = other + shootingsPerTarget[key]
                }
            } else {
                other = other + shootingsPerTarget[key]
            } }
            
        }
        dataToDisplay.push({Target : "Other", value : other});
    } else {
        for (key in shootingsPerTarget) {
            
            if (shootingsPerTarget != null){
                if (key === '') {
                    other = other + shootingsPerTarget[key]  
                } else {
                dataToDisplay.push({Target : key, value : shootingsPerTarget[key]});    
                }                        
            }
        }
        if (other != 0) {
            dataToDisplay.push({Target : "Other", value : other}); 
        }  
    }

    
    
    let colorScaleChart = d3.scaleLinear().domain([1, d3.max(dataToDisplay,  d => { return d.value; })]).range(['orange', 'red']);
    let barColor = d3.interpolateInferno(0.1);
    let highlightColor = d3.interpolateInferno(0.3);
    
    
    let max =0;
    dataToDisplay.forEach(element => {
        
        if (element['value'] > max) {
            max = element['value']
        }
    });

    // Add X axis
    const x = d3.scaleLinear()
    .domain([0, max+1])
    .range([ 0, bwidth*0.75]);
    svgBarChart.append("g")
    .attr("transform", `translate(${bwidth*0.18}, ${bheight*0.8})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, bheight*0.8 ])
    .domain(dataToDisplay.map(d => d.Target))
    .padding(.1);
    svgBarChart.append("g")
    .attr("transform", `translate(${bwidth*0.18}, 0)`)
    .call(d3.axisLeft(y))

  //Bars
  svgBarChart.selectAll("myRect")
    .data(dataToDisplay)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Target))
    .attr("width", d => x(d.value))
    .attr("height", y.bandwidth()*0.75)
    .attr("fill", "#69b3a2")
    .attr("transform", `translate(${bwidth*0.18}, 0)`);

    // Labels
    svgBarChart.selectAll(".label")
        .data(dataToDisplay)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display",  d => { return d.value === null ? "none" : null; })
        .style('opacity', 0.9)
        .attr("y", ( d => { return y(d.Target) + (y.bandwidth() / 2) +14 ; }))
        .attr("x",  d => { return height * 0.7; })
        .attr("height", 0)
        .text( d => { return d.value; })
        .attr("x",  d => { return x(d.value) + .1; })
        .attr("dy", "-.7em")
        .attr("transform", `translate(${bwidth*0.18}, 0)`);

    svgBarChart.append('g').append("text")
        .attr("transform", `translate(${bwidth*0.18}, ${bheight*0.9})`)
        .attr('y', function (d) {
            return 0;
        })
        .style('font-style', 'italic')
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

function getStateDataForPie(stateID) {
    // History of Mental Illness - General
    // Type of Gun - General
    // Shooter Race
    // Shooter Sex

    let mentalIllness = {};
    let typeOfGun = {};
    let shooterRace = {};
    let shooterSex = {};

    let dataToLoop;
    
    
    if (stateID === 0) {
        dataToLoop = bigData2;
    } else {
        if (!dataset[stateID]) {return;}

        dataToLoop = dataset2[stateID];
        
    }

    dataToLoop.forEach(function (d) {
        
        

        // Mental Illness - fields.history_of_mental_illness_general
        if ((d['Mental Health Issues'].indexOf('Yes') !== -1)) {
            if (mentalIllness['Yes']) {
                mentalIllness['Yes']++;
            } else {
                mentalIllness['Yes'] = 1;
            }
        } else if ((d['Mental Health Issues'].indexOf('Unknown') !== -1)) {
            if (mentalIllness['Unknown']) {
                mentalIllness['Unknown']++;
            } else {
                mentalIllness['Unknown'] = 1;
            }
        } else {
            if (mentalIllness['No']) {
                mentalIllness['No']++;
            } else {
                mentalIllness['No'] = 1;
            }
        }
        /*
        // Type of Gun
        if ((d['fields']['type_of_gun_general'].indexOf('Handgun') !== -1)) {
            if (typeOfGun['Handgun']) {
                typeOfGun['Handgun']++;
            } else {
                typeOfGun['Handgun'] = 1;
            }
        } else if ((d['fields']['type_of_gun_general'].indexOf('Multiple') !== -1)) {
            if (typeOfGun['Multiple Guns']) {
                typeOfGun['Multiple Guns']++;
            } else {
                typeOfGun['Multiple Guns'] = 1;
            }
        } else if ((d['fields']['type_of_gun_general'].indexOf('Rifle') !== -1)) {
            if (typeOfGun['Rifle']) {
                typeOfGun['Rifle']++;
            } else {
                typeOfGun['Rifle'] = 1;
            }
        } else if ((d['fields']['type_of_gun_general'].indexOf('Shotgun') !== -1)) {
            if (typeOfGun['Shotgun']) {
                typeOfGun['Shotgun']++;
            } else {
                typeOfGun['Shotgun'] = 1;
            }
        } else {
            if (typeOfGun['Unknown']) {
                typeOfGun['Unknown']++;
            } else {
                typeOfGun['Unknown'] = 1;
            }
        }

        // Shooter race
        if ((d['fields']['shooter_race'].indexOf('White') !== -1)) {
            if (shooterRace['White']) {
                shooterRace['White']++;
            } else {
                shooterRace['White'] = 1;
            }
        } else if ((d['fields']['shooter_race'].indexOf('Black') !== -1)) {
            if (shooterRace['Black']) {
                shooterRace['Black']++;
            } else {
                shooterRace['Black'] = 1;
            }
        } else if ((d['fields']['shooter_race'].indexOf('Asian') !== -1)) {
            if (shooterRace['Asian']) {
                shooterRace['Asian']++;
            } else {
                shooterRace['Asian'] = 1;
            }
        } else if ((d['fields']['shooter_race'].indexOf('Native') !== -1)) {
            if (shooterRace['Native']) {
                shooterRace['Native']++;
            } else {
                shooterRace['Native'] = 1;
            }
        } else {
            if (shooterRace['Other']) {
                shooterRace['Other']++;
            } else {
                shooterRace['Other'] = 1;
            }
        }

        // Shooter sex
        if ((d['fields']['shooter_sex'].indexOf('Male') !== -1)) {
            if (shooterSex['Male']) {
                shooterSex['Male']++;
            } else {
                shooterSex['Male'] = 1;
            }
        } else if ((d['fields']['shooter_sex'].indexOf('Female') !== -1)) {
            if (shooterSex['Female']) {
                shooterSex['Female']++;
            } else {
                shooterSex['Female'] = 1;
            }
        } else {
            if (shooterSex['Unknown']) {
                shooterSex['Unknown']++;
            } else {
                shooterSex['Unknown'] = 1;
            }
        }
        */
    });

    let mentalIllnessArray = [];
    let typeOfGunArray = [];
    let shooterRaceArray = [];
    let shooterSexArray = [];

    let i = 0;
    for (let key in mentalIllness) {
        mentalIllnessArray.push({id : i, title : key, value : mentalIllness[key]});
        i++;
    }

    mentalIllnessArray.sort(function (a, b) {
        return a.value > b.value;
    });
    
    i = 0;
    for (let key in typeOfGun) {
        typeOfGunArray.push({id : i, title : key, value : typeOfGun[key]});
        i++;
    }

    typeOfGunArray.sort(function (a, b) {
        return a.value > b.value;
    });

    i = 0;
    for (let key in shooterRace) {
        shooterRaceArray.push({id : i, title : key, value : shooterRace[key]});
        i++;
    }

    shooterRaceArray.sort(function (a, b) {
        return a.value > b.value;
    });

    i = 0;
    for (let key in shooterSex) {
        shooterSexArray.push({id : i, title : key, value : shooterSex[key]});
        i++;
    }

    shooterSexArray.sort(function (a, b) {
        return a.value > b.value;
    });

    return [{title : 'Shooter mentally ill ?', data : mentalIllnessArray}, {title : 'Type of gun', data : typeOfGunArray}, {title : 'Race of shooter', data : shooterRaceArray}, {title : 'Sex of shooter', data : shooterSexArray}];
}