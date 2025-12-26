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

    // ============================================
    // CAT PATROL AI
    // ============================================

    const CAT_CONFIG = {
        baseSpeed: 30, // pixels per second
        speedVariance: 0.4, // +/- 40%
        minIdleTime: 1000,
        maxIdleTime: 3000,
        spriteWidth: 64
    };

    class PatrolCat {
        constructor(element, platformWidth) {
            this.element = element;
            this.img = element.querySelector('img');
            this.platformWidth = platformWidth;

            // Random speed variance
            const variance = 1 + (Math.random() * CAT_CONFIG.speedVariance * 2 - CAT_CONFIG.speedVariance);
            this.speed = CAT_CONFIG.baseSpeed * variance;

            // Start at random position
            this.x = Math.random() * (platformWidth - CAT_CONFIG.spriteWidth);
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.state = 'walking'; // 'walking' or 'idle'
            this.idleTimeout = null;

            this.updatePosition();
            this.updateSprite();
        }

        updatePosition() {
            this.element.style.left = this.x + 'px';
        }

        updateSprite() {
            if (this.state === 'walking') {
                this.img.src = this.direction === 1
                    ? '/sprites/cat/run_east.gif'
                    : '/sprites/cat/run_west.gif';
            } else {
                this.img.src = this.direction === 1
                    ? '/sprites/cat/idle_east.gif'
                    : '/sprites/cat/idle_west.gif';
            }
        }

        update(deltaTime) {
            if (this.state !== 'walking') return;

            // Move cat
            this.x += this.direction * this.speed * (deltaTime / 1000);

            // Check boundaries
            const minX = 0;
            const maxX = this.platformWidth - CAT_CONFIG.spriteWidth;

            if (this.x <= minX || this.x >= maxX) {
                this.x = Math.max(minX, Math.min(maxX, this.x));
                this.startIdle();
            }

            this.updatePosition();
        }

        startIdle() {
            this.state = 'idle';
            this.updateSprite();

            const idleTime = CAT_CONFIG.minIdleTime +
                Math.random() * (CAT_CONFIG.maxIdleTime - CAT_CONFIG.minIdleTime);

            this.idleTimeout = setTimeout(() => {
                this.direction *= -1; // Turn around
                this.state = 'walking';
                this.updateSprite();
            }, idleTime);
        }

        excite() {
            // Called on platform hover - speed up temporarily
            if (this.state === 'idle' && this.idleTimeout) {
                clearTimeout(this.idleTimeout);
                this.direction *= -1;
                this.state = 'walking';
                this.updateSprite();
            }
        }
    }

    // Cat instances
    let cats = [];

    function initCats() {
        const platforms = document.querySelectorAll('.platform');

        platforms.forEach((platform, index) => {
            const catElement = platform.querySelector('.cat');
            if (!catElement) return;

            const platformWidth = platform.offsetWidth;
            const cat = new PatrolCat(catElement, platformWidth);
            cats.push(cat);

            // Hover interaction
            platform.addEventListener('mouseenter', () => cat.excite());
        });

        console.log(`Initialized ${cats.length} patrol cats`);
    }

    // Animation loop for cats
    let lastTime = 0;

    function animateCats(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        cats.forEach(cat => cat.update(deltaTime));

        requestAnimationFrame(animateCats);
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        initDayNight();
        initCats();
        requestAnimationFrame(animateCats);
        console.log('Chaos initialized');
    });

})();
