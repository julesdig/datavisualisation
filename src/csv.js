let data;
function csv() {
    return new Promise((resolve, reject) => {
        Papa.parse("data.csv", {
            download: true,
            header: true,
            complete: function(results) {
                resolve(results.data);
            }
        });
    });
}