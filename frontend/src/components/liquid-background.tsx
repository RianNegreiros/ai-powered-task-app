export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base background */}
      <div className="absolute inset-0 bg-[oklch(0.96_0.015_250)] dark:bg-[oklch(0.1_0.025_260)]" />

      {/* Subtle noise texture for dark mode depth */}
      <div
        className="absolute inset-0 opacity-0 dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Orbs - light mode */}
      <div className="animate-float-orb absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.82_0.1_250/0.35)] blur-[100px] dark:bg-[oklch(0.35_0.15_250/0.25)]" />
      <div
        className="animate-float-orb absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-[oklch(0.84_0.08_200/0.3)] blur-[100px] dark:bg-[oklch(0.3_0.12_200/0.2)]"
        style={{ animationDelay: '-8s' }}
      />
      <div
        className="animate-float-orb absolute top-1/2 left-1/3 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.88_0.06_280/0.2)] blur-[100px] dark:bg-[oklch(0.28_0.1_280/0.15)]"
        style={{ animationDelay: '-15s' }}
      />
      {/* Warm amber accent orb */}
      <div
        className="animate-float-orb absolute top-[60%] right-[10%] h-[300px] w-[300px] rounded-full bg-[oklch(0.88_0.12_65/0.22)] blur-[90px] dark:bg-[oklch(0.4_0.14_55/0.18)]"
        style={{ animationDelay: '-5s' }}
      />

      {/* Extra dark mode accent glow */}
      <div
        className="animate-float-orb absolute top-1/4 right-1/4 hidden h-[300px] w-[300px] rounded-full bg-[oklch(0.25_0.08_320/0.12)] blur-[120px] dark:block"
        style={{ animationDelay: '-20s' }}
      />

      {/* Vignette for dark mode */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, oklch(0.06 0.025 260 / 0.6) 100%)',
        }}
      />
    </div>
  )
}
