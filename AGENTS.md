# Project instructions

- Do not launch browsers, create screenshots, or perform automated visual UI checks. The user validates the interface manually.
- Do not start a preview or development server solely for visual inspection unless the user explicitly requests it.
- Build page and component styling with Tailwind CSS utility classes, including responsive states and arbitrary variants when needed.
- Do not add page-level or component-level CSS for ordinary layout, spacing, typography, color, or responsive styling. A root hook class (even an empty one) and custom CSS for genuinely complex animations are allowed.
- Save every newly uploaded or generated site image in the persistent `data/uploads` directory and serve it through `/media/uploads/<file>`. Do not write new images into `public`.
- Keep the public interface in one consistent light visual system: white and pale-blue surfaces, dark text, and blue reserved for actions, prices, active states, and meaningful numeric accents. Do not introduce black or dark section backgrounds behind content or photo galleries.
- Use `AppButton` for primary text buttons and `AppHeading` for visible page and section headings. Buttons and rectangular controls must have square corners.
- Do not add small blue uppercase eyebrow/kicker labels above headings. Communicate hierarchy through the heading, spacing, and section composition instead.
- Prefer the established split-screen composition for editorial sections: meaningful text on the left and related photography on the right. Reuse the same visual language across pages instead of designing isolated page styles.
