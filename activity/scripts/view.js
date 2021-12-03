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

    openLoading: (index) => {
        $(`#i_${index}`).addClass("loading");
    },
    
    switchStarter: (index) => {
        $(".starter").each(function() {
            if (!$(this).hasClass("deactivated")) {
                $(this).addClass("deactivated");
            }
        })

        $(`#s_${index}`).removeClass("deactivated");
    },
    
    setShape: async (index, svgIndex) => {
        $(`#i_${index}`).css({"background-color": "#DB9191", "-webkit-mask": `url(shapes/${index}/${svgIndex}.svg)`});
    },

    setNewShape: async (index) => {
        let randomColor = view.colors[Math.floor(Math.random() * view.colors.length)];
        let randomShapeIndex = Math.floor(Math.random() * 4);
        
        $(`#i_${index}`).removeClass("loading");
        $(`#i_${index}`).css("transition", "0s");
        $(`#i_${index}`).css({"background-color": randomColor, "-webkit-mask": `url(shapes/${index}/${randomShapeIndex}.svg)`});
        await timeout(500);
        $(`#i_${index}`).css("transition", "1s");
    },

    setupFunView: async () => {
        for (let i = 3; i >= 0; i--) {
            view.setShape(i, outcome.shapes[i]);
            $(`#s_${i}`).addClass("pushedLeft");
            await timeout(100);
        }

        $("#topic").addClass("offscreenLeft");
        $("#controller").addClass("closedVertically");
        await timeout(1000);

        $("#instruction").removeClass("over");
        $("#frames").removeClass("offscreenRight");
    },

    onStart: async () => {
        $("#randomizerContainer").addClass("closed");
        $("#frames").addClass("offscreenRight");
        $("#instruction").addClass("over");

        await timeout(1000);

        $("#topic").removeClass("offscreenLeft"); await timeout(500);
    },

    setupRecordingView: async() => {
        $("#topic").addClass("onTop");
        await timeout(700);
        $("#controller").removeClass("closedVertically");
        $("#recorder").removeClass("under");
        
        for (let i = 0; i < 4; i++) {
            $(`#s_${i}`).removeClass("pushedLeft");
            await timeout(100);
        }
    }
}