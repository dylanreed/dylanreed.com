# Pixel Chaos Bio Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform dylanreed.com into a full-screen pixel art chaos experience with floating platform links, patrolling cats, and escalating falling sprite madness.

**Architecture:** Single-page Hugo site with custom layout. Canvas-based sprite rendering for performance. Vanilla JS handles cat patrol AI, falling sprites, chaos escalation timer, and day/night detection. CSS handles platform positioning and responsive breakpoints.

**Tech Stack:** Hugo (static site generator), Vanilla JavaScript, HTML5 Canvas, CSS3

---

## Task 1: Set Up Directory Structure and Copy Assets

**Files:**
- Create: `static/css/style.css`
- Create: `static/js/chaos.js`
- Create: `static/sprites/cat/` (directory)
- Create: `static/sprites/falling_sprites.png`
- Create: `static/backgrounds/3.webp`
- Create: `static/backgrounds/3_night.webp`
- Create: `static/cursors/pointer.png`
- Create: `static/cursors/hand.png`
- Create: `static/tiles/platform.png`
- Remove: `config/_default/module.toml` (ditching Lynx theme)

**Step 1: Create directory structure**

```bash
mkdir -p static/css static/js static/sprites/cat static/backgrounds static/cursors static/tiles
```

**Step 2: Copy cat sprites from cabin theme**

```bash
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/sprites/cat/*.gif static/sprites/cat/
```

**Step 3: Copy falling sprites**

```bash
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/sprites/falling/falling_sprites.png static/sprites/
```

**Step 4: Copy backgrounds**

```bash
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/backgrounds/3.webp static/backgrounds/
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/backgrounds/3_night.webp static/backgrounds/
```

**Step 5: Copy cursors**

```bash
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/cursors/pointer.png static/cursors/
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/cursors/hand.png static/cursors/
```

**Step 6: Copy platform tile (we'll extract from cabin tiles)**

```bash
cp /Users/nervous/Library/CloudStorage/Dropbox/Github/theme-pixel-art/public/cabin/tiles/*.png static/tiles/ 2>/dev/null || echo "Will create platform graphic"
```

**Step 7: Remove Lynx theme dependency**

```bash
rm -f config/_default/module.toml
rm -f go.mod go.sum
```

**Step 8: Verify assets copied**

```bash
ls -la static/sprites/cat/ | head -10
ls -la static/backgrounds/
ls -la static/cursors/
```

**Step 9: Commit**

```bash
git add static/ && git add -u
git commit -m "feat: add pixel art assets from cabin theme

- Cat sprites (8-direction run/idle)
- Falling sprites spritesheet
- Day/night backgrounds
- Cozy cursors
- Remove Lynx theme dependency"
```

---

## Task 2: Create Base HTML Layout

**Files:**
- Create: `layouts/index.html`
- Modify: `config.toml`

**Step 1: Update config.toml with clean link structure**

Replace entire `config.toml` with:

```toml
baseURL = 'https://dylanreed.com/'
languageCode = 'en-us'
title = 'Dylan Reed'

[params]
  name = "Dylan Reed"
  headline = "Creative coder | Puppet wrangler | Animation anarchist"
  image = "https://www.gravatar.com/avatar/36aff981378cc0b408b7d1bc2f082741?s=240&d=mp"

[[params.links]]
  name = "Contact"
  url = "/contact/"
  icon = "email"

[[params.links]]
  name = "Blog"
  url = "https://dylan.blog"
  icon = "blog"

[[params.links]]
  name = "GitHub"
  url = "https://github.com/dylanreed"
  icon = "github"

[[params.links]]
  name = "OpenSea"
  url = "https://opensea.io/dylanreed.eth"
  icon = "opensea"

[[params.links]]
  name = "Instagram"
  url = "https://instagram.com/dylanreed"
  icon = "instagram"

[[params.links]]
  name = "LinkedIn"
  url = "https://www.linkedin.com/in/dylannotdylan/"
  icon = "linkedin"

[[params.links]]
  name = "About"
  url = "https://dylan.blog/who-is/"
  icon = "about"
```

**Step 2: Create base HTML layout**

Create `layouts/index.html`:

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ .Site.Title }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <!-- Falling sprites canvas - behind everything -->
    <canvas id="chaos-canvas"></canvas>

    <!-- Main content -->
    <main class="bio-container">
        <!-- Avatar section -->
        <div class="avatar-section">
            <img src="{{ .Site.Params.image }}" alt="{{ .Site.Params.name }}" class="avatar">
            <h1 class="name">{{ .Site.Params.name }}</h1>
            <p class="headline">{{ .Site.Params.headline }}</p>
        </div>

        <!-- Floating platforms with links -->
        <div class="platforms-container">
            {{ range $index, $link := .Site.Params.links }}
            <div class="platform" data-index="{{ $index }}">
                <div class="platform-ground"></div>
                <a href="{{ $link.url }}" class="platform-link" {{ if hasPrefix $link.url "http" }}target="_blank" rel="noopener"{{ end }}>
                    {{ $link.name }}
                </a>
                <div class="cat" data-cat="{{ $index }}">
                    <img src="/sprites/cat/idle_east.gif" alt="cat">
                </div>
            </div>
            {{ end }}
        </div>
    </main>

    <script src="/js/chaos.js"></script>
