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

const onPageLoad = async (outcome) => {
    data = await network.getData();
    audioStream = await audioManager.getAudioStream();
    recorder = new Recorder(audioStream);
    controller.setup();
    view.setInstructionText(data.intro);

    await shuffleAll();
    setupEvents();

    if (window.location.href.includes("examiner") && outcome.files !== undefined) {
        files = outcome.files;
        shapes = outcome.shapes;

        for (let i = 0; i < files.length; i++) {
            let baseData = await getBase64(files[i]);
            responses.push(baseData);
        }
        await setupFun();
    }

    loader.hide();
}

const setupEvents = async () => {
    $("#randomizer").click(shuffleAll);

    document.getElementById("outsideAudio").addEventListener("ended", function() {
        playing = -1;
        $(".playing").removeClass("playing");
    });

    $(".frame").each(function(index) {
        $(this).click(function() {
            if (playing === -1 || playing !== index) {
                playing = index;

                if (selected[index]) {
                    audioManager.playNewAudio("outside", responses[index]);
                } else {
                    audioManager.playNewAudio("outside", audioData[index]);
                }
    
                $(".playing").removeClass("playing");
                $(this).addClass("playing");
            } else if (playing === index && $(this).hasClass("playing"))
            {
                audioManager.pause("outside");
                $(".playing").removeClass("playing");
            }
            else if (playing === index && !$(this).hasClass("playing"))
            {
                audioManager.play("outside");
                $(this).addClass("playing");
            }
        });
    });

    $("#rejectBtn").click(function() {
        examine(false);
        $("#rating").addClass("closed");
    });
    $("#awardBtn").click(async function() {
        examine(true);
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
    files.push(currFile);
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
            await shuffleAll();
            toggleFrame(3);
            $("#checkboxes").removeClass("invisible");
        } else {
            shuffleAll();
        }
    });

    selected = [true, true, true, true];
    await view.setupFunView(shapes);
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

const shuffleAll = async () => {
    audioManager.pause("outside");
    $(".playing").removeClass("playing");
    playing = -1;

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
}

const shuffle = async (i) => {
    view.openLoading(i);
    audioData[i] = await audioManager.getRandomFile(i);
}

if (!window.location.href.includes("examiner")) {
    $(onPageLoad);
}