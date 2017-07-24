/**
 * Хранилище спрайтов
 */
export let spriteStore = {};

export let gameSounds = {};

export let touchEvents = {
	start:    ['mousedown', 'touchstart', 'pointerdown'],
	move:   ['mousemove', 'touchmove', 'pointermove'],
	end:  ['mouseup', 'touchend', 'pointerup'],
	tap: ['tap', 'click', 'pointertap']
};