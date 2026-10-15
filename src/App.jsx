import { useEffect, useRef, useState } from 'react';
import { initialClasses, themes } from './data.js';
import Hero from './Hero.jsx';
import Artwork from './Artwork.jsx';

const keys = {classes: 'learning-lab-classes', theme: 'learning-lab-theme'};
function loadClasses() {
  try {
    const value = JSON.parse(localStorage.getItem(keys.classes));
    if (Array.isArray(value) && value.every(c => c && typeof c.name === 'string' && typeof c.code === 'string' && typeof c.desc === 'string' && Array.isArray(c.items) && c.items.every(n => typeof n === 'string'))) return value;
  } catch { /* Unavailable or invalid storage: use defaults. */ }
  return initialClasses;
}
function loadTheme() {
  try { return themes.find(t => t.id === localStorage.getItem(keys.theme))?.id || 'sage'; }
  catch { return 'sage'; }
}
function Modal({children, close}) {
  const ref = useRef(null);
  useEffect(() => {const dialog = ref.current; dialog.showModal(); return () => dialog.close();}, []);
  return <dialog ref={ref} onCancel={close} aria-labelledby="dialog-title"><button className="close" aria-label="Close dialog" onClick={close}>×</button>{children}</dialog>;
}
function Settings({theme, setTheme, storageError}) {
  return <><div className="eyebrow">MAKE YOURSELF AT HOME</div><h2 id="dialog-title">A space for every mood.</h2><p>Six palettes. Same room for curiosity.<br/>Choose the one that feels right today.</p><div className="theme-grid">{themes.map(t => <button key={t.id} className="theme-choice" aria-pressed={theme === t.id} onClick={() => setTheme(t.id)}><span className="theme-preview" style={{background:t.colors[2]}}>{[0,8,10].map(i => <i key={i} style={{background:t.colors[i]}}/>)}</span><span className="theme-info"><strong>{t.name}<span>{theme === t.id ? '✓' : ''}</span></strong><small>{t.mood}</small></span></button>)}</div><p className="settings-note" role="status">{storageError || `${themes.find(t => t.id === theme).name} selected. Your choice is saved in this browser.`}</p></>;
}
function CourseDetails({course}) {
  return <><div className="eyebrow">{course.code}</div><h2 id="dialog-title">{course.name}</h2><p>{course.desc}</p><div style={{marginTop:25}}>{course.items.length ? course.items.map((name,i) => <div className="row" key={i}><div className="row-icon">◇</div><div><strong>{name}</strong><small>{name === 'WebFoil' ? 'Existing project · Link to be connected' : 'Playground idea · Not built yet'}</small></div></div>) : <p>Your next playground will live here.</p>}</div><p style={{marginTop:20,fontSize:12}}>{course.name === 'Aerodynamics' ? 'WebFoil is represented here as an example. Its live URL can be connected when you are ready.' : 'This is a class space for your learning collection. Its playground links can be connected as you build them.'}</p></>;
}
function AddClass({onAdd}) {
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get('name').trim(), code = form.get('subject').trim();
    if (!name || !code) return;
    onAdd({name,code,desc:'A fresh space for experiments, questions, and discoveries.',status:'active',type:'vector',items:[]});
  }
  return <><h2 id="dialog-title">Make room for a new idea.</h2><p>Add a class to your personal learning library.</p><form onSubmit={submit}><label>Class name<input name="name" required maxLength={65} pattern=".*\S.*" placeholder="e.g. Thermodynamics"/></label><label>Subject<input name="subject" required maxLength={50} pattern=".*\S.*" placeholder="e.g. Mechanical engineering"/></label><button className="primary">Add class →</button></form></>;
}
export default function App() {
  const [classes,setClasses] = useState(loadClasses);
  const [theme,setTheme] = useState(loadTheme);
  const [view,setView] = useState('classes');
  const [filter,setFilter] = useState('all');
  const [query,setQuery] = useState('');
  const [modal,setModal] = useState(null);
  const [storageError,setStorageError] = useState('');
  const search = useRef(null);
  useEffect(() => {
    const t = themes.find(t => t.id === theme);
    ['ink','muted','paper','line','green','surface','side','hero','accent','art','art-ink','button-text','glow'].forEach((key,i) => document.documentElement.style.setProperty(`--${key}`,t.colors[i]));
    document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
    try {localStorage.setItem(keys.theme,theme);} catch {setStorageError('Browser storage is unavailable. Changes will last for this visit only.');}
  },[theme]);
  useEffect(() => {
    function shortcut(e) {if ((e.metaKey || e.ctrlKey) && e.key === 'k') {e.preventDefault(); if (!modal) search.current?.focus();}}
    document.addEventListener('keydown',shortcut);
    return () => document.removeEventListener('keydown',shortcut);
  },[modal]);
  function addClass(course) {
    const next = [...classes.filter(c => c.status !== 'new'),course,...classes.filter(c => c.status === 'new')];
    setClasses(next);
    try {localStorage.setItem(keys.classes,JSON.stringify(next));} catch {setStorageError('Browser storage is unavailable. Changes will last for this visit only.');}
    setModal(null);
  }
  const nav = [['classes','▦','My classes'],['playgrounds','◇','All playgrounds'],['saved','☆','Saved for later']];
  const title = nav.find(n => n[0] === view)[2];
  const data = classes.filter(c => (filter === 'all' || c.status === filter) && [c.name,c.code,...c.items].join(' ').toLowerCase().includes(query.toLowerCase()));
  const cards = view === 'playgrounds' ? data.flatMap(c => c.items.map((name,i) => ({course:c,name,key:`${classes.indexOf(c)}-${i}`}))) : data.map(c => ({course:c,key:String(classes.indexOf(c))}));
  const webfoil = () => setModal({type:'detail',course:classes.find(c => c.items.includes('WebFoil')) || initialClasses[0]});
  return <><aside><div className="brand"><b>⌁</b> LinkLab<span style={{color:'var(--muted)'}}>.</span></div><div className="caption">YOUR WORKSPACE</div><nav aria-label="Workspace">{nav.map(([id,icon,label]) => <button key={id} className={view === id ? 'active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}><span>{icon}</span> {label}</button>)}<button onClick={() => setModal({type:'settings'})}><span>⚙</span> Settings</button></nav><div className="side-note">A little curiosity.<br/>A lot of possibility.<br/><span style={{fontSize:22}}>↗</span></div><div className="profile"><div className="avatar">R</div><div>Raymond's workspace<small>Personal learning library</small></div></div></aside><main><header><div>Workspace <span style={{margin:'0 12px'}}>/</span> <span className="trail">{title}</span></div><div className="top-right"><span>Built to learn. Made to share.</span><span className="pill">● Personal workspace</span></div></header><section className="intro"><div><div className="eyebrow">THE CURIOSITY COLLECTION</div><h1>Your ideas, in motion.</h1><p>A home for your classes, experiments, and lightbulb moments.</p></div><button className="primary" onClick={() => setModal({type:'add'})}>＋ Add a class</button></section><Hero onOpen={webfoil}/><section className="section"><h2>{title} <small>{classes.filter(c => c.status !== 'new').length} spaces to explore</small></h2><div className="filters">{[['all','All classes'],['active','In progress'],['planned','Up next']].map(([id,label]) => <button key={id} className={`filter ${filter === id ? 'active' : ''}`} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div></section><div className="search"><span>⌕</span><input ref={search} value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a class or playground…" aria-label="Search classes and playgrounds"/><span style={{fontSize:10}}>⌘ K</span></div>{storageError && <p role="status">{storageError}</p>}<div className="grid">{view === 'saved' ? <div className="empty">Your saved playgrounds will appear here. This concept is ready for your growing collection.</div> : cards.length ? cards.map(({course:c,name,key}) => <article className="card" key={key}><div className="card-art">{!name && <span>{String(classes.indexOf(c)+1).padStart(2,'0')}</span>}<Artwork type={c.type}/></div><div className="card-content"><div className="code">{name ? c.name : c.code}</div><h3>{name || c.name}</h3><p>{name ? name === 'WebFoil' ? 'Your first interactive learning project.' : 'An idea for a future interactive playground.' : c.desc}</p><div className="card-foot"><span>{name ? 'Concept preview' : c.status === 'new' ? 'An open invitation' : `${c.items.length} playground${c.items.length === 1 ? '' : 's'} · ${c.status === 'active' ? 'Exploring' : 'Ideas for later'}`}</span><button onClick={() => setModal(c.status === 'new' ? {type:'add'} : {type:'detail',course:c})}>{name ? 'View details ↗' : c.status === 'new' ? 'Add class ＋' : 'Explore →'}</button></div></div></article>) : <div className="empty">No matches. Try a different search.</div>}</div><section className="recent"><div className="section"><h2>On your workbench</h2><span style={{fontSize:11,color:'var(--muted)'}}>A few ideas to come back to</span></div><div className="row"><div className="row-icon">↗</div><div><strong>WebFoil</strong><small>Aerodynamics · Interactive airfoil explorer</small></div><button onClick={webfoil}>View playground ↗</button></div></section><footer><span>Learning is better when you can play with it.</span><span>Concept preview · Sample classes, real possibilities</span></footer></main>{modal && <Modal close={() => setModal(null)}>{modal.type === 'settings' ? <Settings theme={theme} setTheme={setTheme} storageError={storageError}/> : modal.type === 'add' ? <AddClass onAdd={addClass}/> : <CourseDetails course={modal.course}/>}</Modal>}</>;
}