</body>
</html>
```

**Step 3: Create empty CSS and JS files**

Create `static/css/style.css`:

```css
/* ABOUTME: Main stylesheet for pixel chaos bio page */
/* ABOUTME: Handles platforms, cats, responsive layout, and chaos aesthetics */

/* Base reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

Create `static/js/chaos.js`:

```javascript
// ABOUTME: Main JavaScript for pixel chaos bio page
// ABOUTME: Handles cat patrol AI, falling sprites, chaos escalation, day/night

console.log('Chaos initialized');
```

**Step 4: Test Hugo builds**

```bash
hugo --minify
```

Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add layouts/index.html config.toml static/css/style.css static/js/chaos.js
git commit -m "feat: add base HTML layout structure

- Custom index.html with platform structure
- Updated config.toml with clean link data
- Placeholder CSS and JS files"
```

---

## Task 3: Implement Base CSS - Background, Cursors, Typography

**Files:**
- Modify: `static/css/style.css`

**Step 1: Add day/night background and cursor styles**

Add to `static/css/style.css`:

```css
/* Custom cursors */
* {
    cursor: url('/cursors/pointer.png'), auto;
}

a, button, .platform-link, [role="button"] {
    cursor: url('/cursors/hand.png'), pointer;
}

/* Full viewport setup */
html, body {
    height: 100%;
    overflow: hidden;
    font-family: 'MedievalSharp', cursive;
}

body {
    background-image: url('/backgrounds/3.webp');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    image-rendering: pixelated;
}

body.night {
    background-image: url('/backgrounds/3_night.webp');
}

/* Chaos canvas - fullscreen behind content */
#chaos-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}

/* Main container */
.bio-container {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
}

/* Avatar section */
.avatar-section {
    text-align: center;
    margin-bottom: 40px;
}

.avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid #5c3d1e;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.name {
    font-size: 2.5rem;
    color: #f5e6d3;
    text-shadow: 3px 3px 0 #2a1a08, -1px -1px 0 #5c3d1e;
    margin-top: 20px;
}

.headline {
    font-size: 1.1rem;
    color: #e8d5b0;
    text-shadow: 2px 2px 0 #2a1a08;
    margin-top: 10px;
    max-width: 400px;
}

/* Night mode text adjustments */
body.night .name {
    color: #d0d8e0;
    text-shadow: 3px 3px 0 #0a1020, 0 0 20px rgba(100, 150, 200, 0.3);
}

