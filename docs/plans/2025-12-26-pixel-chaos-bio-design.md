# Pixel Chaos Bio Page Design

## Overview

Transform dylanreed.com from a standard link-in-bio page into a full-screen pixel art chaos experience featuring floating island platforms, patrolling cats, and escalating falling sprite madness.

## Core Concept

- Full-viewport experience with scattered floating platforms
- Each link is a pixel-art platform with its own cat walking back and forth
- Falling sprites rain down, escalating in intensity the longer you stay
- Auto day/night based on visitor's local time
- Real Gravatar photo floating at center of pixel chaos

## Layout

### Desktop (768px+)

**Header Zone:**
- Gravatar centered in upper area
- Name in MedievalSharp font below
- Headline text below name

**Platform Zone:**
- 7 floating island platforms scattered organically across the screen
- Not a grid - staggered left/right, varied vertical spacing
- Each platform ~200-250px wide
- Positions feel like a platformer game level

**Links:**
1. Contact me (email)
2. My blog (dylan.blog)
3. GitHub
4. OpenSea
5. Instagram
6. LinkedIn
7. About (dylan.blog/who-is/)

### Mobile (under 768px)

- Gravatar + name + headline centered at top
- Platforms stack vertically, full-width
- Cats still patrol each platform
- Falling sprites reduced and capped
- Scrollable if needed

## Cat Behavior

Each platform has one cat sprite using the cabin theme's 8-direction animations.

**Patrol Logic:**
1. Spawn at random position on platform
2. Walk toward one edge using `run_east.gif` or `run_west.gif`
3. On reaching edge, switch to idle animation for 1-3 seconds (random)
4. Turn around, walk other direction
5. Repeat forever

**Individuality:**
- Each cat has randomized speed (0.8x to 1.2x base)
- Random initial position and direction
- Cats are not synchronized - feels alive

**Hover Interaction:**
- When user hovers a platform, that cat speeds up or does excited animation

## Escalating Chaos System

Falling sprites use canvas rendering for performance. Chaos escalates over time:

| Time on Page | Sprite Count | Behaviors |
|--------------|--------------|-----------|
| 0-30 sec | 20-25 | Normal fall, no effects |
| 30-60 sec | 35-40 | Slight wobble |
| 1-2 min | 50-60 | Varying fall speeds |
| 2-3 min | 80-100 | Rotation, size variation |
| 3-5 min | 150+ | Bouncing, zigzag paths |
| 5+ min | Uncapped | Endless escalation |

**Mobile:** Caps at ~15 sprites, slower escalation, moderate chaos maximum.

**Technical:**
- Canvas layer behind all content
- requestAnimationFrame loop
- Sprites recycled (respawn at top when falling off bottom)
- Chaos level variable incremented on timer
- Each tier unlocks new behaviors

## Day/Night System

**Detection:**
- JavaScript checks visitor's local time on page load
- Day: 6 AM - 6 PM
- Night: 6 PM - 6 AM

**Assets:**
- Day: `3.webp` background
- Night: `3_night.webp` background
- Cursors and cats same for both modes

## Visual Assets

All sourced from theme-pixel-art cabin theme:

**Sprites:**
- `/sprites/cat/` - All directional run/idle GIFs
- `/sprites/falling_sprites.png` - Spritesheet for chaos

**Backgrounds:**
- `/backgrounds/3.webp` - Day
- `/backgrounds/3_night.webp` - Night

**Cursors:**
- `/cursors/pointer.png` - Default cursor
- `/cursors/hand.png` - Hover cursor

**Tiles:**
- Platform graphics from cabin tileset

## Technical Implementation

### File Structure

```
dylanreed.com/
├── layouts/
│   └── index.html          # Single page layout
├── static/
│   ├── css/
│   │   └── style.css       # All styles
│   ├── js/
│   │   └── chaos.js        # Cat AI + falling sprites + escalation
│   ├── sprites/
│   │   ├── cat/            # Cat animations
│   │   └── falling_sprites.png
│   ├── backgrounds/
│   │   ├── 3.webp
│   │   └── 3_night.webp
│   ├── cursors/
│   │   ├── pointer.png
│   │   └── hand.png
│   └── tiles/              # Platform graphics
├── config.toml             # Links defined here
└── content/                # Empty (single page site)
```

### Key Components

**chaos.js:**
- Canvas rendering for falling sprites
- Cat patrol AI for each platform
- Chaos timer and escalation logic
- Day/night detection

**style.css:**
- Platform positioning (desktop scattered, mobile stacked)
- Responsive breakpoints
- Custom cursor rules
- MedievalSharp font import
- Animation keyframes

**index.html:**
- Hugo template reading links from config.toml
- Canvas element for sprites
- Platform HTML structure
- Cat image elements

### No External Dependencies

- Vanilla JavaScript only
- No build tools beyond Hugo
- No CSS frameworks
- Canvas API for performance

## Responsive Breakpoints

- **Desktop:** 768px and up - full floating chaos
- **Mobile:** Below 768px - vertical stack, tamed chaos

## Future Considerations

- Easter egg at 10-minute survival mark
- Sound effects (optional, off by default)
- Chaos level indicator/counter
- Screenshot/share functionality
