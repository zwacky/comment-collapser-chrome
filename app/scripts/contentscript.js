'use strict';

var sites = {
	reddit: {
		url: 'https://www.reddit.com/r/',
		expandSelector: 'a.expand'
	},
	hackernews: {
		url: 'https://news.ycombinator.com/item',
		expandSelector: 'a.togg'
	}
};
var expands = null;
var currentExpandElement = null;
var expandSelector = (location.href.indexOf(sites.reddit.url) !== -1) ?
	sites.reddit.expandSelector :
	sites.hackernews.expandSelector;

updateExpands();
registerExpandClickEvents();


// go to next expand button
window.addEventListener('keydown', function (evt) {
	// don't run shortcuts when modifiers & comment box is in focus
	if (!hasModifierKeysActive(evt) && isCommentBoxFocused()) {
		return;
	}

	// register "f" to next expand button
	if (evt.keyCode === 74) {
		moveToExpand(1);
	}

	// register "k" to previous expand button
	if (evt.keyCode === 75) {
		moveToExpand(-1);
	}

	if (evt.keyCode === 32) {
		toggleComment(evt);
	}
});

function hasModifierKeysActive(evt) {
	return ['shiftKey', 'metaKey', 'ctrlKey']
		.map(function (key) { return evt[key]; })
		.filter(function (value) { return value; })
		.length > 0;
}

function isCommentBoxFocused() {
	return ['TEXTAREA', 'INPUT'].indexOf(document.activeElement.tagName) !== -1;
}

/**
 * scrolls the user to the next expand comment.
 * 
 * @param direction either 1, -1
 */
function moveToExpand(direction) {
	// go through expands to mach currentExpandElement and then move accordingly
	var currentExpandIndex = expands
		.reduce(function (root, item, index) {
			return (item === currentExpandElement) ?
				index :
				root;
		}, null);

	var targetExpandIndex = (direction > 0) ?
		((currentExpandIndex !== null && currentExpandIndex !== expands.length - 1) ? currentExpandIndex + 1 : 0) :
		((currentExpandIndex !== null && currentExpandIndex !== 0) ? currentExpandIndex - 1 : 0);


	// setting current expand element
	currentExpandElement = expands[targetExpandIndex];

	// scrolling to current expand element
	scrollTo(currentExpandElement);
}

// everytime a comment toggle happens -> set currentExpandElement

function toggleComment(evt) {
	if (currentExpandElement === null) {
		return;
	}
	// prevent default scroll 1 page length down
	evt.preventDefault();

	currentExpandElement.click();
}

function scrollTo(element) {
	element.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
}

function updateExpands() {
	// check if we are on hacker news or reddit
	expands = Array.prototype.slice.call(document.querySelectorAll(expandSelector))
		.filter(function (el) { return el.offsetWidth !== 0 && el.offsetHeight !== 0; }); // check for non-hidden elements only
}

/**
 * whenever a user clicks an expand button, that expand button will be treated as the `currentExpandElemen`.
 * since through toggling comments they can be hidden or shown, the clicks need to be removed and added at every `toggleComment`.
 */
function registerExpandClickEvents() {
	expands.forEach(function (expand) {
		expand.addEventListener('click', setCurrentExpandElementByClick);
	});
}

/**
 * removes the click handler from expand buttons.
 */
function unregisterExpandClickEvents() {
	expands.forEach(function (expand) {
		expand.removeEventListener('click', setCurrentExpandElementByClick)
	});
}

function setCurrentExpandElementByClick(evt) {
	currentExpandElement = evt.target;

	unregisterExpandClickEvents();
	updateExpands();
	registerExpandClickEvents();
}