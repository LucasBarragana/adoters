export default function Forma() {
  return (
    <svg width="1000" height="800" viewBox="0 0 1000 800" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 -top-[70px] -z-10 filter drop-shadow-lg">
      <defs>
        <filter id="drop-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="6" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.6" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M550,0 Q900,250 700,450 Q650,500 700,550, Q750,600 700,650, Q500,750 000,650, Q200,650 0,650, Q0,0 0,0, 450,0" fill="#2C5282" filter="url(#drop-shadow)" />
    </svg>
  );
}