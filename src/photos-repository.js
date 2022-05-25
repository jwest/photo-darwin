const fs = require('fs');
const path = require('path');
const numCPUs = require('os').cpus().length;

const { Worker } = require('worker_threads');

function readDir(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
}

function load(directoryPath) {
    const promises = {};
    const threads = [];
    new Array(numCPUs).fill(0).forEach((_, i) => {
        threads[i] = new Worker("./src/load-image-data-thread.js");
        threads[i].on("exit", () => {
            console.log("Closing ", i);
        });
        threads[i].on("message", (image) => {
            promises[image.path] = image;
        });
    });

    return readDir(directoryPath)
        .then(files => files
            .map(filePath => path.join(directoryPath, filePath))
            .map((imagePath, i) => {
                threads[i % numCPUs].postMessage(imagePath);
                return new Promise(resolve => {
                    setInterval(() => {
                        if (!!promises[imagePath]) {
                            resolve(promises[imagePath]);
                        }
                    }, 100);
                });
            }))
        .then(images => Promise.all(images))
        .then((images) => {
            threads.map(thread => thread.postMessage('close'));
            return images;
        });
}

module.exports = {
    load: load
};