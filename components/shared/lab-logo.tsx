'use client';

interface LabLogoProps {
  lab: 'openai' | 'anthropic' | 'google-deepmind' | 'xai';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizeMap = {
  sm: { width: 20, height: 20, textSize: 'text-xs' },
  md: { width: 32, height: 32, textSize: 'text-sm' },
  lg: { width: 48, height: 48, textSize: 'text-base' },
};

const labInfo = {
  openai: {
    name: 'OpenAI',
    color: '#10a37f',
    logo: (size: number) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.867 9.12a5.991 5.991 0 0 0-3.744 6.305 5.987 5.987 0 0 0 3.642 4.387 6.003 6.003 0 0 0 7.201-2.755 5.738 5.738 0 0 0 8.522-4.817l-.003-.202c.005-.315.005-.63 0-.945a5.84 5.84 0 0 0 .3-2.134zm-9.056 12.769c-1.079-2.223-2.367-4.313-3.54-6.205.76-.423 1.513-.845 2.26-1.271.08 1.922.191 3.833.291 5.476zm-6.224-8.145c-.15-.915-.3-1.83-.451-2.745 1.5.731 3.009 1.439 4.527 2.126-.76.423-1.513.845-2.26 1.271-.604-.565-1.195-1.148-1.816-1.652zm13.065 5.381c.663-1.498 1.315-3.02 1.949-4.555-.602-1.095-1.321-2.108-2.151-3.032-.54 1.335-1.065 2.68-1.563 4.039.65.863 1.268 1.747 1.765 2.548zM6.515 11.92c.541-1.333 1.06-2.68 1.563-4.038-.83.924-1.549 1.937-2.151 3.032.634 1.536 1.286 3.057 1.949 4.555.497-.801 1.115-1.685 1.765-2.548z" />
      </svg>
    ),
  },
  anthropic: {
    name: 'Anthropic',
    color: '#f97316',
    logo: (size: number) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  'google-deepmind': {
    name: 'Google DeepMind',
    color: '#4285f4',
    logo: (size: number) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
    ),
  },
  xai: {
    name: 'xAI',
    color: '#8B5CF6',
    logo: (size: number) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    ),
  },
};

export function LabLogo({ lab, size = 'md', showName = false }: LabLogoProps) {
  const sizeConfig = sizeMap[size];
  const info = labInfo[lab];

  return (
    <div className="flex items-center gap-2">
      <div
        style={{ color: info.color }}
        className="flex-shrink-0"
      >
        {info.logo(sizeConfig.width)}
      </div>
      {showName && (
        <span className={`font-semibold ${sizeConfig.textSize} text-foreground`}>
          {info.name}
        </span>
      )}
    </div>
  );
}
