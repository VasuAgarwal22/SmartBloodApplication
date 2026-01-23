# Login Page UI Fixes

## Issues to Fix
- [x] Remove uncomfortable blur effects on hover (backdrop-blur, 3D rotations)
- [x] Contain visual effects within card boundaries (overflow-hidden)

## Changes Needed
- [x] Change card background from `bg-white/80 backdrop-blur-xl` to solid `bg-white`
- [x] Remove 3D rotation transforms (rotateX, rotateY) and mouse tracking logic
- [x] Simplify hover effects to subtle scale and shadow only
- [x] Add `overflow-hidden` to card to contain pulsing rings
- [x] Remove unused motion values and mouse tracking code

## Files to Edit
- [x] src/pages/login/index.jsx
