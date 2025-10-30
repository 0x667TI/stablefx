export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cercle extérieur avec gradient Arc style */}
      <circle cx="50" cy="50" r="48" fill="url(#gradient1)" />
      
      {/* Arc principal - Style Arc Network */}
      <path 
        d="M 30 70 Q 50 20, 70 70" 
        stroke="white" 
        strokeWidth="6" 
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Flèches de swap */}
      <path 
        d="M 38 50 L 32 44 L 38 38" 
        stroke="white" 
        strokeWidth="4" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M 62 50 L 68 56 L 62 62" 
        stroke="white" 
        strokeWidth="4" 
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Effet de brillance */}
      <circle cx="35" cy="35" r="8" fill="white" opacity="0.3" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}