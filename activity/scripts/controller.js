const controller = {
    recording:  false,
    reviewing:  false,
    playing:    false,
    paused:     false,

    interval:   undefined,
    pauseInterval: undefined,
    timePaused: 0,

    setup: async () => {
        $("#centerBtn").click(controller.recordClickHandler);
        $("#leftBtn").click(controller.pauseClickHandler);
        document.getElementById("myAudio").addEventListener("ended", function() {
            view.replaceButton("centerBtn", "#play");
            controller.playing = false;
        });
    },

    recordClickHandler: async () => {
        controller.recording = !controller.recording;

        if (controller.recording) {
            controller.record();
        } else {
            controller.stopRecording();
        }
    },

    pauseClickHandler: async() => {
        controller.paused = !controller.paused;

        if (controller.paused) {
            controller.pause();
        } else {
            controller.resume();
        }
    },

    setupReview: async () => {
        $("#controller .button").unbind("click");

        $("#leftBtn").click(function () {
            controller.cancel();
            currBaseAudio = null;
            currFile = null;
        });

        $("#centerBtn").click(controller.togglePlay);
        $("#rightBtn").click(controller.complete);
    },

    cancel: async () => {
        $("#controller .button").unbind("click");
        $("#centerBtn").click(controller.recordClickHandler);
        $("#leftBtn").click(controller.pauseClickHandler);

        controllerView.cancel();
        controller.playing = false;
    },

    togglePlay: async() => {
        controller.playing = !controller.playing;
        
        if (controller.playing) {
            audioManager.play("my");
            view.replaceButton("centerBtn", "#pause");
        } else {
            audioManager.pause("my");
            view.replaceButton("centerBtn", "#play");
        }
    },

    complete: async () => {
        controller.cancel();
        handleAnswer();
    },

    record : async () => {
        recorder.start();
        controllerView.record();
        let startTime = new Date().getTime();

        controller.interval = setInterval(function () {
            let currTime = new Date().getTime();
            let time = currTime - startTime - controller.timePaused;
            let progress = time / 30000 * 100;
            controllerView.updateProgress(progress);
            
            if (time >= 5000) {
                $("#centerBtn").removeClass("deactivated");
            }
            if (time >= 30000) {
                controller.stopRecording();
            }

            if (time < 0) time = 0;
        }, 100);
    },
    pause : async () => {
        recorder.pause();
        controllerView.pause();

        controller.pauseInterval = setInterval(function () {
            controller.timePaused += 100;
        }, 100);
    },
    resume: async () => {
        recorder.resume();
        controllerView.resume();
        clearInterval(controller.pauseInterval);
    },
    stopRecording: async () => {
        controllerView.updateProgress(0);
        controller.timePaused = 0;
        clearInterval(controller.interval);
        clearInterval(controller.pauseInterval);

        recorder.stop().then(() => {
            controllerView.stopRecording();
            handleRecording();
            controller.setupReview();
        });
    }
}

const controllerView = {
    record: async () => {
        $("#centerBtn").addClass("recording deactivated");
        $("#leftBtn").removeClass("deactivated");
    },
    stopRecording: async () => {
        $("#centerBtn").removeClass("recording");
        view.replaceButton("leftBtn", "#cancel");
        view.replaceButton("centerBtn", "#play");
        $("#rightBtn").removeClass("invisible");
    },
    pause: async () => {
        view.replaceButton("leftBtn", "#record");
    },
    resume: async () => {
        view.replaceButton("leftBtn", "#pause");
    },
    cancel: async () => {
        $("#rightBtn").addClass("invisible");
        view.replaceButton("centerBtn", "#record");
        view.replaceButton("leftBtn", "#pause");
        $("#leftBtn").addClass("deactivated");
    },
    moveRecorderDown: async () => {
        $("#recorder").css("top", "+=88");
    },
    updateProgress    : async (progress) => {
        $("#progress").css("--value", progress);
    }
}