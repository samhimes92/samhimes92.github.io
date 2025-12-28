const data = [10, 15, 20, 25, 30];

const width = 300;
const height = 150;
const barWidth = 40;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (barWidth + 10))
    .attr("y", d => height - d * 4)
    .attr("width", barWidth)
    .attr("height", d => d * 4)
    .attr("fill", "steelblue")
    .on("click", function() {
        d3.select(this).attr("fill", "orange");
    });

svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(d => d)
    .attr("x", (d, i) => i * (barWidth + 10) + barWidth / 2)
    .attr("y", d => height - d * 4 - 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px");
