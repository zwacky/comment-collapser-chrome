'use strict';

var expands = null;
var currentExpandElement = null;

updateExpands();


// go to next expand button
window.addEventListener('keydown', function(evt) {
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
		.map(function(key) { return evt[key]; })
		.filter(function(value) { return value; })
		.length > 0;
}

function isCommentBoxFocused() {
	return document.querySelector('textarea[data-event-action="comment"]') === document.activeElement;
}

/**
 * scrolls the user to the next expand comment.
 * 
 * @param direction either 1, -1
 */
function moveToExpand(direction, isMoving) {
	if (currentExpandElement === null) {
		currentExpandElement = expands[0];
	}

	// go through expands to mach currentExpandElement and then move accordingly
	var currentExpandIndex = expands
		.reduce(function(root, item, index) {
			return (item === currentExpandElement) ?
				index :
				root;
		}, 0);
	
	var targetExpandIndex = (direction > 0) ?
		((currentExpandIndex !== expands.length - 1) ? currentExpandIndex + 1 : 0) :
		((currentExpandIndex !== 0) ? currentExpandIndex - 1 : 0);
	
	// setting current expand element
	currentExpandElement = expands[targetExpandIndex];
	
	// scrolling to current expand element
	scrollTo(currentExpandElement);
}

function toggleComment(evt) {
	if (currentExpandElement === null) {
		return;
	}
	// prevent default scroll 1 page length down
	evt.preventDefault();

	currentExpandElement.click();

	updateExpands();
}

function scrollTo(element) {
	// element.scrollIntoView(true);
	element.scrollIntoView({block: 'start', inline: 'start', behavior: 'smooth'});
}

function updateExpands() {
	expands = Array.prototype.slice.call(document.querySelectorAll('a.expand'))
		.filter(function(el) { return el.offsetWidth !== 0 && el.offsetHeight !== 0; }); // check for non-hidden elements only
}