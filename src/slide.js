let currentGraph = 0;
const graphs = document.querySelectorAll('.graph-container');
const numGraphs = graphs.length;

function showNextGraph() {
    graphs[currentGraph].style.display = 'none';
    currentGraph = (currentGraph + 1) % numGraphs;
    graphs[currentGraph].style.display = 'block';
}

setInterval(showNextGraph, 5000);
showNextGraph();