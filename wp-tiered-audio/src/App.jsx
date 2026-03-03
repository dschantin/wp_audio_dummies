import { useState, useEffect, useRef } from "react";

// ─── TIER DEFINITIONS ───
const TIERS = {
  open: {
    id: "open",
    label: "Open",
    tagline: "The essential briefing",
    color: "#8a8a8a",
    colorSoft: "rgba(138,138,138,0.08)",
    colorMid: "rgba(138,138,138,0.15)",
    bg: "#f7f6f3",
    icon: "◯",
    features: [
      { label: "Core news summaries", available: true },
      { label: "Standard AI narration", available: true },
      { label: "5 stories per edition", available: true },
      { label: "Context & analysis segments", available: false },
      { label: "Expert voice commentary", available: false },
      { label: "Early morning access", available: false },
      { label: "Personalised story selection", available: false },
      { label: "Extended deep-dive segments", available: false },
    ],
  },
  registered: {
    id: "registered",
    label: "Registered",
    tagline: "More context, more depth",
    color: "#2c6e8a",
    colorSoft: "rgba(44,110,138,0.07)",
    colorMid: "rgba(44,110,138,0.14)",
    bg: "#f4f7f9",
    icon: "◉",
    features: [
      { label: "Core news summaries", available: true },
      { label: "Standard AI narration", available: true },
      { label: "7 stories per edition", available: true },
      { label: "Context & analysis segments", available: true },
      { label: "Story bookmarking", available: true },
      { label: "Expert voice commentary", available: false },
      { label: "Early morning access", available: false },
      { label: "Personalised story selection", available: false },
    ],
  },
  subscriber: {
    id: "subscriber",
    label: "Subscriber",
    tagline: "The complete experience",
    color: "#b8860b",
    colorSoft: "rgba(184,134,11,0.06)",
    colorMid: "rgba(184,134,11,0.13)",
    bg: "#faf8f4",
    icon: "★",
    features: [
      { label: "Core news summaries", available: true },
      { label: "Premium AI narration", available: true },
      { label: "10 stories per edition", available: true },
      { label: "Extended context & analysis", available: true },
      { label: "Expert voice commentary", available: true },
      { label: "Early access (5:30 AM)", available: true },
      { label: "AI-personalised story mix", available: true },
      { label: "Deep-dive bonus segments", available: true },
    ],
  },
};

