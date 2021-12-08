const audioManager = {
    getAudioStream: async() => {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    },

    setAudioSource: async (type, source) => {
        document.getElementById(type + "Audio").currentTime = 0;
        document.getElementById(type + "Audio").src = source;
    },

    play: async (type, index) => {
        document.getElementById(type + "Audio").play();

        if (type === "outside") {
            playing = index;
            $(`#f_${index}`).addClass("playing");
        }
    },
    
    pause: async (type) => {
        document.getElementById(type + "Audio").pause();

        if (type === "outside") {
            $(".playing").removeClass("playing");
        }
    },

    playNewAudio: async (type, source, index) => {
        document.getElementById(type + "Audio").src = source;
        document.getElementById(type + "Audio").currentTime = 0;
        let promise = document.getElementById(type + "Audio").play();

        if (type === "outside") {
            playing = index;

            $(".playing").removeClass("playing");
            $(`#f_${index}`).addClass("playing");
        }

        return promise;
    },

    getRandomFile: async (directory) => {
        let file = await network.getRandomFile(data.taskDir, directory);
        file = "data:audio/wav;base64," + file;
        return file;
    },
}