// Cheap, motionless gradient shown when motion is reduced. No WebGL.
export default function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(60% 50% at 30% 20%, rgb(var(--accent) / 0.08), transparent 70%),' +
          'radial-gradient(50% 50% at 80% 80%, rgb(var(--accent-warm) / 0.06), transparent 70%)',
      }}
    />
  )
}
