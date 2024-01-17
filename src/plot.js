document.addEventListener('DOMContentLoaded', function () {
    csv().then(result => {
        const data = transformData(result);
        console.log(data, "data in plot.js");
        chart_plot(d3, data);
    });

    function transformData(rawData) {
        rawData.pop();
        rawData.pop();
        const brandPriceMap = new Map();

        rawData.forEach(car => {
            const brand = car.Brand;
            const prices = +car.PriceEuro; // Convertir en nombre

            if (!brandPriceMap.has(brand)) {
                brandPriceMap.set(brand, []);
            }

            brandPriceMap.get(brand).push(prices);
        });

        const transformedData = Array.from(brandPriceMap, ([brand, prices]) => ({
            brand,
            prices
        }));

        return transformedData;
    }

    function chart_plot(d3, data) {
console.log("data2 plot");
        const width = 1600;
        const height = 860;
        const marginTop = 20;
        const marginRight = 0;
        const marginBottom = 60;
        const marginLeft = 60;
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
            .attr("text-anchor", "middle");

// Préparez les échelles
        const x = d3.scaleBand()
            .domain(data.map(d => d.brand))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max(d.prices))])
            .range([height - marginBottom, marginTop]);

// Créez un groupe pour chaque marque
        const brandGroups = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", d => `translate(${x(d.brand)},0)`);

// Créez le box plot pour chaque marque
        brandGroups.each(function (d) {
            const brandGroup = d3.select(this);

            const values = d.prices.sort(d3.ascending);
            const q1 = d3.quantile(values, 0.25);
            const q2 = d3.quantile(values, 0.50);
            const q3 = d3.quantile(values, 0.75);
            const iqr = q3 - q1;
            const r0 = Math.max(d3.min(values), q1 - iqr * 1.5);
            const r1 = Math.min(d3.max(values), q3 + iqr * 1.5);

            brandGroup.on("mouseover", function (event) {
                const mean = calculateMean(d.prices);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Moyenne: ${mean.toFixed(2)} €`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

            // Range
            brandGroup.append("path")
                .attr("stroke", "currentColor")
                .attr("d", `
      M${x.bandwidth() / 2},${y(r1)}
      V${y(r0)}
    `);

            // Quartiles
            brandGroup.append("path")
                .attr("fill", "#87CEEB")
                .attr("d", `
      M${x.bandwidth() / 4},${y(q3)}
      H${x.bandwidth() * 3 / 4}
      V${y(q1)}
      H${x.bandwidth() / 4}
      Z
    `);

            // Median
            brandGroup.append("path")
                .attr("stroke", "currentColor")
                .attr("stroke-width", 2)
                .attr("d", `
      M${x.bandwidth() / 4},${y(q2)}
      H${x.bandwidth() * 3 / 4}
    `);

            // Outliers
            brandGroup.selectAll("circle")
                .data(values.filter(v => v < r0 || v > r1))
                .enter()
                .append("circle")
                .attr("r", 2)
                .attr("cx", x.bandwidth() / 2)
                .attr("cy", d => y(d));
        });

// Ajoutez l'axe x
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");

// Ajoutez l'axe y
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(5));

// Ajoutez le titre
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", marginTop)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Box Plot des Prix en fonction des Marques");

// Ajoutez la légende
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Marques des voitures");

// Ajoutez une ligne de séparation
        svg.append("line")
            .attr("x1", 0)
            .attr("y1", height - marginBottom)
            .attr("x2", width)
            .attr("y2", height - marginBottom)
            .attr("stroke", "black");

// Ajoutez une légende pour l'axe y
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", marginRight )
            .attr("dy", "1em")
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Prix");
        document.getElementById("plot").appendChild(svg.node());
    }
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    function calculateMean(prices) {
        const sum = prices.reduce((acc, price) => acc + price, 0);
        return sum / prices.length;
}
});
