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

    // ============================================
    // FALLING SPRITES SYSTEM
    // ============================================

    const CHAOS_CONFIG = {
        initialCount: 25,
        escalationInterval: 30000, // 30 seconds
        countIncrement: 15,
        maxCountDesktop: Infinity,
        maxCountMobile: 15,
        spriteSize: 32,
        spriteCols: 4,  // Adjust based on actual spritesheet
        spriteRows: 4,
        baseSpeed: 50,
        speedVariance: 0.5
    };

    let canvas, ctx;
    let sprites = [];
    let spriteSheet = null;
    let chaosLevel = 0;
    let chaosTimer = null;
    let isMobile = window.innerWidth < 768;

    class FallingSprite {
        constructor() {
            this.reset(true);
        }

        reset(randomY = false) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : -CHAOS_CONFIG.spriteSize;

            // Random sprite from sheet
            this.spriteX = Math.floor(Math.random() * CHAOS_CONFIG.spriteCols);
            this.spriteY = Math.floor(Math.random() * CHAOS_CONFIG.spriteRows);

            // Speed with variance
            const variance = 1 + (Math.random() * CHAOS_CONFIG.speedVariance * 2 - CHAOS_CONFIG.speedVariance);
            this.speed = CHAOS_CONFIG.baseSpeed * variance;

            // Chaos-level behaviors
            this.wobbleAmplitude = chaosLevel >= 1 ? Math.random() * 2 : 0;
            this.wobbleSpeed = Math.random() * 3;
            this.rotation = chaosLevel >= 3 ? Math.random() * Math.PI * 2 : 0;
            this.rotationSpeed = chaosLevel >= 3 ? (Math.random() - 0.5) * 2 : 0;
            this.scale = chaosLevel >= 3 ? 0.5 + Math.random() : 1;

            // Chaos level 4+: zigzag
            this.zigzag = chaosLevel >= 4;
            this.zigzagTimer = 0;
            this.horizontalSpeed = 0;
        }

        update(deltaTime) {
            const dt = deltaTime / 1000;

            // Vertical movement
            this.y += this.speed * dt;

            // Wobble
            if (this.wobbleAmplitude > 0) {
                this.x += Math.sin(this.y * 0.02 * this.wobbleSpeed) * this.wobbleAmplitude;
            }

            // Rotation
            if (this.rotationSpeed !== 0) {
                this.rotation += this.rotationSpeed * dt;
            }

            // Zigzag
            if (this.zigzag) {
                this.zigzagTimer += dt;
                if (this.zigzagTimer > 0.5) {
                    this.zigzagTimer = 0;
                    this.horizontalSpeed = (Math.random() - 0.5) * 100;
                }
                this.x += this.horizontalSpeed * dt;
            }

            // Wrap horizontally
            if (this.x < -CHAOS_CONFIG.spriteSize) this.x = canvas.width;
            if (this.x > canvas.width) this.x = -CHAOS_CONFIG.spriteSize;

            // Reset when off bottom
            if (this.y > canvas.height + CHAOS_CONFIG.spriteSize) {
                this.reset();
            }
        }

        draw() {
            if (!spriteSheet) return;

            const srcX = this.spriteX * CHAOS_CONFIG.spriteSize;
            const srcY = this.spriteY * CHAOS_CONFIG.spriteSize;
            const size = CHAOS_CONFIG.spriteSize * this.scale;

            ctx.save();
            ctx.translate(this.x + size/2, this.y + size/2);
            ctx.rotate(this.rotation);
            ctx.drawImage(
                spriteSheet,
                srcX, srcY,
                CHAOS_CONFIG.spriteSize, CHAOS_CONFIG.spriteSize,
                -size/2, -size/2,
                size, size
            );
            ctx.restore();
        }
    }

    function initChaos() {
        canvas = document.getElementById('chaos-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        resizeCanvas();

        // Load spritesheet
        spriteSheet = new Image();
        spriteSheet.src = '/sprites/falling_sprites.png';
        spriteSheet.onload = () => {
            // Create initial sprites
            const count = isMobile ? Math.min(CHAOS_CONFIG.initialCount, CHAOS_CONFIG.maxCountMobile) : CHAOS_CONFIG.initialCount;
            for (let i = 0; i < count; i++) {
                sprites.push(new FallingSprite());
            }
            console.log(`Chaos started with ${sprites.length} sprites`);

            // Start escalation timer (only on desktop)
            if (!isMobile) {
                startEscalation();
            }

            // Start render loop
            requestAnimationFrame(renderChaos);
        };

        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        isMobile = window.innerWidth < 768;
    }

    function startEscalation() {
        chaosTimer = setInterval(() => {
            chaosLevel++;

            // Add more sprites
            const maxCount = isMobile ? CHAOS_CONFIG.maxCountMobile : CHAOS_CONFIG.maxCountDesktop;
            const toAdd = Math.min(CHAOS_CONFIG.countIncrement, maxCount - sprites.length);

            for (let i = 0; i < toAdd; i++) {
                sprites.push(new FallingSprite());
            }

            console.log(`Chaos level ${chaosLevel}: ${sprites.length} sprites`);
        }, CHAOS_CONFIG.escalationInterval);
    }

    let lastChaosTime = 0;

    function renderChaos(currentTime) {
        if (!lastChaosTime) lastChaosTime = currentTime;
        const deltaTime = currentTime - lastChaosTime;
        lastChaosTime = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw sprites
        sprites.forEach(sprite => {
            sprite.update(deltaTime);
            sprite.draw();
        });

        requestAnimationFrame(renderChaos);
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        initDayNight();
        initCats();
        initChaos();
        requestAnimationFrame(animateCats);
        console.log('Chaos initialized');
    });

})();
