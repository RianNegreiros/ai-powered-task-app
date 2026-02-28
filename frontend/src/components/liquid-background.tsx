export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[oklch(0.96_0.015_250)]" />

      <div className="animate-float-orb absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.82_0.1_250/0.35)] blur-[100px]" />
      <div
        className="animate-float-orb absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-[oklch(0.84_0.08_200/0.3)] blur-[100px]"
        style={{ animationDelay: '-8s' }}
      />
      <div
        className="animate-float-orb absolute top-1/2 left-1/3 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.88_0.06_280/0.2)] blur-[100px]"
        style={{ animationDelay: '-15s' }}
      />
    </div>
  )
}
