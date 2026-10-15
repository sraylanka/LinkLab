export default function Artwork({type}) {
  const drawings = {
    flow: <path d="M20 65 Q90 10 270 65 Q100 48 20 65ZM0 25Q140 5 300 28M0 90Q140 100 300 87"/>,
    curve: <><path d="M25 92H280M55 105V15" opacity=".4"/><path d="M25 85C90 90 80 15 145 32S210 108 280 25"/><path d="M145 32V92M110 45V92M180 63V92" opacity=".25"/></>,
    orbit: <><ellipse cx="155" cy="57" rx="100" ry="30" transform="rotate(-20 155 57)"/><ellipse cx="155" cy="57" rx="100" ry="30" transform="rotate(25 155 57)"/><circle cx="155" cy="57" r="9"/><circle cx="231" cy="21" r="5"/></>,
    vector: <><path d="M85 92L85 25L195 25L230 70L120 70L85 25M85 92L195 92L230 70M195 25V92M120 70V105"/><path d="M45 95L250 40m-12-2 12 2-7 10"/></>,
    circuit: <><path d="M50 28H120l6-9 10 18 10-18 10 18 8-9H250V85H170M140 85H50V28M140 72V98M151 78V92"/><circle cx="250" cy="56" r="13"/></>,
    plus: <path d="M150 35V80M128 57H173"/>
  };
  return <svg viewBox="0 0 300 112" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">{drawings[type] || drawings.vector}</svg>;
}
