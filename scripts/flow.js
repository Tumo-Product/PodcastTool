let data;
let audioData = [];

let shapes = [];
let responses = [];
let files = [];
let currBaseAudio;
let currFile;
let audioStream;
let recorder;

let startedFun = false;
let selected = [false, false, false, false];

let playing = -1;
let audioOrder = -1;

const onPageLoad = async (outcome) => {
    data = await network.getData();
    audioStream = await audioManager.getAudioStream();
    recorder = new Recorder(audioStream);
    controller.setup();
    let examinerCondition = window.location.href.includes("examiner") && outcome.files !== undefined;
    view.setInstructionText(examinerCondition ? data.examinerInstruction : data.intro);
    view.setStarterTexts(data.starters);

    await shuffleAll(examinerCondition);
    setupEvents();

    if (examinerCondition) {
        files = outcome.files;
        shapes = outcome.shapes;

        for (let i = 0; i < files.length; i++) {
            let blob = await fetch(files[i]).then(res => res.blob());
            let baseData = await getBase64(blob);
            responses.push(baseData);
        }

        await setupFun();
    }

    loader.hide();
}

const setupEvents = async () => {
    $("#randomizer").click(shuffleAll);

    document.getElementById("outsideAudio").addEventListener("ended", function() {
        $(".playing").removeClass("playing");

        if (audioOrder > -1) {
            audioOrder++;
            audioManager.playNewAudio("outside", selected[audioOrder] ? responses[audioOrder] : audioData[audioOrder], audioOrder);
            if (audioOrder === 3) audioOrder = -1;
        } else {
            playing = -1;
        }
    });

    $(".frame").each(function(index) {
        $(this).click(function() {
            audioOrder = -1;

            if (playing === -1 || playing !== index) {
                audioManager.playNewAudio("outside", selected[index] ? responses[index] : audioData[index], index);
            } else if (playing === index && $(this).hasClass("playing")) {
                audioManager.pause("outside");
            } else if (playing === index && !$(this).hasClass("playing")) {
                audioManager.play("outside", index);
            }
        });
    });

    $("#rejectBtn").click(function() {
        examine(false);
        $("#rating").addClass("closed");
    });

    $("#awardBtn").click(async function() {
        examine(true);

        for (let i = 0; i < files.length; i++) {
            files[i] = await fetch(files[i]).then(res => res.blob());
        }
        
        await network.upload(data.taskDir, files);
        $("#rating").addClass("closed");
    })

    $("#start").click(onStart);
}

const onStart = async () => {
    await view.onStart(data.recordingInstruction);

    $("#shuffleTopic").click(async () => {
        await pickTopic();
        await view.setupRecordingView();
    });
}

const handleRecording = async () => {
    currFile = recorder.getBlob();
    currBaseAudio = await recorder.getBaseAudio();
    audioManager.setAudioSource("my", currBaseAudio);
}

const handleAnswer = async () => {
    shapes.push(Math.floor(Math.random() * 4));
    responses.push(currBaseAudio);
    files.push(currBaseAudio);
    let length = responses.length;

    if (length === 4) {
        let outcome = { shapes: shapes, files: files };
        setAnswers(outcome);
        setupFun();
        return;
    }

    view.switchStarter(length);
    controllerView.moveRecorderDown();
}

const setupFun = async () => {
    $("#randomizer").unbind("click");

    $(".checkbox").each(function(index) {
        $(this).click(function() {
            toggleFrame(index);
        });
    });

    $("#randomizer").click(async function () {
        if (!startedFun) {
            startedFun = true;

            selected = [false, false, false, false];
            let playPromise = shuffleAll();
            playPromise.then(() => {
                toggleFrame(3);
                $("#checkboxes").removeClass("invisible");
                audioOrder = 0;
                audioManager.playNewAudio("outside", selected[0] ? responses[0] : audioData[0], 0);
            });
        } else {
            shuffleAll();
        }
    });

    selected = [true, true, true, true];
    await view.setupFunView(shapes);

    audioOrder = 0;
    audioManager.pause("outside");
    audioManager.playNewAudio("outside", selected[0] ? responses[0] : audioData[0], 0);
}

const toggleFrame = async (index) => {
    audioManager.pause("outside");
    $(".playing").removeClass("playing");
    playing = -1;

    if (!selected[index]) {
        let selectedCount = 0;

        for (let i = 0; i < 4; i++) {
            if (selected[i]) {
                selectedCount++;

                if (selectedCount === 2) {
                    selected[i] = false;
                    view.deselectFrame(i);
                    break;
                }
            }
        }

        selected[index] = true;
        view.selectFrame(index, shapes[index]);
    } else {
        selected[index] = false;
        view.deselectFrame(index);
    }
}

const pickTopic = async () => {
    let timer       = 0;
    let currentWord = Math.floor(Math.random() * data.topics.length) - 30;
    await view.pickTopic(data.funInstruction);
    
    for (let i = currentWord; i < currentWord + 30; i++) {
        $("#topic p").html(data.topics[getIndex(i, data.topics.length)]);
        await timeout(easeOutQuad(timer) * 140);
        timer = timer + (1/30);
        if (timer > 1) timer = 1;
    }
}

const shuffleAll = async (playInSuccession) => {
    audioManager.pause("outside");
    playing = -1;
    audioOrder = -1;
    
    let promises = [];

    for (let i = 0; i < 4; i++) {
        if (!selected[i]) {
            promises[i] = shuffle(i.toString());
        }
    }

    for (let promise of promises) { await promise; }
    for (let i = 0; i < 4; i++) {
        if (!selected[i]) {
            view.setNewShape(i);
        }
    }

    let promise;
    if (playInSuccession !== false) {
        audioOrder = 0;
        promise = audioManager.playNewAudio("outside", selected[0] ? responses[0] : audioData[0], 0);
    }

    return promise;
}

const shuffle = async (i) => {
    view.openLoading(i);
    audioData[i] = await audioManager.getRandomFile(i);
}

if (!window.location.href.includes("examiner")) {
    $(onPageLoad);
}