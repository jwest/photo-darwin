const photosRepository = require('./photos-repository.js');
const levenshtein = require('fast-levenshtein');
const setClustering = require('set-clustering');

// const inputPath = path.join('C:\\Users\\jwest\\Projects\\best-photo-selector', 'demo/input/large');

function compareImageCreatedAt(imageA, imageB) {
    if (imageA.createdAt.getTime() < imageB.createdAt.getTime()) return -1;
    if (imageB.createdAt.getTime() > imageA.createdAt.getTime()) return 1;
    return 0;
}

function clusteringByTime(images, secAsCluster) {
    const orderedImages = images.sort(compareImageCreatedAt);

    return orderedImages.reduce((acc, currentImage) => {
        const lastImage = acc[acc.length - 1][acc[acc.length - 1].length - 1];
        if (lastImage.createdAt.getTime() + secAsCluster < currentImage.createdAt.getTime()) {
            acc.push([]);
        }
        acc[acc.length - 1].push(currentImage);
        return acc;
    }, [[orderedImages.shift()]]);
}

function clusteringBySimilarity(images) {
    const cluster = setClustering(images, (imageA, imageB) => {
        console.log(levenshtein.get(imageA.hash, imageB.hash));
        return 1 - (levenshtein.get(imageA.hash, imageB.hash) / 16);
    });
    return cluster.similarGroups(0.5);
}

module.exports = (workingDir) => {
    return photosRepository.load(workingDir)
        .then(images => clusteringByTime(images, 60000))
        .then(imageGroups => imageGroups.map(group => clusteringBySimilarity(group)))
        .catch(console.err);
};