// ─── STORY DATA ───
const STORIES = [
  {
    id: 1, title: "Senate passes emergency spending bill in late-night session",
    topic: "Politics", dur: "2:10",
    segments: {
      open: [{ type: "summary", label: "Summary", dur: "2:10", voice: "AI narration" }],
      registered: [
        { type: "summary", label: "Summary", dur: "2:10", voice: "AI narration" },
        { type: "context", label: "Context", dur: "1:30", voice: "AI narration", desc: "What led to this vote and what the key provisions mean" },
      ],
      subscriber: [
        { type: "summary", label: "Summary", dur: "2:10", voice: "Premium AI" },
        { type: "context", label: "Extended Context", dur: "2:15", voice: "Premium AI", desc: "Legislative history, provision-by-provision breakdown" },
        { type: "expert", label: "Expert Take", dur: "1:45", voice: "Congressional correspondent", desc: "Marianna Sotomayor on the behind-the-scenes negotiations" },
      ],
    },
  },
  {
    id: 2, title: "Fed signals rate decision amid mixed economic data",
    topic: "Economy", dur: "1:50",
    segments: {
      open: [{ type: "summary", label: "Summary", dur: "1:50", voice: "AI narration" }],
      registered: [
        { type: "summary", label: "Summary", dur: "1:50", voice: "AI narration" },
        { type: "context", label: "Context", dur: "1:20", voice: "AI narration", desc: "How this fits into the broader rate cycle" },
      ],
      subscriber: [
        { type: "summary", label: "Summary", dur: "1:50", voice: "Premium AI" },
        { type: "context", label: "Extended Context", dur: "1:50", voice: "Premium AI", desc: "Historical rate comparison and market implications" },
        { type: "expert", label: "Expert Take", dur: "2:00", voice: "Economics reporter", desc: "Rachel Siegel on what this means for consumers" },
      ],
    },
  },
  {
    id: 3, title: "Ukraine's new drone strategy is rewriting the rules of warfare",
    topic: "World", dur: "2:30",
    segments: {
      open: [{ type: "summary", label: "Summary", dur: "2:30", voice: "AI narration" }],
      registered: [
        { type: "summary", label: "Summary", dur: "2:30", voice: "AI narration" },
        { type: "context", label: "Context", dur: "1:40", voice: "AI narration", desc: "The technology evolution and its military significance" },
      ],
      subscriber: [
        { type: "summary", label: "Summary", dur: "2:30", voice: "Premium AI" },
        { type: "context", label: "Extended Context", dur: "2:00", voice: "Premium AI", desc: "Detailed tactical analysis and geopolitical implications" },
        { type: "expert", label: "Expert Take", dur: "1:30", voice: "National security reporter", desc: "Dan Lamothe from the Pentagon on drone warfare's future" },
      ],
    },
  },
  {
    id: 4, title: "CRISPR's next frontier: editing genes to fight climate change",
    topic: "Science", dur: "2:00",
    segments: {
      open: [{ type: "summary", label: "Summary", dur: "2:00", voice: "AI narration" }],
      registered: [
        { type: "summary", label: "Summary", dur: "2:00", voice: "AI narration" },
        { type: "context", label: "Context", dur: "1:15", voice: "AI narration", desc: "How gene editing applies to environmental challenges" },
      ],
      subscriber: [
        { type: "summary", label: "Summary", dur: "2:00", voice: "Premium AI" },
        { type: "context", label: "Extended Context", dur: "1:45", voice: "Premium AI", desc: "Scientific methodology and ethical debate" },
        { type: "expert", label: "Expert Take", dur: "1:50", voice: "Science correspondent", desc: "Joel Achenbach with the researchers behind the breakthrough" },
      ],
    },
  },
  {
    id: 5, title: "The AI regulation framework that could reshape Silicon Valley",
    topic: "Technology", dur: "1:45",
    segments: {
      open: [{ type: "summary", label: "Summary", dur: "1:45", voice: "AI narration" }],
      registered: [
        { type: "summary", label: "Summary", dur: "1:45", voice: "AI narration" },
        { type: "context", label: "Context", dur: "1:25", voice: "AI narration", desc: "Key provisions and industry reaction" },
      ],
      subscriber: [
        { type: "summary", label: "Summary", dur: "1:45", voice: "Premium AI" },
        { type: "context", label: "Extended Context", dur: "1:55", voice: "Premium AI", desc: "Global regulatory comparison and compliance timeline" },
        { type: "expert", label: "Expert Take", dur: "1:40", voice: "Technology reporter", desc: "Cat Zakrzewski on the lobbying battle behind the bill" },
      ],
    },
  },
];

const toSec = (d) => { const [m, s] = d.split(":").map(Number); return m * 60 + s; };
const fmtSec = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

// ─── COMPONENTS ───

function WPMark({ color = "#1a1a1a" }) {
  return (
    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 14, color, letterSpacing: "0.01em", opacity: 0.85 }}>
      The Washington Post
    </div>
  );
}

function TierBadge({ tier, size = "default" }) {
  const t = TIERS[tier];
  const sm = size === "sm";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: sm ? 4 : 6,
      padding: sm ? "2px 8px" : "4px 12px",
      borderRadius: 20, background: t.colorSoft,
      border: `1px solid ${t.colorMid}`,
    }}>
      <span style={{ fontSize: sm ? 8 : 10, color: t.color }}>{t.icon}</span>
      <span style={{
        fontSize: sm ? 9 : 10, fontWeight: 700, color: t.color,
        letterSpacing: "0.05em", textTransform: "uppercase",
        fontFamily: "'Söhne', sans-serif",
      }}>{t.label}</span>
    </div>
  );
}

