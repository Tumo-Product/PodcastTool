axios.defaults.baseURL = "https://content-tools.tumo.world:4000";

const network = {
    getData: async () => {
        let url = new URL(document.location.href);
        let lan = url.searchParams.get("lan");
        let id  = url.searchParams.get("id");
        let getString = `data/${lan}/${id}.json`;
        let data;
        
        await $.get(getString, function (json) { data = json; });
        return data;
    },

    getRandomFile: async (dir) => {
        let data = await axios.post("video/getrandomfile", {dir: "podcast/" + dir});
		let baseData = data.data.data;
		return baseData;
    },

    getFile : async (path) => {
		let data = await axios.post("video/getfile", {path: "podcast/" + path});
		let baseData = data.data.data;
		return baseData;
	}
}