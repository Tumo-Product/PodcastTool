const view = {
    colors:["#966B9D", "#C98685", "#9BC53D", "#FDE74C",
            "#C2423F", "#427AA1", "#333333", "#EF767A",
            "#0B8654", "#BA9BB0", "#AF1B3F", "#FEC600",
            "#456A90", "#49BEAA", "#EA7317", "#003F91",
            "#B1CF5F", "#F1AB86", "#5DA9E8", "#E8EF76"],

    replaceButton: async (which, button) => {
        $(`#${which} .current`).removeClass("current");
        await timeout(50);
        $(`#${which} #${button}`).addClass("current");
    },

    setNewShape: async (index) => {
        let randomColor = view.colors[Math.floor(Math.random() * view.colors.length)];
        let randomShapeIndex = Math.floor(Math.random() * 4);
        
        $(`#i_${index}`).css({"background-color": randomColor, "-webkit-mask": `url(shapes/0/${randomShapeIndex}.svg)`});
    },

    onStart: async () => {
        $("#randomizerContainer").addClass("closed");
        $("#frames").addClass("offscreenRight");
        $("#instruction").addClass("over");

        await timeout(1000);

        $("#topic").removeClass("offscreenRight"); await timeout(500);
    },

    setupRecordingView: async() => {
        $("#topic").addClass("onTop");
        await timeout(700);
        $("#controller").removeClass("closedVertically");

    }
}