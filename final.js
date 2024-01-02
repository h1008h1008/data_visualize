
(function (d3) {
    'use strict';

    var keys = [
        "因學業成績退學人數",
        "因操行成績退學人數",
        "因志趣不合退學人數",
        "因逾期未註冊退學人數",
        "因休學逾期未復學退學人數",
        "因懷孕退學人數",
        "因育嬰退學人數",
        "因病退學人數",
        "因工作需求退學人數",
        "因經濟困難退學人數",
        "因生涯規劃退學人數",
        "其他退學人數",
    ];

    

    function render(data){
        const margin = { top: 20, right: 20, bottom: 150, left: 40 };
        const height = 500 - margin.top - margin.bottom;
        const barWidth = 10;
        const barPadding = 5;
        const numberOfBars = data.length; // The number of data points
        const newWidth = numberOfBars * (barWidth + barPadding);
        const width = newWidth - margin.left - margin.right;

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .align(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

            var z = d3.scaleOrdinal()
                .range([
                    "#ef476f", // Berry Red
                    "#ffd166", // Sunny Yellow
                    "#06d6a0", // Aquamarine
                    "#118ab2", // Ocean Blue
                    "#073b4c", // Navy Blue
                    "#8ac926", // Lime Green
                    "#6a4c93", // Purple
                    "#f77f00", // Orange
                    "#80b918", // Leaf Green
                    "#ff70a6", // Pink
                    "#ff9770", // Coral
                    "#9e2a2b"  // Dark Red
                ]);

        

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        var maxTotal = d3.max(data, function(d) { return d.total; });
        d3.select("body").selectAll("svg").remove();
        x.domain(data.map(function (d) { return d.combinedKey; }));
        y.domain([0, maxTotal]).nice();
        z.domain(keys);

        var svg = d3.select("#chart-container").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var layer = svg.selectAll(".layer")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("class", "layer")
            .attr("fill", function (d) { return z(d.key); });

        layer.selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.combinedKey); })
            .attr("y", function (d) { 
                return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", function(event, d) {
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);   
                div.html(d.data.combinedKey + "<br/>"  + d[1])  
                    .style("left", (event.pageX) + "px")     
                    .style("top", (event.pageY - 28) + "px");    
            })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text") // select all the text elements for the xaxis
            .style("text-anchor", "end") // set their anchor to the end
            .attr("dx", "-.8em") // position them with a slight offset
            .attr("dy", ".15em") // position them with a slight offset
            .attr("transform", function(d) {
                return "rotate(-65)" // rotate the text
            });

        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Dropout Student Percentage / 100% ");
        
        
        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(-50," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { return d; });

    }
    d3.csv("dataset.csv").then(function (data) {
        var filteredData = data.filter(function (d) {
            var total = 0;
            var enrolledStudents = parseInt(d['在學學生數'].replace(/,/g, ''), 10);
            
            keys.forEach(function (key) {
                d[key] = +d[key]; 
                if (isNaN(d[key])) {
                    d[key] = 0; 
                }
                d[key] = (d[key] / (enrolledStudents)) * 100; 
                total += d[key];
            });
            
            d.total = total;
            
            // Log the totals that are being removed
            if (total > 50 || total === 0) {
                return false; // Do not include this item in the new array
            }
            
            d.combinedKey = d['學年度'] +d['學期'] +  d['學校名稱'] + d['學制班別'] + d['性別'];
            return true; // Include this item in the new array
        });
        
        // Now you can use filteredData to render your chart
        render(filteredData);
        
    });
d3.select('#btn').on('click', function() {
    // Get the selected values from the dropdowns
    var selectedX = d3.select('#X').node().value;
    var selectedY = d3.select('#Y').node().value;
    var selectedZ = d3.select('#Z').node().value;
    var selectedA = d3.select('#A').node().value;
    // Assuming you've loaded your data somewhere in the script
    d3.csv("dataset.csv").then(function (data) {
        
        if (selectedX === '整體' || selectedY === '男+女' || selectedZ == '整體' || selectedA == '整體') {
            let sumsBySchool = [];
            if(selectedX != '整體'){
                data = data.filter(function(d) {
                    if (d['學制班別'] === selectedX) {
                        return true; 
                    }
                    return false;
                });
            }
            if(selectedY != '男+女'){
                data = data.filter(function(d) {
                    if (d['性別'] === selectedY) {
                        return true; 
                    }
                    return false;
                });
            }
            if(selectedZ != '整體'){
                data = data.filter(function(d) {
                    if (d['學年度'] === selectedZ) {
                        return true; 
                    }
                    return false;
                });
            }
            if(selectedA != '整體'){
                data = data.filter(function(d) {
                    if (d['設立別'] === selectedA) {
                        return true; 
                    }
                    return false;
                });
            }
            data.forEach(d => {
                let schoolName = d['學校名稱'];
                if (!sumsBySchool[schoolName]) {
                    sumsBySchool[schoolName] = keys.reduce((acc, key) => {
                        acc[key] = 0;
                        return acc;
                    }, {});
                    sumsBySchool[schoolName].combinedKey =  selectedZ + selectedX + d['學校名稱'] + selectedY;
                    sumsBySchool[schoolName].total = 0;
                    sumsBySchool[schoolName].alltotal = 0;
                }
                keys.forEach(key => {
                    sumsBySchool[schoolName][key] += Number(d[key]) || 0;
                    sumsBySchool[schoolName].total += Number(d[key]) || 0;
                });
                sumsBySchool[schoolName].alltotal+= parseInt(d['在學學生數'].replace(/,/g, ''), 10);
            });
            
            let aggregatedData = Object.values(sumsBySchool);
            data = aggregatedData;
            data = data.filter(function (d) {
                let total = 0;
                
                keys.forEach(function (key) {
                    d[key] = +d[key]; 
                    if (isNaN(d[key])) {
                        d[key] = 0; 
                    }
                    d[key] = (d[key] / d.alltotal) * 100; 
                    total += d[key];
                });
                
                d.total = total;
                
                // Log the totals that are being removed
                if (total > 50 || total === 0) {
                    return false; // Do not include this item in the new array
                }
                
                return true; // Include this item in the new array
            });
        }
        else{
            data = data.filter(function(d) {
                var total = 0;
                var enrolledStudents = parseInt(d['在學學生數'].replace(/,/g, ''), 10);
                if (d['學制班別'] === selectedX && d['性別'] === selectedY && d['學年度'] === selectedZ && selectedA == d['設立別']) {
                    keys.forEach(function(key) {
                        d[key] = +d[key];
                        if (isNaN(d[key])) {
                            d[key] = 0;
                        }
                        d[key] = (d[key] / enrolledStudents) * 100; 
                        total += d[key];
                    });
                    d.total = total;
                    if (total > 50 || total === 0) {
                        return false; // Do not include this item in the new array
                    }
                    
                    d.combinedKey = d['學年度'] +d['學期']+ d['學校名稱'] + d['學制班別'] + d['性別'];
                    return true; // Include this item in the new array
                }
                // Exclude this element from the array
                return false;
            });
        }
        
        render(data);
    });
});

})(d3);
