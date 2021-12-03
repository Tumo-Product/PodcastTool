let data;
let audioData = [];

let outcome = { shapes: [], responses: [] };
let currBaseAudio;
let audioStream;
let recorder;

const onPageLoad = async () => {
    data = await network.getData();
    audioStream = await audioManager.getAudioStream();
    recorder = new Recorder(audioStream);
    controller.setup();

    await shuffleAll();
    setupEvents();
    loader.hide();
}

const setupEvents = async () => {
    $("#randomizer").click(shuffleAll);

    $(".frame").each(function(index) {
        $(this).click(function() { audioManager.playNewAudio("outside", audioData[index]); });
    });

    $("#start").click(onStart);
}

const onStart = async () => {
    await view.onStart();
    await pickTopic();
    await view.setupRecordingView();
}

const handleRecording = async () => {
    currBaseAudio = await recorder.getBaseAudio();
    audioManager.setAudioSource("my", currBaseAudio);
}

const handleAnswer = async () => {
    let length = outcome.responses.length;
    outcome.shapes.push(Math.floor(Math.random() * 4));
    outcome.responses.push(currBaseAudio);

    if (length === 4) {
        view.setupFunView();
        return;
    }

    view.switchStarter(length);
    controllerView.moveRecorderDown();
}

const pickTopic = async () => {
    let timer       = 0;
    let currentWord = Math.floor(Math.random() * data.topics.length) - 30;
    
    for (let i = currentWord; i < currentWord + 30; i++) {
        $("#topic p").text(data.topics[getIndex(i, data.topics.length)]);
        await timeout(easeOutQuad(timer) * 140);
        timer = timer + (1/30);
        if (timer > 1) timer = 1;
    }
}

const shuffleAll = async () => {
    let promises = [];

    for (let i = 0; i < 4; i++) { promises[i] = shuffle(i.toString()); }

    for (let promise of promises) { await promise; }
    
    for (let i = 0; i < 4; i++) {
        view.setNewShape(i);
    }
}

const shuffle = async (i) => {
    view.openLoading(i);
    audioData[i] = await audioManager.getRandomFile(i);
}

$(onPageLoad);