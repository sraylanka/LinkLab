# LinkLab

A personal dashboard for classes, learning playgrounds, and future experiments. Includes six themes, search, course filters, class detail dialogs, and a browser-local Add a class flow.

## Quick start

LinkLab is a static website: no npm install, build step, API key, or account is required.

### Option 1: Open directly

Unzip the archive and open `linklab/index.html` in a modern browser. This works for previewing the dashboard. Some browsers restrict storage for files opened directly, so use the local server below if you want more reliable saved preferences.

### Option 2: Run a local server (recommended)

Install Python 3 if you do not already have it, then open a terminal in the extracted `linklab` folder:

```bash
python3 serve.py
```

On Windows, use:

```powershell
py serve.py
```

Open **http://localhost:4173/** in your browser. Keep the terminal open while using LinkLab. Press **Ctrl+C** in the terminal to stop it. Closing the terminal stops the server; reopening the page does not restart it.

The server listens only on this computer. If port 4173 is busy, choose another:

```bash
python3 serve.py --port 4174
```

Then open **http://localhost:4174/**. Using a different port creates a separate browser storage location, so your previous saved theme and classes will not appear there.

You can also use any existing static web server to serve this folder.

## Files

- `index.html` — the complete app: HTML, CSS, inline SVG diagrams, and JavaScript. Edit this file to update the dashboard.
- `serve.py` — optional local server using only Python's standard library.
- `README.md` — setup, maintenance, and Git instructions.
- `.gitignore` — excludes common system/editor files, Python caches, and local secrets.

The static app needs no hosting credentials, Sites configuration, or external asset dependencies. This repository includes an MIT license in `LICENSE`; check that license before reusing the project elsewhere.

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

These values are **not written back into index.html, included in Git commits, synchronized across devices, or shared with students**. They belong to the browser profile and origin (scheme, hostname, and port). `localhost` and `127.0.0.1` have separate storage. Clearing browser site data removes them. Private browsing may discard them at the end of a session.

If you want every visitor to see a course, add it to the source collection in `index.html` and commit it. Do not rely on the Add a class form for shared content.

## Customize classes and playgrounds

1. Make a copy or Git commit before editing.
2. Open `index.html` in a text editor, such as VS Code.
3. Find `const initial=` near the end of the file. This array defines the default cards.
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
- `type`: supported diagram styles are `flow`, `curve`, `orbit`, `vector`, `circuit`, and `plus`.
- `items`: an array of playground title strings. These are labels, not URLs.
- `color`: retained in card markup; the theme CSS currently overrides artwork backgrounds to coordinate with the chosen palette.
- Quote strings correctly. Use double quotes around a string containing an apostrophe, or escape the apostrophe.

The featured WebFoil panel and the workbench row are separate markup above the script. Change their text separately if desired. The WebFoil button currently opens the first course's detail dialog, so keep Aerodynamics first until you update that handler.

To connect real playground URLs, extend the `items` data to include title/URL objects and update both `detail()` and `render()` to render links. That behavior is not implemented by simply pasting a URL into an `items` string.

### When changed defaults do not appear

Once you add a class, your browser stores a complete class collection and loads it instead of `initial`. Editing the source defaults will therefore not replace that saved collection.

To load new defaults, first record any local additions you want to keep, then open the browser's developer tools → Console and run:

```javascript
localStorage.removeItem('learning-lab-classes');
location.reload();
```

This removes **all browser-local class additions for the current origin**. It leaves the theme preference intact. Alternatively, preview in another browser profile to inspect fresh defaults without deleting your existing data.

## Customize themes and branding

Find `const themes=` in `index.html`. Each theme has an `id`, `name`, `mood`, and a `colors` array. Keep theme IDs stable to preserve saved selections. The color positions map to:

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

The `night` ID also enables the browser's dark color scheme. Theme CSS is at the end of the style block. Preserve readable contrast when adjusting palettes.

The visible name is in `<div class="brand">`; the browser tab name is in `<title>`. Search for `LinkLab` to find both. Browser storage keys do not need to change when branding changes.

## Put it in Git

If you cloned this repository, it is already set up for Git. If you are starting from the standalone project files, open a terminal in the `linklab` folder and initialize a repository:

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

There are no JavaScript packages to update. Keep your browser, Python installation, and Git installation updated through their normal update mechanisms.

For each source change:

1. Pull any changes from your remote before editing when working across computers or with others. Start with a clean working tree, or commit your current work first.
2. Edit `index.html`.
3. Start the server if it is not already running. Static file changes need no server restart.
4. Refresh the browser. If it looks unchanged, use a hard refresh (Ctrl+Shift+R or Command+Shift+R), then check whether browser-local class data is overriding edited defaults.
5. Run the manual checks below.
6. Review and commit the exact files you changed.

Typical commands from the project folder:

```bash
git pull --ff-only
```

After editing and checking:

```bash
git diff
git status
git add index.html README.md serve.py .gitignore
git commit -m "Describe your change here"
git push
```

If `git pull --ff-only` reports diverged history, stop and reconcile the branches rather than forcing a push. Review `git diff` for unexpected files or secrets before every commit.

To have an assistant update this project later, provide the current repository or these source files and specify the changes. Commit a working baseline first, then review the resulting diff. This archive has no automatic updater or connection back to the original chat.

## Manual checks before committing

- Open the dashboard and confirm class cards and SVG diagrams display.
- Search for a known class, then clear the search.
- Switch In progress / Up next / All classes and check the results.
- Open and close a course detail dialog; Escape should close it.
- Open Settings, try all six themes, reload, and confirm the last theme remains selected.
- Add a temporary class and reload to verify storage. Use a separate browser profile for this check, or reset local class data afterward after saving anything you need.
- Check a narrow/mobile browser width for wrapping and horizontal overflow.
- Check the browser Console for JavaScript errors.

## Troubleshooting

**Python command not found:** Try `python` instead of `python3`, or `py` on Windows. Otherwise install Python 3 through the official distribution or your operating system's package manager. You can still open `index.html` directly.

**Address already in use:** Stop an old server or use `--port 4174`.

**This site cannot be reached:** Make sure the server terminal is still running and you opened the exact URL/port it prints.

**404 or directory listing:** Start `serve.py` from this package. It serves the folder containing the script even if launched from another directory. If using another server, make sure its document root contains `index.html`.

**Theme/classes not remembered:** Use the local server, allow site storage, use a normal browser window, and keep using the same hostname and port.

**Old defaults remain:** See the browser-local data reset instructions above.

**Sharing with students:** A localhost URL only works on your own computer. Git stores source code; pushing to Git alone does not host a website. To share an interactive URL, configure static hosting (for example, a static Pages service) with this folder as the site root and no build step. Choose the repository/site audience intentionally. Visitors receive the source defaults and maintain their own local preferences; they do not receive your browser-local additions.
