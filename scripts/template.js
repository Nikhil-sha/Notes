// Toggle Dropdown
const menuButton = document.getElementById("menuButton");
const dropdownMenu = document.getElementById("dropdownMenu");

menuButton.addEventListener("click", () => {
	const isHidden = dropdownMenu.classList.toggle("hidden");
	menuButton.setAttribute("aria-expanded", !isHidden);
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
	if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
		dropdownMenu.classList.add("hidden");
		menuButton.setAttribute("aria-expanded", false);
	}
});

// Breadcrumb Functionality
function breadcrumb(url = window.location.toString()) {
	const breadcrumbParent = document.getElementById("breadcrumb");
	if (!breadcrumbParent) return;

	// Style for breadcrumb container
	breadcrumbParent.classList = 'w-full max-w-3xl mx-auto mt-4 px-2';
	const breadcrumbChild = document.createElement('div');
	breadcrumbChild.classList = 'px-2 py-2 text-gray-400 font-bold text-xs border-y border-gray-100 space-x-2';

	// Helper function to add breadcrumb items
	const addBreadcrumb = (label, href) => {
		const span = document.createElement('span');
		span.innerHTML = `<i class="fa-solid fa-sm fa-angle-right mr-2"></i>
            <a href="${href}" class="hover:underline">${label}</a>`;
		breadcrumbChild.appendChild(span);
	};

	// Parse URL
	const urlObject = new URL(url);
	const urlParts = urlObject.pathname.split('/').filter(Boolean); // Remove empty parts
	const urlParams = urlObject.searchParams;

	// Always add 'Home' link
	addBreadcrumb('Home', '/');

	// Handle URL path parts
	let cumulativePath = '';
	urlParts.forEach((part, index) => {
		cumulativePath += `/${part}`;
		if (index === 0 && part === 'pages') return; // Skip 'pages' directory in breadcrumb
		addBreadcrumb(part.replace(/\.html$/, ''), cumulativePath);
	});

	// Handle 'chapter' query parameter
	if (urlParams.has('chapter')) {
		const chapter = urlParams.get('chapter');
		addBreadcrumb(chapter.replace('-', ' '), `/pages/chapter.html?chapter=${chapter}`);
	}

	// Handle 'formula' query parameter
	if (urlParams.has('formula')) {
		const formula = urlParams.get('formula');
		const chapter = urlParams.get('chapter');
		addBreadcrumb(formula.replace('-', ' '), `/pages/formula.html?chapter=${chapter}&formula=${formula}`);
	}

	// Append the constructed breadcrumb
	breadcrumbParent.appendChild(breadcrumbChild);
}

// Initialize breadcrumb
breadcrumb();