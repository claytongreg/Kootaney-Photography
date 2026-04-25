// Tweaks panel for Kootaney Photography
const { useEffect } = React;

function TweaksApp() {
  const [tweaks, setTweak] = useTweaks(window.__TWEAK_DEFAULTS__);
  useEffect(() => {
    window.__applyTheme__(tweaks.palette, tweaks.fontPair);
  }, [tweaks.palette, tweaks.fontPair]);

  const palettes = window.__PALETTES__;
  const fonts = window.__FONT_PAIRS__;

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Color palette">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {Object.entries(palettes).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setTweak("palette", key)}
              style={{
                cursor: "pointer",
                padding: 10,
                background: p.bg,
                border: tweaks.palette === key ? `2px solid ${p.accent}` : "2px solid transparent",
                outline: tweaks.palette === key ? "none" : `1px solid ${p.rule}`,
                textAlign: "left",
                color: p.ink,
                fontFamily: "inherit",
                fontSize: 11,
                letterSpacing: "0.04em",
              }}
            >
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                <span style={{ width: 18, height: 18, background: p.accent, borderRadius: 999 }}></span>
                <span style={{ width: 18, height: 18, background: p.accent2, borderRadius: 999 }}></span>
                <span style={{ width: 18, height: 18, background: p.bgAlt, borderRadius: 999, border: `1px solid ${p.rule}` }}></span>
              </div>
              {p.label}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Type pairing">
        <div style={{ display: "grid", gap: 6 }}>
          {Object.entries(fonts).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setTweak("fontPair", key)}
              style={{
                cursor: "pointer",
                padding: "10px 12px",
                background: tweaks.fontPair === key ? "#2c241c" : "transparent",
                color: tweaks.fontPair === key ? "#f6efe7" : "#3a2f25",
                border: "1px solid #d8c9b4",
                textAlign: "left",
                fontFamily: f.body,
                fontSize: 12,
              }}
            >
              <span
                style={{
                  fontFamily: f.display,
                  fontStyle: f.displayItalic ? "italic" : "normal",
                  fontSize: 22,
                  display: "block",
                  lineHeight: 1.1,
                  marginBottom: 2,
                }}
              >
                Loumicha
              </span>
              <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>
                {f.label}
              </span>
            </button>
          ))}
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

const tweaksRoot = document.createElement("div");
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<TweaksApp />);
