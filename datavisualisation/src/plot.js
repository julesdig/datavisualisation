document.addEventListener('DOMContentLoaded', function () {
    csv().then(result => {
        const data=transformData(result);
        console.log(data);
        chart(d3, data);
    });
    function transformData(rawData) {
        return rawData.map(car => ({
            Brand: car.Brand,
            Model: car.Model,
            Efficiency_WhKm: car.Efficiency_WhKm
        }));
    }
    function chart (d3, data) {
        console.log("data2");
        const width = 928;
        const height = 500;
        const marginTop = 20;
        const marginRight = 0;
        const marginBottom = 60;
        const marginLeft = 40;
        const x = d3.scaleBand()
            .domain(d3.sort(data, d => -d.Efficiency_WhKm).map(d => d.Brand))
            .range([marginLeft, width - marginRight])
            .padding(0.1);
        const xAxis = d3.axisBottom(x).tickSizeOuter(0);
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Efficiency_WhKm)]).nice()
            .range([height - marginBottom, marginTop]);
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto;")
            .call(zoom);
        svg.append("g")
            .attr("class", "bars")
            .attr("fill", '#87CEEB')
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.Brand))
            .attr("y", d => y(d.Efficiency_WhKm))
            .attr("height", d => y(0) - y(d.Efficiency_WhKm))
            .attr("width", x.bandwidth());
        // Append the axes.
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis)
            .selectAll(".tick text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-.7em")
            .attr("dy", ".15em");

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove());

        return svg.node();

        function zoom(svg) {
            const extent = [[marginLeft, marginTop], [width - marginRight, height - marginTop]];

            svg.call(d3.zoom()
                .scaleExtent([1, 8])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomed));

            function zoomed(event) {
                x.range([marginLeft, width - marginRight].map(d => event.transform.applyX(d)));
                svg.selectAll(".bars rect").attr("x", d => x(d.Brand)).attr("width", x.bandwidth());
                svg.selectAll(".x-axis").call(xAxis);
            }
            document.getElementById("efficiency_chart").appendChild(svg.node());
        }
    }
});
