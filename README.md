# LinkLab — React + Vite

The LinkLab dashboard rebuilt as real React components with npm and Vite. The original design, responsive layouts, six themes, search, filters, class details, and browser-local class additions are preserved. Python is not used.

## Requirements

- Node.js 22.12 or newer in the 22.x line, or Node.js 24 or newer. This project declares the supported versions in `package.json`.
- npm (included with Node.js).
- A modern browser and a terminal.

Internet access is needed for the first dependency installation. The dashboard does not call external APIs or fetch remote assets at runtime.

## Start locally

1. Unzip `LinkLab.zip`.
2. Open a terminal inside the extracted `linklab` folder (the folder containing `package.json`).
3. Install the exact locked dependencies:

```bash
npm ci
```

4. Start the development server:

```bash
npm run dev
```

5. Open **http://localhost:4173/**. Keep the terminal running. Press **Ctrl+C** to stop the server.

Vite automatically refreshes the browser when source files change. No Python or separate backend is needed. Unlike the earlier standalone mockup, the React source must be served through Vite; do not double-click `index.html`.

The server binds only to this computer. Port 4173 is strict: if another copy is running, stop it first, or use:

```bash
npm run dev -- --port 4180
```

Open the URL Vite prints. Different ports, hostnames, and browser profiles have separate local storage. Data from the previous mockup will remain available only when using the same browser profile and origin; opening a file directly uses a different storage location.

## Build and check the production app

```bash
npm run build
npm run preview
```

Open **http://localhost:4174/** to inspect the production build. `build` writes static deployment assets to `dist/`; `preview` serves that output locally and is not a production hosting service. Run the build again after changing source. Press Ctrl+C to stop preview.

The relative Vite base (`./`) supports deploying the contents of `dist/` under a static subdirectory. Deploy those built files to your chosen static host; do not deploy `src/` or `node_modules/`. No routing fallback is required because dashboard views are React state, not URL routes. A localhost URL cannot be opened on another computer.

## Project structure

```text
linklab/
  index.html          Browser title and React mount point
  package.json        npm scripts and dependency ranges
  package-lock.json   Exact dependency versions — commit this
  vite.config.js      Relative build paths and JSX configuration
  .gitignore          Excludes dependencies, builds, secrets, caches
  src/
    main.jsx          React root
    App.jsx           Dashboard state, navigation, cards, dialogs, settings
    Hero.jsx          Featured WebFoil panel
    Artwork.jsx       React SVG illustrations
    data.js           Default courses and theme palettes
    styles.css        Original responsive design and theme styles
```

The app uses React hooks and JSX, rather than embedding the previous HTML application inside a React wrapper. Its only production dependencies are React and React DOM. Vite is the development/build tool. No hosting credentials or chat-specific configuration is included. No license is assigned; choose one before distributing if appropriate.

## Using the dashboard

- **My classes** shows course cards. Use All classes, In progress, or Up next to filter them.
- **Search** matches class names, subject labels, and playground titles. Ctrl+K / Command+K focuses the search field.
- **Explore** opens a course's playground details.
- **All playgrounds** lists the example playground collection.
- **Add a class** creates a class in this browser's storage.
- **Settings** opens six palettes: Sage Garden, Desert Dawn, Coastal Blue, Lavender Studio, Rosewood, and Midnight Library. Selection applies immediately and is remembered in the same browser.
- **Saved for later** is currently an empty-state mockup; bookmarking is not implemented.

## What is a mockup, and what is saved?

The sample courses and future playground names are illustrative. WebFoil is represented as an existing project, but its live URL has not been connected. There is no working outbound playground link, sharing system, sign-in, database, or course/playground editor yet. The Add a class form does not add playgrounds or edit/delete existing courses.

Added classes and theme selection are stored with `localStorage` in the browser:

- `learning-lab-classes` — the class collection, written when adding a class.
- `learning-lab-theme` — the selected theme ID.

The original key names are retained after the LinkLab rename so saved preferences continue to work.

