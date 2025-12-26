// ABOUTME: Main JavaScript for pixel chaos bio page
// ABOUTME: Handles cat patrol AI, falling sprites, chaos escalation, day/night

(function() {
    'use strict';

    // ============================================
    // DAY/NIGHT DETECTION
    // ============================================

    function initDayNight() {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour >= 18;

        if (isNight) {
            document.body.classList.add('night');
        } else {
            document.body.classList.remove('night');
        }

        console.log(`Time: ${hour}:00 - Mode: ${isNight ? 'night' : 'day'}`);
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        initDayNight();
        console.log('Chaos initialized');
    });

})();
