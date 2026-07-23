# Dipper Game Project Brief

## Authority and status

The user explicitly identified this project as a 2D scroller and supplied the `reference/` folder as its design material. The remaining brief is a consolidated interpretation of those references. Treat items under “Open decisions” as unresolved.

## Core concept

- Build a whimsical 2D side-scrolling platform game around a round, expressive mascot called Dipper.
- Organize the visual direction around three eras or worlds: Past, Present, and Future.
- Support platform traversal with running or rolling, jumping, landing, turning, and faster dash-like movement.
- Give movement a physical, playful quality through squash, anticipation, airborne poses, impact, and momentum.

## Confirmed prototype decisions

- Use pure JavaScript with Vite as the development and build setup.
- Start with character movement only before adding full levels or other gameplay systems.
- Base the first character on `dipper-expression-movement-sheet-color.png`.
- Use `dipper-logo.PNG` as the official top-left and character-body logo.
- Render Dipper as a side-facing SVG character.
- Use only the round head and round body in the first version, with no feet or other limbs.
- Use the authorized local copy of the selected “Cloud Animation” video as the full-screen looping background instead of drawn SVG clouds.
- Keep gameplay state and physics separate from SVG rendering for maintainability.
- Present the game as a full-screen experience with an aspect-responsive SVG camera.
- The current keyboard and touch inputs are prototype controls, not the locked final control scheme.

## Character direction

Dipper has a two-circle body, large expressive eyes, small limbs, and a prominent `D` or Dipper emblem. The reference material explores:

- running left and right;
- jump anticipation, ascent, peak, descent, and landing;
- diagonal airborne motion;
- quick dashes;
- turning around;
- surprise, anger, happiness, dizziness, and other expressions.

The present-era treatment is primarily white with blue linework. The past-era treatment is metallic gold on dark backgrounds. Use the black, white, and purple artwork in `dipper-logo.PNG` as the selected emblem.

## World art direction

### Past

- Metallic gold platforms and character treatment.
- Deep burgundy, maroon, black, and warm gold palette.
- Ornate baroque or rococo patterns, carved trim, velvet, polished metal, and luxury materials.
- Mood references include decorative fabric, a burgundy classic car, a gilded palace interior, and red opera seating.

### Present

- White platforms with blue outlines or blue shading darker than the sky.
- Bright blue sky with large white clouds.
- Lined-paper, notebook, blueprint, or hand-drawn presentation style.
- Clean and light appearance with decorative blue borders.

### Future

- Smooth white forms and realistic white clouds.
- The references define this era less precisely than Past and Present.

## Gameplay interpretation

The sketches suggest the following gameplay vocabulary:

- horizontal platforms or “bricks,” including moving platforms;
- platform speed increasing during a level;
- gaps, drops, and a designated safe zone;
- springs that launch Dipper across gaps or into safe areas;
- a possible 100-second timer;
- a goal marker, silver coin, or glowing spiral portal;
- keyboard-style left/right movement and a jump input;
- rolling or dashing as both traversal and a possible attack.

These are design directions, not final tuning values.

## Hazards and interactions

- Cactus collision may remove a life and possibly collected gems.
- Star-shaped enemies appear to hover or shake; an attacked version shows a changed or damaged form.
- “Jelly Roll” objects may roll off ledges or make the character smaller.
- Some sketches show clustered, flower-like objects as pickups, hazards, or speed powers.
- Springs expand or compress and launch the player.

## Collectibles and powers

- Musical notes: collectible items associated with exclusive or unreleased sounds; disappear when collected.
- Silver coin: appears connected to a later or final level and a larger collection requirement.
- Diamond: grants bonus gems.
- Flower-like pickup: appears associated with speed.
- Jelly item: may shrink Dipper.
- Spiral: likely a goal, portal, checkpoint, or completion marker.

The exact requirements written around the silver coin are difficult to read and must not be implemented without confirmation.

## Audio and product notes

The production notes call for sounds for:

- background ambience or music;
- start and end;
- roll, jump, spring, and powers;
- level-up and level-complete;
- menu interactions;
- speed effects;
- separate sounds for different worlds.

The notes also ask questions about rewards, signup, payment, and a leaderboard. These are exploratory product questions, not approved requirements.

## Open decisions

Confirm these before making consequential design or implementation choices:

1. Exact win condition and the role of the silver coin or spiral.
2. Level count and how Past, Present, and Future connect.
3. Final control scheme: Up, Space, both, or touch controls.
4. Whether Down has a gameplay function.
5. Attack input and whether roll or dash is the attack.
6. Collision penalties, lives, checkpoints, and whether collected gems are lost.
7. Exact behavior of stars, jelly rolls, flowers, notes, diamonds, and springs.
8. Final Dipper proportions, colors, and production sprite style beyond the approved footless side-view prototype.
9. Target device, viewport, aspect ratio, and orientation.
10. Timer behavior and whether 100 seconds is final.
11. Menus, rewards, leaderboard, accounts, and monetization.
12. Future-era visual language beyond smooth white forms and clouds.

## Reference index

### Character and animation

- `dipper-movement-animation-sheet-monochrome.png`
- `dipper-expression-movement-sheet-color.png`
- `dipper-expression-movement-sheet-outline.png`
- `dipper-expression-movement-sheet-simple-logo.png`
- `dipper-logo.PNG`
- `dipper-present-animation-sheet-variant-1.png`
- `dipper-present-animation-sheet-variant-2.png`
- `dipper-present-animation-poster.png`
- `dipper-past-animation-sheet.png`

### Gameplay and level sketches

- `gameplay-mechanics-overview-sketch.jpg`
- `gameplay-mechanics-overview-spatial.heic`
- `roll-and-attack-mechanics-sketch.jpg`
- `core-gameplay-loop-notes.jpg`
- `platform-hazard-layout-sketch.jpg`
- `platform-layout-safe-zone-sketch.jpg`
- `collectibles-and-powerups-notes.jpg`

### Visual and production notes

- `era-platform-design-notes.jpg`
- `era-platform-style-notes.jpg`
- `world-background-color-notes.jpg`
- `game-asset-checklist.jpg`
- `audio-menu-and-rewards-notes.jpg`
- `audio-feature-notes-rotated.jpg`
- `future-cloud-background-reference.jpg`

### Past-era mood references

- `past-baroque-fabric-reference.jpg`
- `past-classic-car-reference.jpg`
- `past-baroque-interior-reference.jpg`
- `past-opera-seating-reference.jpg`