These values are **not written back into the source files, included in Git commits, synchronized across devices, or shared with students**. They belong to the browser profile and origin (scheme, hostname, and port). `localhost` and `127.0.0.1` have separate storage. Clearing browser site data removes them. Private browsing may discard them at the end of a session.

If you want every visitor to see a course, add it to the source collection in `the source files` and commit it. Do not rely on the Add a class form for shared content.

## Customize classes and playgrounds

1. Make a copy or Git commit before editing.
2. Open `src/data.js` in a text editor, such as VS Code.
3. Find `export const initialClasses =` near the end of the file. This array defines the default cards.
4. Edit the existing course objects or insert new ones **before** the last “Your next curiosity” object. That last object supplies the Add class card.

Example course object:

```javascript
{
  name: 'Thermodynamics',
  code: 'MECHANICAL ENGINEERING',
  desc: 'Explore heat, work, and energy through interactive experiments.',
  status: 'active',
  type: 'curve',
  color: '#edf1e4',
  items: ['Heat engine explorer', 'Energy balance sandbox']
}
```

- `status`: use `active` for In progress or `planned` for Up next. Reserve `new` for the Add class card.
- `type`: supported diagram styles in `src/Artwork.jsx` are `flow`, `curve`, `orbit`, `vector`, `circuit`, and `plus`.
- `items`: an array of playground title strings. These are labels, not URLs.
- `color`: legacy data retained for compatibility; theme CSS controls artwork backgrounds.
- Quote strings correctly. Use double quotes around a string containing an apostrophe, or escape the apostrophe.

The featured WebFoil panel is in `src/Hero.jsx`; the workbench row is in `src/App.jsx`. Update those separately when changing featured content. The WebFoil button looks up the course containing the WebFoil playground.

To connect real playground URLs, extend the `items` data to include title/URL objects and update both `CourseDetails` and the card rendering in `src/App.jsx` to render links. That behavior is not implemented by simply pasting a URL into an `items` string.

### When changed defaults do not appear

Once you add a class, your browser stores a complete class collection and loads it instead of `initialClasses`. Editing the source defaults will therefore not replace that saved collection.

To load new defaults, first record any local additions you want to keep, then open the browser's developer tools → Console and run:

```javascript
localStorage.removeItem('learning-lab-classes');
location.reload();
```

This removes **all browser-local class additions for the current origin**. It leaves the theme preference intact. Alternatively, preview in another browser profile to inspect fresh defaults without deleting your existing data.

## Customize themes and branding

Find `export const themes =` in `src/data.js`. Each theme has an `id`, `name`, `mood`, and a `colors` array. Keep theme IDs stable to preserve saved selections. The color positions map to:

1. Main text (`ink`)
2. Secondary text (`muted`)
3. Page background (`paper`)
4. Borders (`line`)
5. Accent/link color (`green`)
6. Card/dialog background (`surface`)
7. Sidebar (`side`)
8. Featured panel (`hero`)
9. Selected items (`accent`)
10. Artwork background (`art`)
11. Diagram strokes (`art-ink`)
12. Primary button text (`button-text`)
13. Featured diagram glow (`glow`)

The `night` ID also enables the browser's dark color scheme. Theme CSS is in `src/styles.css`. Preserve readable contrast when adjusting palettes.

The visible name is in `src/App.jsx`; the browser tab name is in `index.html`. Browser storage keys do not need to change when branding changes.

## Put it in Git

Extract the archive, open a terminal in the `linklab` folder, and initialize a repository:

```bash
git init
git add .
git commit -m "Initial LinkLab dashboard"
git branch -M main
```

Create an **empty** repository with your Git provider. Avoid initializing that remote with its own README if using these steps. Copy its clone URL, replacing the placeholder below:

```bash
git remote add origin YOUR_REPOSITORY_CLONE_URL
git push -u origin main
```

You may need to sign in through your Git provider's supported authentication method. Never paste access tokens into source files or commit them. If the remote already contains commits, clone that repository first, copy these project files into it, review the changes, and commit there instead of forcing a push.

## Keep LinkLab updated

### Normal source changes

