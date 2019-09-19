// ==UserScript==
// @name            PocketCasts network error retry
// @namespace       pocketcasts-network-error-retry
// @description     When PocketCasts gets a network error, this script tries to start the stream again
// @match           https://play.pocketcasts.com/*
// @require         https://gist.githubusercontent.com/realies/2fece0cd3e197cf6b31ca1316431a2a4/raw/debc0e6d4d537ac228d1d71f44b1162979a5278c/waitForKeyElements.js
// @grant           none
// @version         0.1.0
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==

(() => {
	waitForKeyElements('div.error-title', viewBox => {
		document.querySelector('.play_button').click();
	}, true);
})();