body.night .headline {
    color: #a0b0c0;
}
```

**Step 2: Run Hugo server and verify visually**

```bash
hugo server -D -p 1314
```

Open http://localhost:1314 and verify:
- Background shows (day or night based on time)
- Custom cursor appears
- Avatar and text display correctly

**Step 3: Commit**

```bash
git add static/css/style.css
git commit -m "feat: add base CSS with backgrounds, cursors, typography

- Day/night background support
- Custom pixel cursors
- MedievalSharp typography
- Avatar styling"
```

---

## Task 4: Implement Platform Styling - Desktop Layout

**Files:**
- Modify: `static/css/style.css`

**Step 1: Add platform container and scattered positioning**

Add to `static/css/style.css`:

```css
/* Platforms container - scattered layout on desktop */
.platforms-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 600px;
    margin-top: 20px;
}

/* Individual platform */
.platform {
    position: absolute;
    width: 220px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Scattered positions for 7 platforms - feels organic */
.platform[data-index="0"] { left: 5%; top: 0; }
.platform[data-index="1"] { left: 55%; top: 5%; }
.platform[data-index="2"] { left: 20%; top: 20%; }
.platform[data-index="3"] { left: 65%; top: 25%; }
.platform[data-index="4"] { left: 10%; top: 45%; }
.platform[data-index="5"] { left: 50%; top: 50%; }
.platform[data-index="6"] { left: 30%; top: 70%; }

/* Platform ground tile */
.platform-ground {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 24px;
    background: linear-gradient(180deg, #8b6914 0%, #5c4a0e 50%, #3d310a 100%);
    border: 3px solid #2a1a08;
    border-radius: 4px;
    box-shadow:
        inset 0 -4px 0 rgba(0,0,0,0.3),
        0 4px 8px rgba(0,0,0,0.4);
    image-rendering: pixelated;
}

/* Platform link button */
.platform-link {
    position: relative;
    z-index: 2;
    padding: 10px 24px;
    background: linear-gradient(180deg, #c4a060 0%, #9a7a40 100%);
    border: 3px solid #5c3d1e;
    border-radius: 4px;
    color: #2a1a08;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    box-shadow:
        inset 1px 1px 0 #e8d5b0,
        inset -1px -1px 0 #7a5a30,
        3px 3px 0 rgba(0,0,0,0.3);
    transition: transform 0.1s ease, box-shadow 0.1s ease;
    margin-bottom: 8px;
}

.platform-link:hover {
    transform: translateY(-3px);
    box-shadow:
        inset 1px 1px 0 #f0e0c0,
        inset -1px -1px 0 #8a6a40,
        5px 5px 0 rgba(0,0,0,0.25);
    background: linear-gradient(180deg, #d4b070 0%, #aa8a50 100%);
}

.platform-link:active {
    transform: translateY(1px);
    box-shadow:
        inset -1px -1px 0 #e8d5b0,
        inset 1px 1px 0 #7a5a30,
        1px 1px 0 rgba(0,0,0,0.3);
}

/* Cat sprite container */
.cat {
    position: absolute;
    bottom: 20px;
    width: 64px;
    height: 64px;
    z-index: 1;
    pointer-events: none;
}

.cat img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
}

/* Night mode platform adjustments */
body.night .platform-ground {
    background: linear-gradient(180deg, #3a4a5a 0%, #2a3a4a 50%, #1a2a3a 100%);
    border-color: #0a1a2a;
}

body.night .platform-link {
    background: linear-gradient(180deg, #4a5a6a 0%, #3a4a5a 100%);
    border-color: #1a2a3a;
    color: #d0d8e0;
    box-shadow:
        inset 1px 1px 0 #5a6a7a,
        inset -1px -1px 0 #2a3a4a,
        3px 3px 0 rgba(0,0,0,0.4),
        0 0 15px rgba(100, 150, 200, 0.2);
}

body.night .platform-link:hover {
    background: linear-gradient(180deg, #5a6a7a 0%, #4a5a6a 100%);
    box-shadow:
        inset 1px 1px 0 #6a7a8a,
        inset -1px -1px 0 #3a4a5a,
        5px 5px 0 rgba(0,0,0,0.35),
        0 0 20px rgba(100, 150, 200, 0.3);
}
```

**Step 2: Verify in browser**

Refresh http://localhost:1314 and verify:
- Platforms are scattered across screen
- Link buttons have pixel-art styling
- Cat placeholders are visible
- Hover effects work

**Step 3: Commit**

```bash
git add static/css/style.css
git commit -m "feat: add platform styling with scattered desktop layout

- 7 platforms in organic scattered positions
- Pixel-art link buttons with hover effects
- Ground tile styling
- Night mode variants"
```

---

## Task 5: Implement Mobile Responsive Layout

**Files:**
- Modify: `static/css/style.css`

**Step 1: Add mobile breakpoint styles**

Add to `static/css/style.css`:

```css
/* Mobile: Stack platforms vertically */
@media (max-width: 768px) {
    .bio-container {
        padding: 20px 15px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .avatar {
        width: 120px;
        height: 120px;
    }

    .name {
        font-size: 1.8rem;
    }

    .headline {
        font-size: 1rem;
    }

    .platforms-container {
        position: relative;
        width: 100%;
        height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    /* Reset absolute positioning for mobile */
    .platform {
        position: relative !important;
        left: auto !important;
        top: auto !important;
        width: 90%;
        max-width: 300px;
    }

    .platform-link {
        width: 100%;
        text-align: center;
    }

    .cat {
        bottom: 18px;
    }
}

/* Very small phones */
@media (max-width: 400px) {
    .avatar {
        width: 100px;
        height: 100px;
    }

    .name {
        font-size: 1.5rem;
    }

    .headline {
        font-size: 0.9rem;
    }

    .platform {
        width: 95%;
    }

    .platform-link {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
}
```

**Step 2: Test mobile layout**

In browser dev tools, toggle device toolbar and test at:
- 768px width
- 400px width
- 320px width

Verify platforms stack vertically and are centered.

**Step 3: Commit**

```bash
git add static/css/style.css
git commit -m "feat: add mobile responsive layout

- Stacked vertical platforms on mobile
- Adjusted typography sizes
- Full-width link buttons"
```

---

## Task 6: Implement Day/Night Auto-Detection

**Files:**
- Modify: `static/js/chaos.js`

**Step 1: Add day/night detection**

Replace contents of `static/js/chaos.js`:

```javascript
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
```

**Step 2: Test day/night manually**

In browser console, test both modes:
```javascript
document.body.classList.add('night');    // Should show night background
document.body.classList.remove('night'); // Should show day background
```

**Step 3: Commit**

```bash
git add static/js/chaos.js
git commit -m "feat: add day/night auto-detection

- Checks local time on page load
- Night mode: 6 PM - 6 AM
- Day mode: 6 AM - 6 PM"
```

---

## Task 7: Implement Cat Patrol AI

**Files:**
- Modify: `static/js/chaos.js`

**Step 1: Add cat patrol system**

Add to `static/js/chaos.js` (inside the IIFE, after day/night code):

```javascript
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
```

**Step 2: Update DOMContentLoaded to start cats**

Modify the DOMContentLoaded listener:

```javascript
    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        initDayNight();
        initCats();
        requestAnimationFrame(animateCats);
        console.log('Chaos initialized');
    });
```

**Step 3: Test cat patrol**

Refresh browser and verify:
- Cats walk back and forth on each platform
- Cats pause at edges before turning
- Each cat moves at slightly different speed
- Hovering a platform excites that cat

**Step 4: Commit**

```bash
git add static/js/chaos.js
git commit -m "feat: add cat patrol AI

- Each platform has independent patrol cat
- Randomized speeds for individuality
- Idle pause at edges before turning
- Hover interaction excites cats"
```

---

## Task 8: Implement Falling Sprites System

**Files:**
- Modify: `static/js/chaos.js`

**Step 1: Add falling sprites canvas system**

Add to `static/js/chaos.js` (inside IIFE):

```javascript
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
```

**Step 2: Update DOMContentLoaded to start chaos**

Update the listener:

```javascript
    // Initialize on load
    document.addEventListener('DOMContentLoaded', function() {
        initDayNight();
        initCats();
        initChaos();
        requestAnimationFrame(animateCats);
        console.log('Chaos initialized');
    });
```

**Step 3: Test falling sprites**

Refresh browser and verify:
- Sprites fall from top
- Count increases every 30 seconds
- Behaviors escalate (wobble → rotation → zigzag)
- Mobile has fewer sprites

**Step 4: Commit**

```bash
git add static/js/chaos.js
git commit -m "feat: add falling sprites chaos system

- Canvas-based sprite rendering
- Escalating chaos every 30 seconds
- Progressive behaviors: wobble, rotation, zigzag
- Mobile-friendly sprite limits"
```

---

## Task 9: Final Polish and Testing

**Files:**
- Modify: `static/css/style.css` (minor tweaks if needed)
- Modify: `static/js/chaos.js` (minor tweaks if needed)

**Step 1: Add page load animation**

Add to CSS:

```css
/* Page load fade-in */
.bio-container {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Platform hover glow */
.platform:hover .platform-ground {
    box-shadow:
        inset 0 -4px 0 rgba(0,0,0,0.3),
        0 4px 8px rgba(0,0,0,0.4),
        0 0 15px rgba(196, 160, 96, 0.4);
}

body.night .platform:hover .platform-ground {
    box-shadow:
        inset 0 -4px 0 rgba(0,0,0,0.3),
        0 4px 8px rgba(0,0,0,0.4),
        0 0 15px rgba(100, 150, 200, 0.4);
}
```

**Step 2: Full test checklist**

Test all functionality:

- [ ] Page loads with correct day/night mode
- [ ] Avatar displays correctly
- [ ] All 7 link buttons work
- [ ] Cats patrol back and forth on each platform
- [ ] Cats pause at edges
- [ ] Hovering platform excites cat
- [ ] Falling sprites appear and fall
- [ ] Chaos escalates over time (wait 30+ seconds)
- [ ] Mobile layout stacks vertically
- [ ] Mobile has reduced chaos
- [ ] Custom cursors work

**Step 3: Commit final polish**

```bash
git add static/css/style.css static/js/chaos.js
git commit -m "feat: add final polish and animations

- Page load fade-in animation
- Platform hover glow effect
- Complete chaos bio page implementation"
```

---

## Task 10: Clean Up and Deploy

**Files:**
- Remove: `content/about.md`
- Remove: `content/books.md`
- Remove: `content/contact.md`
- Remove: `archetypes/default.md`
- Remove: `assets/css/custom.css`

**Step 1: Remove unused content files**

```bash
rm -rf content/*.md archetypes/ assets/
```

**Step 2: Test production build**

```bash
hugo --minify
ls -la public/
```

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: remove unused content and theme files

Clean slate for pixel chaos bio page"
```

**Step 4: Push to deploy**

```bash
git push origin main
```

GitHub Actions will build and deploy to GitHub Pages.

**Step 5: Verify live site**

Visit https://dylanreed.com and verify everything works.

---

## Summary

Total tasks: 10
Estimated time: 2-3 hours

Key deliverables:
1. Custom Hugo layout with scattered floating platforms
2. Cat patrol AI with individual behaviors
3. Canvas-based falling sprites with escalating chaos
4. Auto day/night detection
5. Responsive mobile layout
6. Pixel art styling throughout