1. Begin with a clean Git working tree (commit current changes first).
2. Pull remote updates if collaborating or using multiple computers.
3. If the lockfile changed, rerun `npm ci`.
4. Edit the relevant file in `src/`; use `npm run dev` to see changes immediately.
5. Run `npm run build`, then the manual checks below using `npm run preview`.
6. Review the diff, commit, and push.

```bash
git pull --ff-only
npm ci
npm run dev
```

After making changes, stop the dev server with Ctrl+C, then:

```bash
npm run build
npm run preview
```

After checking and stopping preview:

```bash
git diff
git status
git add src index.html package.json package-lock.json vite.config.js README.md .gitignore
git commit -m "Describe your change"
git push
```

If Git reports diverged history, reconcile it before pushing. Do not force-push as a routine update step. If you change only content or CSS, dependency reinstallation is unnecessary. Vite needs restarting if you change package configuration. Never edit built `dist/` files as your source of truth.

### Dependency updates

Keep `package-lock.json` committed. Use `npm ci` for a reproducible installation; it requires the lockfile to match `package.json` and replaces an existing `node_modules` folder.

To check available updates:

```bash
npm outdated
npm audit
```

For updates within the declared dependency ranges:

```bash
npm update
npm run build
```

Repeat the manual checks and review both package files before committing. `npm update` changes the lockfile; future clones use `npm ci` to install those reviewed versions. Major React or Vite upgrades can require source/configuration changes: consult their official migration guides before changing the ranges in `package.json`. Avoid `npm audit fix --force` as a routine maintenance command because it may introduce breaking upgrades. Keep Node.js and npm on supported versions through your usual installation method.

This app has no automatic updater or connection back to the original chat. For future assistant changes, provide this repository and your requirements, then review and commit the resulting diff.

## Manual verification

There is no automated test suite yet. For each meaningful change:

- Run `npm run build` and confirm it completes.
- Open the production preview; confirm branding, course cards, and SVG artwork.
- Search for a class and a playground title, clear the search, and try a no-match query.
- Switch In progress / Up next / All classes.
- Open course details and close with the close button and Escape.
- Switch to All playgrounds and Saved for later (the latter is a mockup empty state).
- Select all six themes and confirm the whole dashboard changes. Reload to verify persistence.
- Add a class, reload, and confirm persistence. Use a separate browser profile for disposable checks, or save local data before resetting it.
- Check a narrow/mobile width and keyboard navigation, including Ctrl+K / Command+K.
- Inspect the browser Console for unexpected errors.

## Troubleshooting

**npm/Node not found:** Install a supported Node.js version, reopen your terminal, and check `node --version` and `npm --version`.

**Unsupported engine:** Use the Node versions listed under Requirements. Installing an older Node release is not a workaround.

**Port already in use:** Stop the previous server, or use `npm run dev -- --port 4180`. A new port has separate browser storage.

**Site cannot be reached:** Keep the server terminal running and use its printed URL. If you stopped it, run `npm run dev` again.

**Blank page when opening a file:** Use `npm run dev` or build and run `npm run preview`. React source and built module scripts require HTTP serving.

**Dependency installation fails:** Check network access and the supported Node version, then retry `npm ci`. Do not delete the lockfile to resolve an unrelated network problem. If package.json and the lockfile were deliberately changed out of sync, run `npm install`, review the lockfile, and commit both files.

**Classes/theme not remembered:** Browser storage must be allowed. Private windows, another browser profile, a changed port/hostname, and file:// versus http:// all affect persistence. A storage failure now shows an in-app message; current-session state still works.

**Edited defaults do not appear:** Saved class data overrides source defaults. See the local data reset instructions above; record anything you need before resetting.

**Sharing with students:** Push this source to Git, then configure your static hosting provider to run `npm ci` and `npm run build`, with `dist` as the output directory. Use a supported Node version. Pushing to a Git repository alone does not automatically publish a website unless hosting has been configured. Choose the repository and site audience intentionally. Each visitor has their own browser-local classes and theme; there is no shared database or account synchronization.
