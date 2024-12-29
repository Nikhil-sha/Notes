const topicHeading = document.getElementById("topic");
const introductionSection = document.getElementById("introduction");
const derivationSection = document.getElementById("derivation");
const exampleSection = document.getElementById("example");

const currentUrl = window.location.href;
const urlObj = new URL(currentUrl);
const queryChapter = urlObj.searchParams.get("chapter");
const queryFormula = urlObj.searchParams.get("formula");

function addListItem(container, content) {
	const listItem = document.createElement('li');
	listItem.textContent = content;
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
	keywords = "Physics formula"
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

async function loadFormula() {
	try {
		if (!queryChapter || !queryFormula) {
			topicHeading.textContent = "Invalid Formula";
			introductionSection.querySelector('h2').textContent = "Missing Parameters";
			introductionSection.querySelector('p').textContent = "Please provide valid chapter and formula details.";
			return;
		}

		const chapterData = await fetch(`/scripts/data/chapters/${decodeURIComponent(queryChapter)}.json`);
		if (!chapterData.ok) throw new Error("Failed to fetch chapter data!");

		const chapterDataJson = await chapterData.json();
		const formula = chapterDataJson.find(f => f.topic_name === decodeURIComponent(queryFormula));

		if (!formula) throw new Error("Formula not found!");

		// Set topic heading
		topicHeading.textContent = formula.topic_name;

		// Populate definition
		if (formula.definition) {
			const introTitle = introductionSection.querySelector('h2');
			const introText = introductionSection.querySelector('p');
			introTitle.textContent = "Definition";
			introText.textContent = formula.definition;
		}

		// Populate equation
		if (formula.equation) {
			const introEquation = introductionSection.querySelector('span');
			const introList = introductionSection.querySelector('ul');
			introEquation.textContent = formula.equation.formula;

			Object.entries(formula.equation.terms).forEach(([term, description]) => {
				addListItem(introList, `${term}: ${description}`);
			});
		}

		// Populate derivation
		if (formula.derivation) {
			const derivationTitle = derivationSection.querySelector('h2');
			const derivationList = derivationSection.querySelector('ul');
			const derivationResult = derivationSection.querySelector('p');
			derivationTitle.textContent = "Derivation";

			formula.derivation.steps.forEach(step => addListItem(derivationList, step));
			derivationResult.textContent = formula.derivation.result;
			derivationSection.classList.remove("hidden");
		}

		// Populate example
		if (formula.example) {
			const exampleTitle = exampleSection.querySelector('h2');
			const exampleList = exampleSection.querySelector('ul');
			const exampleResult = exampleSection.querySelector('p');
			exampleTitle.textContent = "Example";

			formula.example.steps.forEach(step => addListItem(exampleList, step));
			exampleResult.textContent = formula.example.result;
			exampleSection.classList.remove("hidden");
		}

		addMetaTags({
			description: formula.definition,
			title: formula.topic_name,
			ogTitle: formula.topic_name,
			ogDescription: formula.definition,
			twitterCard: "summary_large_image",
			author: "Nikhil Sharma",
			keywords: formula.topic_name
		});

	} catch (error) {
		topicHeading.textContent = "404";
		introductionSection.querySelector('h2').textContent = "Formula not found!";
		introductionSection.querySelector('p').textContent = "An error occurred while fetching the formula.";
		console.error(error); // Log error for debugging
	}
}

window.onload = loadFormula;