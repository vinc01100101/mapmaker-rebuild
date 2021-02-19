const imageBitmaps = {};

self.onmessage = (e) => {
	switch (e.data.type) {
		case "toBitMap":
			async function toBitMap() {
				const blobData = await fetch(e.data.path)
					.then((d) => d.blob())
					.catch((e) => {
						console.log("Error fetching: " + e.data.path);
					});
				await createImageBitmap(blobData).then((d) => {
					imageBitmaps[e.data.name] = d;
					self.postMessage({
						type: "to bitmap success",
						name: e.data.name,
					});
				});

				blobData();
			}

			break;
	}
};
