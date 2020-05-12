// ==UserScript==
// @name            PocketCasts network error retry
// @namespace       pocketcasts-network-error-retry
// @description     When PocketCasts gets a network error, this script tries to start the stream again
// @match           https://play.pocketcasts.com/*
// @grant           none
// @version         0.2.0
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @updateURL       https://github.com/Denocle/pocketcasts-network-error-retry/raw/master/pocketcasts-network-error-retry.user.js
// @downloadURL     https://openuserjs.org/install/Denocle/PocketCasts_network_error_retry.user.js
// @run-at          document-start
// ==/UserScript==

// This "addEventListener" override example code is taken from: https://stackoverflow.com/a/22841712/1713635
(function() {
    Element.prototype._addEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function(a, b, c) {
        this._addEventListener(a, b, c);
        if (!this.eventListenerList) {
            this.eventListenerList = {};
        }
        if (!this.eventListenerList[a]) {
            this.eventListenerList[a] = [];
        }
        this.eventListenerList[a].push(b);
    };
})();

function networkErrorRetryHandler(event) {
    console.log('[Network Error Retry] Error event triggered', event);
    if (!event.target.error) {
        console.log('[Network Error Retry] No MediaError, nothing to handle');
        return;
    }
    console.log('[Network Error Retry] MediaError found', event.target.error);
    // Just empty src attribute, not real error
    if (event.target.error.code === 4) {
        console.log('[Network Error Retry] Just missing src attribute, nothing to fix');
        return;
    }
    console.log('[Network Error Retry] Playing audio again');
    event.target.play();
}

function attachHandler() {
    // Run as interval in case the player element hasn't rendered yet
    const i = setInterval(() => {
        const player = document.querySelector('.audio');
        if (player) {
            player.addEventListener('error', networkErrorRetryHandler);
            console.log('[Network Error Retry] Handler attached!');
            clearInterval(i);
            return;
        }
        console.log('[Network Error Retry] No player found');
    }, 100);
}

// Start by attaching the handler
console.log('[Network Error Retry] Running');
attachHandler();

// Every 5 seconds, make sure that our handler is still attached.
// PocketCasts have a habit of removing our event listener.
setInterval(() => {
    const p = document.querySelector('.audio');
    const attachedHandlers = p.eventListenerList.error.map(f => f.name);
    if (!attachedHandlers.includes('networkErrorRetryHandler')) {
        console.error('[Network Error Retry] Our handler is gone! Attaching again', p.eventListenerList.error);
        attachHandler();
    }
}, 5000);
