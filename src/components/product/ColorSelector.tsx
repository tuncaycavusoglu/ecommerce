interface ColorSelectorProps {
  colors: { color: string; colorHexCode: string }[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function ColorSelector({ colors, selectedColor, onColorSelect }: ColorSelectorProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {colors.map(({ color, colorHexCode }) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          title={color}
          className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 cursor-pointer ${
            selectedColor === color
              ? 'ring-2 ring-offset-2 ring-offset-white ring-violet-400 scale-110'
              : 'hover:scale-110'
          }`}
          style={{ backgroundColor: colorHexCode }}
          id={`color-selector-${color}`}
        >
          {selectedColor === color && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isLightColor(colorHexCode) ? '#1F2937' : '#FFFFFF'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
          {isLightColor(colorHexCode) && (
            <span className="absolute inset-0 rounded-full border border-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.75;
}