function SegmentTypeIcon({ type, color }) {
  const icons = { summary: "◼", context: "◧", expert: "◉" };
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8,
      background: type === "expert"
        ? `linear-gradient(135deg, ${color}, ${color}dd)`
        : type === "context" ? `${color}18` : `${color}0c`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, color: type === "expert" ? "#fff" : color,
      flexShrink: 0,
    }}>{icons[type]}</div>
  );
}

// ─── TIER COMPARISON VIEW ───
function TierComparison({ activeTier, onSelectTier, onPlay }) {
  const tiers = ["open", "registered", "subscriber"];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "16px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <WPMark />
        <TierBadge tier={activeTier} />
      </div>

      {/* Hero */}
      <div style={{ padding: "36px 24px 20px" }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800,
          color: "#1a1a1a", lineHeight: 1.15, marginBottom: 8,
          letterSpacing: "-0.02em",
        }}>
          Same journalism.<br />
          <span style={{ color: TIERS[activeTier].color }}>Richer listening.</span>
        </div>
        <div style={{
          fontSize: 15, color: "rgba(0,0,0,0.45)", lineHeight: 1.6,
          fontFamily: "'Söhne', sans-serif", maxWidth: 320,
        }}>
          Every tier hears the same stories. Higher tiers unlock deeper context, expert voices, and early access.
        </div>
      </div>

      {/* Tier selector */}
      <div style={{
        display: "flex", margin: "0 20px", borderRadius: 14, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)", background: "#fff",
      }}>
        {tiers.map((t) => {
          const tier = TIERS[t];
          const active = t === activeTier;
          return (
            <div key={t} onClick={() => onSelectTier(t)} style={{
              flex: 1, padding: "14px 8px", textAlign: "center", cursor: "pointer",
              background: active ? tier.color : "transparent",
              transition: "all 0.3s ease",
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                color: active ? "#fff" : "rgba(0,0,0,0.35)",
                fontFamily: "'Söhne', sans-serif",
              }}>{tier.label}</div>
            </div>
          );
        })}
      </div>

      {/* Active tier detail */}
      <div style={{
        margin: "18px 20px 0", padding: "22px 20px",
        background: "#fff", borderRadius: 18,
        border: `1.5px solid ${TIERS[activeTier].colorMid}`,
        transition: "border-color 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 22, color: TIERS[activeTier].color }}>{TIERS[activeTier].icon}</span>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700,
              color: "#1a1a1a",
            }}>{TIERS[activeTier].label}</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", fontFamily: "'Söhne', sans-serif" }}>
              {TIERS[activeTier].tagline}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          {TIERS[activeTier].features.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
              borderBottom: i < TIERS[activeTier].features.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                background: f.available ? `${TIERS[activeTier].color}12` : "rgba(0,0,0,0.03)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: f.available ? TIERS[activeTier].color : "rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}>{f.available ? "✓" : "—"}</div>
              <span style={{
                fontSize: 13, color: f.available ? "#1a1a1a" : "rgba(0,0,0,0.25)",
                fontFamily: "'Söhne', sans-serif",
                fontWeight: f.available ? 500 : 400,
              }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Play CTA */}
      <div style={{ padding: "20px 20px 8px" }}>
        <div onClick={onPlay} style={{
          width: "100%", padding: "16px", borderRadius: 14, textAlign: "center",
          background: TIERS[activeTier].color, color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Söhne', sans-serif",
          boxShadow: `0 4px 20px ${TIERS[activeTier].color}33`,
          transition: "all 0.2s ease",
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ▶ &nbsp;Preview as {TIERS[activeTier].label}
        </div>
      </div>

      {/* Story-level comparison */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.25)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
          fontFamily: "'Söhne', sans-serif",
        }}>Same story, different depth</div>

        <StoryLayerComparison story={STORIES[0]} activeTier={activeTier} />
      </div>

      {/* Upgrade prompt for non-subscriber */}
      {activeTier !== "subscriber" && (
        <div style={{
          margin: "24px 20px 0", padding: "22px 20px",
          background: "linear-gradient(135deg, #faf6ee 0%, #f5f0e5 100%)",
          borderRadius: 18, border: "1px solid rgba(184,134,11,0.12)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(184,134,11,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>★</div>
            <div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700,
                color: "#1a1a1a", marginBottom: 4,
              }}>Unlock the full experience</div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", lineHeight: 1.5, fontFamily: "'Söhne', sans-serif" }}>
                {activeTier === "open"
                  ? "Create a free account to unlock context segments and story bookmarking."
                  : "Subscribe to hear expert commentary, get early access, and personalised story selection."
                }
              </div>
              <div style={{
                marginTop: 12, display: "inline-block", padding: "10px 20px",
                borderRadius: 10, background: "#b8860b", color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Söhne', sans-serif",
              }}>
                {activeTier === "open" ? "Create free account" : "Subscribe now"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Concept notes */}
      <div style={{
        margin: "28px 20px 32px", padding: "20px",
        borderRadius: 16, background: "rgba(0,0,0,0.02)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.3)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12,
          fontFamily: "'Söhne', sans-serif",
        }}>Design principle</div>
        <div style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.7, fontFamily: "'Söhne', sans-serif" }}>
          The journalism is identical across all tiers — no paywall on the news itself. What changes is the richness of the audio packaging: additional context, expert voices, and personalisation. This preserves editorial integrity while creating genuine value differentiation.
        </div>
      </div>
    </div>
  );
}

