/**
 * Hosted Storybook URL. In production it's served at /storybook/ from the same
 * Vercel deployment (see vercel.json). The trailing slash is required: Storybook's
 * built index.html uses relative asset paths, which only resolve under /storybook/.
 * Override locally with VITE_STORYBOOK_URL (e.g. http://localhost:6006) when
 * running `npm run storybook`.
 */
export const STORYBOOK_URL = import.meta.env.VITE_STORYBOOK_URL ?? '/storybook/'
