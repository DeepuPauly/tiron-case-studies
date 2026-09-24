
export default function Loading() {
  return (
    <main
      className="container"
      style={{
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '100px',
      }}
      role="status"
      aria-live="polite"
    >
      <span className="eyebrow">
        OUR PORTFOLIO
      </span>

      <h1
        style={{
          fontSize: 'clamp(36px, 5vw, 64px)',
          marginTop: '20px',
        }}
      >
        Loading Case Studies...
      </h1>

      <p
        style={{
          color: 'var(--muted)',
          marginBottom: '50px',
        }}
      >
        Please wait while we load our projects.
      </p>

      <div className="case-grid">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="case-card"
              aria-hidden="true"
            >
              <div
                className="card-image"
                style={{
                  background: '#242936',
                }}
              />

              <div className="card-content">
                <div
                  style={{
                    height: '16px',
                    width: '40%',
                    background: '#303642',
                    borderRadius: '4px',
                    marginBottom: '20px',
                  }}
                />

                <div
                  style={{
                    height: '24px',
                    width: '80%',
                    background: '#303642',
                    borderRadius: '4px',
                    marginBottom: '15px',
                  }}
                />

                <div
                  style={{
                    height: '14px',
                    width: '60%',
                    background: '#303642',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          ),
        )}
      </div>
    </main>
  )
}