// ─── STORY LAYER COMPARISON ───
function StoryLayerComparison({ story, activeTier }) {
  const tiers = ["open", "registered", "subscriber"];
  return (
    <div style={{
      background: "#fff", borderRadius: 18, overflow: "hidden",
      border: "1px solid rgba(0,0,0,0.06)", marginBottom: 24,
    }}>
      <div style={{
        padding: "16px 18px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Söhne', sans-serif" }}>{story.topic}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35 }}>{story.title}</div>
      </div>
      {tiers.map((t) => {
        const tier = TIERS[t];
        const segments = story.segments[t];
        const isActive = t === activeTier;
        const totalDur = segments.reduce((s, seg) => s + toSec(seg.dur), 0);
        return (
          <div key={t} style={{
            padding: "14px 18px",
            background: isActive ? tier.colorSoft : "transparent",
            borderBottom: t !== "subscriber" ? "1px solid rgba(0,0,0,0.04)" : "none",
            borderLeft: isActive ? `3px solid ${tier.color}` : "3px solid transparent",
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <TierBadge tier={t} size="sm" />
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", fontFamily: "'Söhne', sans-serif" }}>{fmtSec(totalDur)} total</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {segments.map((seg, i) => (
                <div key={i} style={{
                  flex: toSec(seg.dur), height: 6, borderRadius: 3,
                  background: seg.type === "summary" ? `${tier.color}40`
                    : seg.type === "context" ? `${tier.color}80`
                    : tier.color,
                  transition: "all 0.3s ease",
                }} title={`${seg.label}: ${seg.dur}`} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {segments.map((seg, i) => (
                <span key={i} style={{
                  fontSize: 10, color: "rgba(0,0,0,0.35)",
                  fontFamily: "'Söhne', sans-serif",
                }}>{seg.label} ({seg.dur}){i < segments.length - 1 ? " ·" : ""}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PLAYER SCREEN ───
function PlayerScreen({ tier, onBack, onUpgrade }) {
  const t = TIERS[tier];
  const stories = tier === "open" ? STORIES.slice(0, 5) : tier === "registered" ? STORIES.slice(0, 5) : STORIES;
  const [storyIdx, setStoryIdx] = useState(0);
  const [segIdx, setSegIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const intervalRef = useRef(null);

  const story = stories[storyIdx];
  const segments = story.segments[tier];
  const seg = segments[segIdx];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            if (segIdx < segments.length - 1) {
              setSegIdx(si => si + 1);
              return 0;
            } else if (storyIdx < stories.length - 1) {
              setStoryIdx(si => si + 1);
              setSegIdx(0);
              return 0;
            }
            setIsPlaying(false);
            return 1;
          }
          return p + 0.005;
        });
      }, 50);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, segIdx, storyIdx, segments.length, stories.length]);

  useEffect(() => { setProgress(0); }, [segIdx, storyIdx]);

  // Show upgrade nudge when hitting a point where higher tier has more
  const higherTierHasMore = tier !== "subscriber" && segIdx === segments.length - 1 && progress > 0.8;

  const nextTier = tier === "open" ? "registered" : "subscriber";
  const nextTierSegments = story.segments[nextTier];
  const lockedSegments = nextTierSegments.slice(segments.length);

  return (
    <div style={{
      background: t.bg, minHeight: "100vh",
      fontFamily: "'Söhne', sans-serif",
      animation: "fadeIn 0.35s ease",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onBack} style={{ cursor: "pointer", color: "rgba(0,0,0,0.35)", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>‹</span> Back
        </div>
        <TierBadge tier={tier} />
        <div style={{ width: 50 }} />
      </div>

      {/* Edition header */}
      {tier === "subscriber" && (
        <div style={{
          margin: "0 20px 12px", padding: "10px 16px", borderRadius: 12,
          background: "rgba(184,134,11,0.06)", border: "1px solid rgba(184,134,11,0.1)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>⚡</span>
          <span style={{ fontSize: 12, color: "#b8860b", fontWeight: 600 }}>
            Early Access Edition · Available since 5:30 AM
          </span>
        </div>
      )}

      {/* Now playing */}
      <div style={{ padding: "16px 24px 8px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
          {story.topic} · Story {storyIdx + 1} of {stories.length}
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, marginBottom: 8 }}>
          {story.title}
        </div>
      </div>

      {/* Segment indicator */}
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {segments.map((s, i) => (
            <div key={i} style={{
              flex: toSec(s.dur), height: 28, borderRadius: 8, overflow: "hidden",
              background: i < segIdx ? `${t.color}25` : i === segIdx ? `${t.color}12` : "rgba(0,0,0,0.04)",
              border: i === segIdx ? `1.5px solid ${t.color}` : "1.5px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s ease", position: "relative",
            }} onClick={() => { setSegIdx(i); setProgress(0); }}>
              {i === segIdx && (
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${progress * 100}%`, background: `${t.color}20`,
                  transition: "width 0.05s linear",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 4, zIndex: 1 }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, color: i <= segIdx ? t.color : "rgba(0,0,0,0.25)",
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>{s.label}</span>
              </div>
            </div>
          ))}
          {/* Locked segments tease */}
          {lockedSegments.map((s, i) => (
            <div key={`locked-${i}`} style={{
              flex: toSec(s.dur), height: 28, borderRadius: 8,
              background: "repeating-linear-gradient(135deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 4px, transparent 4px, transparent 8px)",
              border: "1.5px dashed rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }} onClick={() => setShowUpgrade(true)}>
              <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(0,0,0,0.2)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                🔒 {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current segment detail */}
      <div style={{
        margin: "8px 20px 0", padding: "16px 18px", borderRadius: 14,
        background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <SegmentTypeIcon type={seg.type} color={t.color} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{seg.label}</span>
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.3)" }}>{seg.dur}</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10 }}>{seg.type === "expert" ? "🎤" : "🔊"}</span>
              {seg.voice}
            </div>
            {seg.desc && (
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", marginTop: 6, lineHeight: 1.5, fontStyle: "italic" }}>
                {seg.desc}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Waveform */}
      <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} style={{
            width: 3, borderRadius: 2,
            background: seg.type === "expert" ? t.color : `${t.color}88`,
            opacity: isPlaying ? 0.7 : 0.12,
            animation: isPlaying ? `waveBar 0.7s ease ${i * 0.03}s infinite alternate` : "none",
            transition: "opacity 0.3s ease",
          }} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 24px" }}>
        <div style={{ width: "100%", height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: t.color, borderRadius: 2, transition: "width 0.05s linear" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(0,0,0,0.25)", marginTop: 6, marginBottom: 20 }}>
          <span>{fmtSec(progress * toSec(seg.dur))}</span>
          <span>{seg.dur}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, padding: "0 24px 12px" }}>
        <div onClick={() => { if (segIdx > 0) { setSegIdx(s => s - 1); setProgress(0); } else if (storyIdx > 0) { setStoryIdx(s => s - 1); setSegIdx(0); setProgress(0); } }}
          style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(0,0,0,0.3)", cursor: "pointer" }}>
          ⏮
        </div>
        <div onClick={() => setIsPlaying(!isPlaying)} style={{
          width: 64, height: 64, borderRadius: "50%",
          background: t.color, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, color: "#fff", cursor: "pointer",
          boxShadow: `0 4px 20px ${t.color}33`,
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.93)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </div>
        <div onClick={() => { if (segIdx < segments.length - 1) { setSegIdx(s => s + 1); setProgress(0); } else if (storyIdx < stories.length - 1) { setStoryIdx(s => s + 1); setSegIdx(0); setProgress(0); } }}
          style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "rgba(0,0,0,0.3)", cursor: "pointer" }}>
          ⏭
        </div>
      </div>

      {/* Upgrade nudge — appears contextually */}
      {higherTierHasMore && tier !== "subscriber" && !showUpgrade && (
        <div onClick={() => setShowUpgrade(true)} style={{
          margin: "16px 20px 0", padding: "14px 18px", borderRadius: 14,
          background: TIERS[nextTier].colorSoft,
          border: `1px solid ${TIERS[nextTier].colorMid}`,
          cursor: "pointer", animation: "fadeSlideUp 0.4s ease",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: TIERS[nextTier].color,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, flexShrink: 0,
          }}>{TIERS[nextTier].icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              This story continues with {nextTier === "registered" ? "context" : "expert commentary"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>
              {lockedSegments.map(s => s.label).join(" + ")} available with {TIERS[nextTier].label}
            </div>
          </div>
          <span style={{ color: TIERS[nextTier].color, fontSize: 16 }}>→</span>
        </div>
      )}

      {/* Story list */}
      <div style={{
        margin: "20px 0 0", padding: "22px 20px 100px",
        background: "#fff", borderRadius: "22px 22px 0 0",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.25)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
        }}>
          {TIERS[tier].label} edition · {stories.length} stories
        </div>
        {stories.map((s, i) => {
          const segs = s.segments[tier];
          const active = i === storyIdx;
          return (
            <div key={s.id} onClick={() => { setStoryIdx(i); setSegIdx(0); setProgress(0); setIsPlaying(true); }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 14px", borderRadius: 14, marginBottom: 3,
                background: active ? t.colorSoft : "transparent",
                borderLeft: active ? `3px solid ${t.color}` : "3px solid transparent",
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
              <div style={{ flexShrink: 0, width: 22, textAlign: "center", marginTop: 2 }}>
                {active && isPlaying ? (
                  <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 14, justifyContent: "center" }}>
                    {[6, 12, 8, 10].map((h, j) => (
                      <div key={j} style={{ width: 2, background: t.color, borderRadius: 1, animation: `waveBar 0.6s ease ${j * 0.1}s infinite alternate` }} />
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 600, color: i < storyIdx ? "rgba(0,0,0,0.15)" : active ? t.color : "rgba(0,0,0,0.25)" }}>{i + 1}</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: active ? t.color : "rgba(0,0,0,0.25)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 2 }}>
                  {s.topic}
                </div>
                <div style={{
                  fontSize: 13, color: i < storyIdx ? "rgba(0,0,0,0.3)" : "#1a1a1a", fontWeight: 500,
                  lineHeight: 1.35, fontFamily: "'Playfair Display', serif",
                  textDecoration: i < storyIdx ? "line-through" : "none",
                  textDecorationColor: "rgba(0,0,0,0.1)",
                }}>{s.title}</div>
                {/* Segment pills */}
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  {segs.map((seg, si) => (
                    <span key={si} style={{
                      fontSize: 9, padding: "2px 7px", borderRadius: 6,
                      background: seg.type === "expert" ? `${t.color}18` : seg.type === "context" ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.03)",
                      color: seg.type === "expert" ? t.color : "rgba(0,0,0,0.35)",
                      fontWeight: 600, letterSpacing: "0.02em",
                    }}>{seg.type === "expert" ? "🎤 " : ""}{seg.label}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.2)", flexShrink: 0, marginTop: 14 }}>{s.dur}</span>
            </div>
          );
        })}
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.2s ease",
        }} onClick={() => setShowUpgrade(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 22, padding: "32px 24px",
            maxWidth: 360, width: "90%", animation: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: "0 auto 14px",
                background: TIERS[nextTier].colorSoft,
                border: `2px solid ${TIERS[nextTier].colorMid}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, color: TIERS[nextTier].color,
              }}>{TIERS[nextTier].icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>
                Upgrade to {TIERS[nextTier].label}
              </div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", lineHeight: 1.6 }}>
                {nextTier === "registered"
                  ? "Create a free account to unlock context segments for every story."
                  : "Subscribe to hear expert voices, extended analysis, and get early access."
                }
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.25)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>
                You'll unlock for this story:
              </div>
              {lockedSegments.map((seg, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
                  borderBottom: i < lockedSegments.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}>
                  <SegmentTypeIcon type={seg.type} color={TIERS[nextTier].color} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{seg.label} · {seg.dur}</div>
                    {seg.desc && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{seg.desc}</div>}
                    <div style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", marginTop: 2 }}>{seg.type === "expert" ? "🎤" : "🔊"} {seg.voice}</div>
                  </div>
                </div>
              ))}
            </div>

            <div onClick={() => { setShowUpgrade(false); onUpgrade(nextTier); }} style={{
              width: "100%", padding: "14px", borderRadius: 12, textAlign: "center",
              background: TIERS[nextTier].color, color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>
              {nextTier === "registered" ? "Create free account" : "Subscribe now"}
            </div>
            <div onClick={() => setShowUpgrade(false)} style={{
              textAlign: "center", marginTop: 12, fontSize: 13,
              color: "rgba(0,0,0,0.35)", cursor: "pointer",
            }}>Maybe later</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ───
export default function WPTieredAudio() {
  const [screen, setScreen] = useState("tiers"); // tiers | player
  const [activeTier, setActiveTier] = useState("open");

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh",
      background: TIERS[activeTier].bg,
      transition: "background 0.4s ease",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&display=swap');
        @font-face {
          font-family: 'Söhne';
          src: local('Söhne'), local('Sohne'), local('-apple-system'), local('BlinkMacSystemFont');
          font-weight: 300 700;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }
        @keyframes waveBar { 0% { height: 3px; } 50% { height: 20px; } 100% { height: 7px; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f4f1; -webkit-font-smoothing: antialiased; }
      `}</style>

      {screen === "tiers" && (
        <TierComparison
          activeTier={activeTier}
          onSelectTier={setActiveTier}
          onPlay={() => setScreen("player")}
        />
      )}

      {screen === "player" && (
        <PlayerScreen
          tier={activeTier}
          onBack={() => setScreen("tiers")}
          onUpgrade={(t) => { setActiveTier(t); }}
        />
      )}
    </div>
  );
}
