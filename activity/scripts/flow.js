let data;
let audioData = [];

const onPageLoad = async () => {
    data = await network.getData();

    await shuffleAll();
    setupEvents();

    loader.hide();
}

const setupEvents = async () => {
    $("#randomizer").click(shuffleAll);

    $(".frame").each(function(index) {
        $(this).click(function() { audioManager.playNewAudio(audioData[index]); });
    });

    $("#start").click(onStart);
}

const onStart = async () => {
    await view.onStart();
    await pickTopic();
    await view.setupRecordingView();
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

    for (let i = 0; i < 4; i++) {
        promises[i] = shuffle(i.toString());
    }

    for (let promise of promises) {
        await promise;
    }
}

const shuffle = async (i) => {
    audioData[i] = await audioManager.getRandomFile(i);
    await view.setNewShape(i);
}

$(onPageLoad);