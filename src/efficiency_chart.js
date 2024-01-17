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
            Efficiency_WhKm: car.Range_Km
        }));
    }
    function chart (d3, data) {
        console.log("data2");
        const width = 1600;
        const height = 860;
        const marginTop = 20;
        const marginRight = 0;
        const marginBottom = 60;
        const marginLeft = 40;
        const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
            .attr("width", x.bandwidth())
            .attr("fill", d => (d.Brand === "Moyenne-Essence" || d.Brand === "Moyenne-Diesel") ? '#FF7F50' : '#87CEEB')
            .on("mouseover", function (event, d) {
                // Afficher l'infobulle au survol
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`${d.Brand}: ${d.Efficiency_WhKm} km`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
                // Masquer l'infobulle lorsque la souris quitte la barre
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
        // Append the axes.
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis)
            .selectAll(".tick text")
            .attr("transform", "rotate(-35)")
            .style("text-anchor", "end")
            .attr("dx", "-.7em")
            .attr("dy", ".15em");
            
    // Ajoutez le titre
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", marginTop)
        .attr("text-anchor", "middle")
        .text("Histogramme des kilomètres parcourus avec une charge complète");

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove());
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginLeft - 28) // Ajustez la position verticale
            .attr("text-anchor", "middle")
            .style("fill", "#333") // Couleur du texte
            .text("Distance parcours en Km");
            const lineY = y(466);
        svg.append("line")
            .attr("x1", marginLeft)
            .attr("y1", lineY)
            .attr("x2", width - marginRight)
            .attr("y2", lineY)
            .attr("stroke", "red")
            .attr("stroke-width", 2);
        svg.append("text")
            .attr("x", marginLeft)
            .attr("y", lineY - 5)
            .attr("text-anchor", "start")
            .style("fill", "black")
            .style("font-weight", "bold")
            .text("Lyon --> Paris 466km");

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
