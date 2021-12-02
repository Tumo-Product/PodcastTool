const audioManager = {
    getRandomFile: async (directory) => {
        let file = await network.getRandomFile(directory);
        file = "data:audio/wav;base64," + file;
        return file;
    },
    
    playNewAudio: async (source) => {
        document.getElementById("audio").src = source;
        document.getElementById("audio").currentTime = 0;
        document.getElementById("audio").play();
    }
}