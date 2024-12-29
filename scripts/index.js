const chapterListContainer = document.getElementById("chapterList");

async function loadChapterList() {
	if (!chapterListContainer) {
		console.error("Chapter list container not found.");
		return;
	}

	try {
		const response = await fetch('/scripts/data/chapters.json');
		if (!response.ok) {
			console.error(`Error: ${response.status} - ${response.statusText}`);
			alert("Failed to load chapters. Please try again later.");
			return;
		}

		const chapters = await response.json();
		const fragment = document.createDocumentFragment();

		chapters.forEach(chapter => {
			const listItem = document.createElement('li');
			const anchor = document.createElement('a');
			anchor.href = '/pages/chapter.html?chapter=' + encodeURIComponent(chapter.url);
			anchor.textContent = chapter.name;
			anchor.className = "text-blue-600 hover:underline";
			listItem.appendChild(anchor);
			fragment.appendChild(listItem);
		});

		chapterListContainer.innerHTML = ""; // Clear the loading message if any
		chapterListContainer.appendChild(fragment);
	} catch (e) {
		console.error(e);
		alert("An error occurred while loading chapters.");
	}
}

loadChapterList();