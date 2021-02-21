const worker = require("./webworker-events");

function AssetsDownloader() {
	this.download = (assets) => {
		//default and owned tilesets
		for (let i = 0; i < assets.length; i++) {
			console.log("Processing asset: " + assets[i].name);
			worker([
				{
					type: "toBitMap",
					name: assets[i].name,
					group: assets[i].group,
					path: assets[i].path,
				},
			]);
		}
	};
}

module.exports = AssetsDownloader;
