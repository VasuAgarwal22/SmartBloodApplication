# Login Page UI/UX Enhancement TODO

## 1. Enhance Input Component (`src/components/ui/Input.jsx`)
- [x] Add `floating` prop for floating labels (label moves up on focus/value)
- [x] Add `isValid` prop for validation feedback (green border + check icon for valid, red + X for invalid)
- [x] Add `helperText` prop for contextual guidance on focus
- [x] For password type, add show/hide toggle with eye icon
- [x] Smooth transitions (150-200ms) for all states

## 2. Update Login Page (`src/pages/login/index.jsx`)
- [x] Add real-time validation for email (format) and password (≥8 chars)
- [x] Detect Caps Lock and show warning for password field
- [x] Add card entrance animation (fade in + slide up 10-15px, 300ms ease-out)
- [x] Add button hover (scale 1.02) and active (scale 0.98) effects
- [x] On submit: disable button, show spinner + "Signing in..."
- [x] Add error shake animation and smooth error reveal
- [x] Add success feedback: button turns green with checkmark animation before redirect
- [x] Add "Forgot Password?" link under password (for sign-in mode)
- [x] Add security lock icon with tooltip ("Your credentials are encrypted")
- [x] Ensure keyboard navigation, focus rings, Enter key submits, error association
- [x] Use medical-style blue/white palette

## 3. Followup Steps
- [ ] Test real-time validation, animations, and accessibility
- [ ] Ensure compatibility with existing auth context
