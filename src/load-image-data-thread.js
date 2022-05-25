const ExifImage = require('exif');
const moment = require('moment');
const imghash = require('imghash');
const { parentPort } = require('worker_threads');

function parseExifDateTime(exifDateTime) {
    const tstamp = moment(exifDateTime, "YYYY:MM:DD HH:mm:ss");
    return tstamp.toDate();
}

console.log("Hello thread");

parentPort.on("message", (imagePath) => {
    if (imagePath == 'close') {
        parentPort.close();
        return;
    }

    console.log("message received: ", imagePath);

    return new Promise((resolve, reject) => {
        new ExifImage({ image : imagePath }, (err, metadata) => {
            if (err) {
                reject(err);
                return;
            }

            const image = {
                path: imagePath,
                createdAt: parseExifDateTime(metadata.exif.CreateDate),
            };

            resolve(image);
        });
    }).then(image => {
        imghash.hash(imagePath, 8)
            .then(hash => {
                console.log(imagePath);
                image.hash = hash;
                parentPort.postMessage(image);
            })
    });
});