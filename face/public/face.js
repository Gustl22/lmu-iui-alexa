const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => {
            if (err.name == 'NotReadableError') {
                alert('Webcam already in use!')
            }
            console.error(err);
        }
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);

    const profiles = [];

    setInterval(async () => {
        const modes = await postData('/api/mode/load');

        const detector = new faceapi.TinyFaceDetectorOptions({
            // FIXME:
            // https://github.com/justadudewhohacks/face-api.js/issues/282
            // https://github.com/justadudewhohacks/face-api.js/issues/125
            // inputSize: 256, // this line solves 'Box.constructor - expected box to be IBoundingBox | IRect, instead ...'
            // scoreThreshold: 0.5,
        });

        if (modes.hasOwnProperty('profile') && modes.profile) {
            const detection = await faceapi.detectSingleFace(video, detector)
                .withFaceDescriptors();
            (profiles[modes.profile] = profiles[modes.profile] || []).push(detection.descriptor);
        } else {

            const labeledDescriptors = [];
            for (let key in profiles) {
                if (profiles.hasOwnProperty(key)) {
                    labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(
                        key,
                        profiles[key]
                    ));
                }
            }

            const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
            detections.forEach(fd => {
                const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
                console.log(bestMatch.toString());
            });

            const detections = await faceapi.detectAllFaces(video, detector)
                .withFaceLandmarks()
                .withFaceExpressions();
            // console.log(detections);

            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

            if (detections.length > 0) {
                await postData('/api/face/save', {'expressions': detections[0].expressions});
            }
        }
    }, 500)
});


async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json() // parses JSON response into native JavaScript objects
    }
    return response;
}