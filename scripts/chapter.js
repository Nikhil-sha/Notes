const pageHeading = document.getElementById('pageHeading');
const pageSubHeading = document.getElementById('pageSubHeading');
const pageParagraph = document.getElementById('pageParagraph');
const formulaListContainer = document.getElementById("formulaList");

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
const queryChapter = urlObj.searchParams.get("chapter");

function addListItem(container, content, href = null) {
	const listItem = document.createElement('li');
	listItem.innerHTML = href ?
		`<a href="${href}" class="text-blue-600 hover:underline">${content}</a>` :
		content;
	container.appendChild(listItem);
}

function addMetaTags({
	description = "",
	title = "",
	ogTitle = title,
	ogDescription = description,
	ogImage = "", // Optional, add URL of image for OG
	twitterCard = "summary_large_image",
	author = "Nikhil Sharma",
	keywords = "chapter"
}) {
	// Add meta description
	let metaDescription = document.createElement('meta');
	metaDescription.name = "description";
	metaDescription.content = description;
	document.head.appendChild(metaDescription);

	// Add Open Graph title
	let metaOGTitle = document.createElement('meta');
	metaOGTitle.setAttribute("property", "og:title");
	metaOGTitle.content = ogTitle;
	document.head.appendChild(metaOGTitle);

	// Add Open Graph description
	let metaOGDescription = document.createElement('meta');
	metaOGDescription.setAttribute("property", "og:description");
	metaOGDescription.content = ogDescription;
	document.head.appendChild(metaOGDescription);

	// Add Open Graph image (optional)
	if (ogImage) {
		let metaOGImage = document.createElement('meta');
		metaOGImage.setAttribute("property", "og:image");
		metaOGImage.content = ogImage;
		document.head.appendChild(metaOGImage);
	}

	// Add Twitter card type
	let metaTwitterCard = document.createElement('meta');
	metaTwitterCard.name = "twitter:card";
	metaTwitterCard.content = twitterCard;
	document.head.appendChild(metaTwitterCard);

	// Add meta author
	let metaAuthor = document.createElement('meta');
	metaAuthor.name = "author";
	metaAuthor.content = author;
	document.head.appendChild(metaAuthor);

	// Add meta keywords
	let metaKeywords = document.createElement('meta');
	metaKeywords.name = "keywords";
	metaKeywords.content = keywords;
	document.head.appendChild(metaKeywords);
}

async function loadChapterInfo() {
	try {
		if (!queryChapter) throw new Error("Invalid Chapter!");

		const chapterData = await fetch('/scripts/data/chapters.json');
		if (!chapterData.ok) throw new Error("Failed to fetch chapter data!");

		const chapterDataJson = await chapterData.json();
		const chapterInfo = chapterDataJson.find(chapter => chapter.url === queryChapter);

		if (!chapterInfo) throw new Error("Chapter not found!");

		// Set page content
		pageHeading.textContent = chapterInfo.name;
		pageSubHeading.textContent = "Summary of the chapter:";
		pageParagraph.textContent = chapterInfo.summary;

		// Set document metadata
		addMetaTags({
			description: chapterInfo.summary,
			title: chapterInfo.name,
			ogTitle: chapterInfo.name,
			ogDescription: chapterInfo.summary,
			twitterCard: "summary_large_image",
			author: "Nikhil Sharma",
			keywords: chapterInfo.name
		});

	} catch (error) {
		pageHeading.textContent = "404";
		pageSubHeading.textContent = "Resource Not Found!";
		pageParagraph.textContent = error.message || "An error occurred.";
	}
}

async function loadFormulaList() {
	try {
		if (!queryChapter) throw new Error("Invalid Chapter!");

		const queryChapterData = await fetch('/scripts/data/chapters/' + queryChapter + '.json');
		if (!queryChapterData.ok) throw new Error("Failed to fetch formulas!");

		const formulas = await queryChapterData.json();
		if (!formulas.length) throw new Error("No formulas found!");

		formulas.forEach(formula => {
			const href = `/pages/formula.html?chapter=${encodeURIComponent(queryChapter)}&formula=${encodeURIComponent(formula.topic_name)}`;
			addListItem(formulaListContainer, formula.topic_name, href);
		});
	} catch (error) {
		addListItem(formulaListContainer, error.message || "No formulas available for this chapter!");
	}
}

window.onload = async () => {
	await loadChapterInfo();
	await loadFormulaList();
};