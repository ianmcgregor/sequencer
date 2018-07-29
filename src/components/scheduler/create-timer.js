function createWorker (str) {
  return new Worker(URL.createObjectURL(new Blob([str])))
}

export default function createTimer () {
  return createWorker(`
        var id = null;
        var interval = 100;

        self.onmessage = function(event) {
            if (event.data === 'start') {
                id = setInterval(function() {
                    postMessage('tick');
                }, interval);
            } else if (event.data === 'stop') {
                clearInterval(id);
                id = null;
            } else if (event.data.interval) {
                interval = event.data.interval * 1000;
                if (id) {
                    clearInterval(id);
                    id = setInterval(function() {
                        postMessage('tick');
                    }, interval);
                }
            }
        };
    `)
}
