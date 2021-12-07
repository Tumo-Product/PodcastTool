const view = {
    colors:["#966B9D", "#5c7ca6", "#9BC53D", "#FDE74C",
            "#C2423F", "#427AA1", "#333333", "#EF767A",
            "#0B8654", "#BA9BB0", "#AF1B3F", "#FEC600",
            "#456A90", "#49BEAA", "#EA7317", "#003F91",
            "#B1CF5F", "#F1AB86", "#5DA9E8", "#E8EF76"],
    previousStyles: [],

    replaceButton: async (which, button) => {
        $(`#${which} .current`).removeClass("current");
        await timeout(50);
        $(`#${which} ${button}`).addClass("current");
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
        $(`#i_${index}`).css("transition", "0.5s");
    },

    setupFunView: async (shapes) => {
        for (let i = 3; i >= 0; i--) {
            view.setShape(i, shapes[i]);
            $(`#s_${i}`).addClass("pushedLeft");
            await timeout(100);
        }

        $("#topic").addClass("offscreenLeft");
        $("#controller").addClass("closedVertically");
        await timeout(1000);
        $("#instruction").removeClass("over");
        $("#frames").removeClass("offscreenRight");

        if (window.location.href.includes("examiner")) {
            $("#randomizerContainer").addClass("closed");
            $("#rating").removeClass("closed");
        } else {
            $("#randomizerContainer .bar").hide();
            $("#randomizerContainer #start").hide();
            $("#randomizerContainer").removeClass("closed").addClass("closedHalfway");
        }
        
        await timeout(550);
    },

    selectFrame: (index, shapeIndex) => {
        let style = $(`#i_${index}`).attr("style").replaceAll("all 0s", "all 0.5s");
        view.previousStyles[index] = style;
        view.setShape(index, shapeIndex);
        view.replaceButton(`c_${index}`, ".select");
    },

    deselectFrame: (index) => {
        $(`#i_${index}`).attr("style", view.previousStyles[index]);
        view.replaceButton(`c_${index}`, ".deselect");
    },

    onStart: async (text) => {
        $("#randomizerContainer").addClass("closed");
        $("#frames").addClass("offscreenRight");
        view.setInstructionText(text);

        await timeout(1000);

        $("#shuffleTopic").removeClass("under")
        $("#topic").removeClass("offscreenLeft"); await timeout(500);
    },

    pickTopic: async (text) => {
        $("#shuffleTopic").addClass("under");
        $("#topic img").css("opacity", 0); await timeout(200);
        $("#instruction").addClass("over");
        view.setInstructionText(text);
    },

    setInstructionText: (text) => { $("#instruction p").html(text); },

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