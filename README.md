## Porject Datavisualization
![Docker Badge](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Bootstrap Badge](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white)
![D3.js Badge](https://img.shields.io/badge/D3.js-F9A03C?style=flat&logo=d3.js&logoColor=white)
![HTML Badge](https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white)
![CSS Badge](https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Description Technique

Pour docker, il sert juste de serveur web pour le projet. Il n'y a pas de base de données.
3 fichiers sont importants pour le docker:
- Dockerfile
- docker-compose.yml
- apache-config.conf

Nous pourrons voir le project en ouvrant l'url suivant:
```
http://localhost/
```

Le reste du projet est dans le dossier "src".
3 graphiques de D3js sont présents:
chaque graphique est dans un fichier js différent.(circle.js, plot.js, efficiency_chart.js)

Les données sont dans un fichier csv appelé "data.csv" dans le dossier "src".
Pour lire les données et pouvoir les utiliser dans les graphiques, nous utilisons le fichier csv.js dans le dossier "src".
Celui ci sera appelé dans chaque fichier de graphique et transformera les données pour les avoir dans le graphique.
Le fichier index.html rassembe les 3 graphiques et les affiches sur la page web.
Pour le dernier fichier qui est slide.js celui ci permet de faire défiler les graphiques sur la page web comme demandé dans la consigne 
