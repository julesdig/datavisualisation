let currentGraph = 0;
const graphs = document.querySelectorAll('.graph-container');
const numGraphs = graphs.length;
let intervalId;

function showGraph(index) {
    graphs[currentGraph].style.display = 'none';
    currentGraph = (index + numGraphs) % numGraphs;
    graphs[currentGraph].style.display = 'block';
}

function showPreviousGraph() {
    showGraph(currentGraph - 1);
}

function showNextGraph() {
    showGraph(currentGraph + 1);
}

function togglePauseResume() {
    const button = document.getElementById('pauseResumeButton');

    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        button.textContent = 'Start';
    } else {
        intervalId = setInterval(showNextGraph, 5000);
        showNextGraph();
        button.textContent = 'Pause';
    }
}

// événements des boutons
document.getElementById('previousButton').addEventListener('click', showPreviousGraph);
document.getElementById('pauseResumeButton').addEventListener('click', togglePauseResume);
document.getElementById('nextButton').addEventListener('click', showNextGraph);

intervalId = setInterval(showNextGraph, 5000);  // Démarrez l'intervalle initial
