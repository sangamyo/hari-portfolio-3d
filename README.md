# Hari Om Kasaundhan — 3D Portfolio

A personal portfolio site with a sci-fi HUD design. The hero section has a drone model that floats and reacts to scroll. The drone is built from basic three.js shapes in code, with no model files.

## Sections

- **Skills**: the languages, frameworks and tools I use
- **Experience**: internships and roles
- **Projects**: selected work, with live demo and GitHub links
- **Education**
- **Contact**: email, phone, GitHub and LinkedIn

## Tech stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [three.js](https://threejs.org) via [@react-three/fiber](https://r3f.docs.pmnd.rs) and [@react-three/drei](https://github.com/pmndrs/drei)
- [GSAP](https://gsap.com) for animation
- [oxlint](https://oxc.rs) for linting

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Deploy

The site is fully static, so any static host works. On Vercel:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

## Project structure

```
index.html        page shell, fonts, meta tags
src/main.jsx      React entry point
src/App.jsx       3D scene, sections and content data (SKILLS, PROJECTS, ...)
src/index.css     global styles and theme variables
public/           static assets (favicon)
```

To change the content, edit the data arrays at the top of each section in `src/App.jsx`.
