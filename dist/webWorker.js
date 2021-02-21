const imageBitmaps = {
	tilesets: {},
};
console.log("Called webworker");
onmessage = (e) => {
	switch (e.data.type) {
		//_______GET DATA SECTION_______
		case "getArrayImgBitmap":
			const ret = {};
			e.data.names.map((x) => {
				ret[x] = imageBitmaps[e.data.group][x];
			});
			postMessage({
				value: ret,
				cbid: e.data.cbid,
			});
			break;
		case "getKeyNames":
			postMessage({
				value: Object.keys(imageBitmaps[e.data.group]),
				cbid: e.data.cbid,
			});
			break;
		case "toBitMap":
			async function toBitmap() {
				//fetch the url
				const blobData = await fetch(e.data.path)
					.then((d) => d.blob())
					.catch((e) => {
						console.log("Error fetching: " + e.data.path);
					});
				//generate image bitmap
				await createImageBitmap(blobData).then((d) => {
					//store to our object imageBitmaps
					imageBitmaps[e.data.group][e.data.name] = d;
					postMessage({
						type: "to bitmap success",
						name: e.data.name,
					});
				});
			}
			toBitmap();
			break;
	}
};
