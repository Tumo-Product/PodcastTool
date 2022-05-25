axios.defaults.baseURL = "https://content-tools.tumo.world:4000";

const network = {
    getData: async () => {
        let href = document.location.href;
        let splitPath = href.split("/");
        let string = splitPath[splitPath.length - 2];
        let getString = `../data/${string}.json`;
        let data;
        
        await $.get(getString, function (json) { data = json; });
        return data;
    },

    getRandomFile: async (taskDir, dir) => {
        let data = await axios.post("video/getrandomfile", {dir: `recordings/${taskDir}/${dir}`});
		let baseData = data.data.data;
		return baseData;
    },

    getFile : async (taskDir, path) => {
		let data = await axios.post("video/getfile", {path: `recordings/${taskDir}/${path}`});
		let baseData = data.data.data;
		return baseData;
	},
    
    upload: async (taskDir, files) => {
        

        for (let i = 0; i < files.length; i++) {
            let fileName = generateHash(i) + ".wav";
            let renamedFile = await network.renameFile(files[i], fileName);

            try {
                let formData = new FormData();
                formData.append("files", renamedFile);
                formData.append("dir", `recordings/${taskDir}/${i.toString()}`);

                let request = await axios.post("video/upload", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(request);
            } catch {
                console.log("error uploading file");
                break;
            }
        }
    },

    renameFile: async (file, fileName) => {
        let blob = file.slice(0, file.size, file.type);
        return new File([blob], fileName, {type: file.type});
    }
}