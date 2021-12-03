const audioManager = {
    getAudioStream: async() => {
        return navigator.mediaDevices.getUserMedia({ audio: true });
    },

    setAudioSource: async (type, source) => {
        document.getElementById(type + "Audio").currentTime = 0;
        document.getElementById(type + "Audio").src = source;
    },

    play: async (type) => {
        document.getElementById(type + "Audio").play();
    },
    
    pause: async (type) => {
        document.getElementById(type + "Audio").pause();
    },

    playNewAudio: async (type, source) => {
        document.getElementById(type + "Audio").src = source;
        document.getElementById(type + "Audio").currentTime = 0;
        document.getElementById(type + "Audio").play();
    },

    getRandomFile: async (directory) => {
        let file = await network.getRandomFile(directory);
        file = "data:audio/wav;base64," + file;
        return file;
    },
}