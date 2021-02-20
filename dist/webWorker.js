const imageBitmaps = {};
console.log("Called webworker");
onmessage = (e) => {
	switch (e.data.type) {
		case "getArrayImgBitmap":
			const ret = {};
			e.data.names.map((x) => {
				ret[x] = imageBitmaps[x];
			});
			postMessage({
				type: "returned a bitmap",
				bitmaps: ret,
				cbid: e.data.cbid,
			});
			break;
		case "toBitMap":
			async function toBitmap() {
				const blobData = await fetch(e.data.path)
					.then((d) => d.blob())
					.catch((e) => {
						console.log("Error fetching: " + e.data.path);
					});
				await createImageBitmap(blobData).then((d) => {
					imageBitmaps[e.data.name] = d;
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
