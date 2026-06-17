# Sojurno v2 Build Note

Sojurno v2 is a fresh production implementation that uses:

- `../sojurno/docs` as the product and architecture source of truth.
- `../sojurno-redesign/sojurno-redesign` as the visual direction reference only.

The generated Figma Make code is not adopted as application architecture. The visual language is translated into:

- SCSS-authored design tokens.
- Tailwind utility consumption.
- Radix/shadcn-inspired accessible primitives.
- React Router routes.
- Storybook-documented components.

Intentional v2 product deviations approved by the owner:

- EN / ES / FR chrome.
- Unsplash imagery is acceptable for the first production take, with AI-generated static listing assets planned later.
- Tailwind and Radix/shadcn-style primitives are approved dependencies.
