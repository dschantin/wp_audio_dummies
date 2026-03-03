import { useState, useEffect, useRef } from "react";

const EDITIONS = {
  morning: {
    id: "morning",
    label: "The Morning",
    time: "6:00 AM",
    duration: "18 min",
    greeting: "Good morning.",
    tagline: "The stories shaping your day ahead.",
    tone: "Sharp. Urgent. Essential.",
    pacing: "Brisk, authoritative delivery",
    bgGrad: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
    accent: "#e2a04f",
    accentSoft: "rgba(226,160,79,0.12)",
    icon: "☀️",
    timeIcon: "🌅",
    stories: [
      { type: "LEAD", title: "Senate passes emergency spending bill in late-night session", dur: "4:20", priority: "high" },
      { type: "POLITICS", title: "White House pivots on trade policy as tariff deadline looms", dur: "3:10", priority: "high" },
      { type: "ECONOMY", title: "Fed signals rate decision amid mixed jobs data", dur: "2:45", priority: "high" },
      { type: "WORLD", title: "EU leaders convene on Eastern European security pact", dur: "2:30", priority: "medium" },
      { type: "TECH", title: "Major AI regulation framework advances in Congress", dur: "2:15", priority: "medium" },
      { type: "MARKETS", title: "What to watch: Futures point to cautious open on Wall Street", dur: "1:40", priority: "low" },
    ],
  },
  midday: {
    id: "midday",
    label: "The Midday",
    time: "12:00 PM",
    duration: "14 min",
    greeting: "Here's what's new.",
    tagline: "Catch up, slow down, stay informed.",
    tone: "Conversational. Curious. Varied.",
    pacing: "Relaxed but informed, mixed topics",
    bgGrad: "linear-gradient(135deg, #f5f0e8 0%, #e8dfd3 40%, #d4c5a9 100%)",
    accent: "#c0392b",
    accentSoft: "rgba(192,57,43,0.08)",
    icon: "🌤",
    timeIcon: "☕",
    stories: [
      { type: "UPDATE", title: "Senate spending bill: What's in it and what comes next", dur: "2:30", priority: "high" },
      { type: "CULTURE", title: "The museum show everyone is talking about this spring", dur: "3:15", priority: "medium" },
      { type: "SCIENCE", title: "Why the newly discovered high-altitude species matters", dur: "2:40", priority: "medium" },
      { type: "FOOD", title: "The D.C. restaurant that's quietly become a power lunch spot", dur: "2:10", priority: "low" },
      { type: "SPORTS", title: "March Madness bracket breakdown: The upset picks to know", dur: "2:00", priority: "low" },
    ],
  },
  evening: {
    id: "evening",
    label: "The Evening",
    time: "6:00 PM",
    duration: "10 min",
    greeting: "Your day, wrapped.",
    tagline: "What mattered. What's next.",
    tone: "Reflective. Concise. Forward-looking.",
    pacing: "Calm, summary-driven, tomorrow preview",
    bgGrad: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #2d1b4e 100%)",
    accent: "#8b7ec8",
    accentSoft: "rgba(139,126,200,0.12)",
    icon: "🌙",
    timeIcon: "🌆",
    stories: [
      { type: "RECAP", title: "The spending bill passed — here's the 90-second version", dur: "1:30", priority: "high" },
      { type: "RECAP", title: "Markets closed mixed. Here's what moved.", dur: "1:15", priority: "medium" },
      { type: "ANALYSIS", title: "Why today's trade policy shift matters long-term", dur: "2:20", priority: "high" },
      { type: "TOMORROW", title: "Fed decision day: What to expect Wednesday morning", dur: "2:00", priority: "high" },
      { type: "TOMORROW", title: "The confirmation hearing that could reshape tech policy", dur: "1:45", priority: "medium" },
      { type: "CLOSE", title: "One good thing: The community library that won't quit", dur: "1:40", priority: "low" },
    ],
  },
};

const getCurrentEdition = () => {
  const h = new Date().getHours();
  if (h < 11) return "morning";
  if (h < 17) return "midday";
  return "evening";
};

// --- COMPONENTS ---

function WPLogo({ dark }) {
  return (
    <div style={{ fontFamily: "'Old Standard TT', serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em", color: dark ? "#fff" : "#1a1a1a", opacity: 0.9 }}>
      The Washington Post
    </div>
  );
}

function MiniPlayer({ edition, onExpand, isPlaying, onToggle }) {
  const e = EDITIONS[edition];
  const isDark = edition !== "midday";
  return (
    <div onClick={onExpand} style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: isDark ? "rgba(20,20,35,0.97)" : "rgba(245,240,232,0.97)",
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      padding: "12px 20px", display: "flex", alignItems: "center", gap: 14,
      cursor: "pointer", zIndex: 100,
    }}>
      <div onClick={(ev) => { ev.stopPropagation(); onToggle(); }} style={{
        width: 36, height: 36, borderRadius: "50%", background: e.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: "#fff", cursor: "pointer", flexShrink: 0,
      }}>
        {isPlaying ? "❚❚" : "▶"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#fff" : "#1a1a1a", fontFamily: "'Old Standard TT', serif" }}>{e.label}</div>
        <div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)", marginTop: 1 }}>Playing • {e.duration}</div>
      </div>
      <ProgressRing color={e.accent} progress={0.35} size={28} />
    </div>
  );
}

function ProgressRing({ color, progress, size }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,0.2)" strokeWidth={2.5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={2.5}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round" />
    </svg>
  );
}

function EditionCard({ edition, isCurrent, onClick, index }) {
  const e = EDITIONS[edition];
  const isDark = edition !== "midday";
  return (
    <div onClick={onClick} style={{
      background: e.bgGrad,
      borderRadius: 16, padding: "28px 24px", cursor: "pointer",
      position: "relative", overflow: "hidden",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      boxShadow: isCurrent ? `0 8px 32px rgba(0,0,0,0.25)` : "0 2px 12px rgba(0,0,0,0.1)",
      animation: `fadeSlideUp 0.5s ease ${index * 0.1}s both`,
      border: isCurrent ? `2px solid ${e.accent}` : "2px solid transparent",
    }}
    onMouseEnter={(ev) => ev.currentTarget.style.transform = "translateY(-3px)"}
    onMouseLeave={(ev) => ev.currentTarget.style.transform = "translateY(0)"}
    >
      {isCurrent && (
        <div style={{
          position: "absolute", top: 14, right: 16,
          background: e.accent, borderRadius: 20,
          padding: "3px 10px", fontSize: 10, fontWeight: 700,
          color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>NOW</div>
      )}
      <div style={{ fontSize: 28, marginBottom: 12 }}>{e.icon}</div>
      <div style={{
        fontFamily: "'Old Standard TT', serif", fontSize: 22, fontWeight: 700,
        color: isDark ? "#fff" : "#1a1a1a", marginBottom: 4,
      }}>{e.label}</div>
      <div style={{
        fontSize: 13, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)",
        marginBottom: 14, fontFamily: "'DM Sans', sans-serif",
      }}>{e.time} · {e.duration} · {e.stories.length} stories</div>
      <div style={{
        fontSize: 15, lineHeight: 1.5,
        color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
        fontFamily: "'DM Sans', sans-serif",
      }}>{e.tagline}</div>
      <div style={{
        marginTop: 14, fontSize: 11, color: e.accent,
        fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
      }}>{e.tone}</div>
    </div>
  );
}

function PlayerScreen({ edition, onBack, isPlaying, onToggle, activeStory, setActiveStory }) {
  const e = EDITIONS[edition];
  const isDark = edition !== "midday";
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setProgress(p => p >= 1 ? 0 : p + 0.003), 50);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const textColor = isDark ? "#fff" : "#1a1a1a";
  const subColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div style={{
      background: e.bgGrad, minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
      animation: "fadeIn 0.35s ease",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onBack} style={{
          cursor: "pointer", color: subColor, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 18 }}>‹</span> Back
        </div>
        <WPLogo dark={isDark} />
        <div style={{ width: 50 }} />
      </div>

      {/* Edition hero */}
      <div style={{ padding: "20px 24px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>{e.icon}</div>
        <div style={{
          fontFamily: "'Old Standard TT', serif", fontSize: 30, fontWeight: 700,
          color: textColor, marginBottom: 6,
        }}>{e.label}</div>
        <div style={{ fontSize: 15, color: subColor, marginBottom: 4 }}>{e.tagline}</div>
        <div style={{ fontSize: 12, color: e.accent, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 8 }}>
          {e.pacing}
        </div>
      </div>

      {/* Player controls */}
      <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Progress bar */}
        <div style={{ width: "100%", height: 3, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: e.accent, borderRadius: 2, transition: "width 0.05s linear" }} />
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 11, color: subColor, marginBottom: 20 }}>
          <span>{Math.floor(progress * 18)}:{String(Math.floor((progress * 18 * 60) % 60)).padStart(2, "0")}</span>
          <span>{e.duration}</span>
        </div>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 8 }}>
          <div style={{ color: subColor, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>−15s</div>
          <div onClick={onToggle} style={{
            width: 64, height: 64, borderRadius: "50%", background: e.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "#fff", cursor: "pointer",
            boxShadow: `0 4px 20px ${e.accent}55`,
            transition: "transform 0.15s ease",
          }}
          onMouseDown={(ev) => ev.currentTarget.style.transform = "scale(0.93)"}
          onMouseUp={(ev) => ev.currentTarget.style.transform = "scale(1)"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </div>
          <div style={{ color: subColor, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>+30s</div>
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <div style={{ fontSize: 11, color: subColor, cursor: "pointer", padding: "4px 10px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}>1.0×</div>
          <div style={{ fontSize: 11, color: subColor, cursor: "pointer", padding: "4px 10px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}>Transcript</div>
          <div style={{ fontSize: 11, color: subColor, cursor: "pointer", padding: "4px 10px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}>Share</div>
        </div>
      </div>

      {/* Story list */}
      <div style={{
        background: isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.6)",
        borderRadius: "24px 24px 0 0", padding: "24px 20px 100px",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: subColor, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
          In this edition
        </div>
        {e.stories.map((s, i) => (
          <div key={i} onClick={() => setActiveStory(i)}
            style={{
              padding: "14px 16px", borderRadius: 12, marginBottom: 6, cursor: "pointer",
              background: activeStory === i ? e.accentSoft : "transparent",
              borderLeft: activeStory === i ? `3px solid ${e.accent}` : "3px solid transparent",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "flex-start", gap: 12,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              {activeStory === i && isPlaying ? (
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 14 }}>
                  {[8, 14, 10, 12].map((h, j) => (
                    <div key={j} style={{
                      width: 2.5, background: e.accent, borderRadius: 1,
                      animation: `barBounce 0.6s ease ${j * 0.1}s infinite alternate`,
                      height: h,
                    }} />
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: subColor, fontWeight: 600, width: 16, textAlign: "center" }}>{i + 1}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                  color: e.accent, textTransform: "uppercase",
                }}>{s.type}</span>
                {s.priority === "high" && (
                  <span style={{
                    fontSize: 8, background: e.accentSoft, color: e.accent,
                    padding: "1px 6px", borderRadius: 4, fontWeight: 700,
                  }}>TOP</span>
                )}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 600, color: textColor, lineHeight: 1.4,
                fontFamily: "'Old Standard TT', serif",
              }}>{s.title}</div>
            </div>
            <div style={{ fontSize: 11, color: subColor, flexShrink: 0, marginTop: 14 }}>{s.dur}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DaypartTimeline({ current, onSelect }) {
  const parts = ["morning", "midday", "evening"];
  const labels = ["AM", "NOON", "PM"];
  const icons = ["🌅", "☀️", "🌙"];
  const ci = parts.indexOf(current);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "0 24px 28px", position: "relative" }}>
      {/* connecting line */}
      <div style={{
        position: "absolute", top: "50%", left: "15%", right: "15%", height: 2,
        background: "rgba(128,128,128,0.15)", borderRadius: 1, transform: "translateY(-50%)",
      }} />
      {parts.map((p, i) => {
        const active = i <= ci;
        return (
          <div key={p} onClick={() => onSelect(p)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            cursor: "pointer", position: "relative", zIndex: 1,
          }}>
            <div style={{
              width: i === ci ? 40 : 30, height: i === ci ? 40 : 30,
              borderRadius: "50%",
              background: active ? EDITIONS[p].accent : "rgba(128,128,128,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: i === ci ? 18 : 14,
              transition: "all 0.3s ease",
              boxShadow: i === ci ? `0 2px 12px ${EDITIONS[p].accent}44` : "none",
            }}>{icons[i]}</div>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
              color: active ? EDITIONS[p].accent : "rgba(128,128,128,0.4)",
            }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function ConceptNotes({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "20px 20px 0 0", padding: "28px 24px 40px",
        maxWidth: 420, width: "100%", maxHeight: "80vh", overflowY: "auto",
        animation: "slideUp 0.35s ease",
      }}>
        <div style={{ width: 36, height: 4, background: "#ddd", borderRadius: 2, margin: "0 auto 20px" }} />
        <h3 style={{ fontFamily: "'Old Standard TT', serif", fontSize: 20, marginBottom: 16, color: "#1a1a1a" }}>Edition Design Framework</h3>
        
        {[
          { label: "The Morning", color: "#e2a04f", items: ["Hard news priority", "Brisk, authoritative pacing", "Markets & politics lead", "\"What you need to know\" framing", "~18 min / 6 stories"] },
          { label: "The Midday", color: "#c0392b", items: ["News updates + softer mix", "Conversational, curious tone", "Culture, food, sports blended in", "\"Catch up\" framing", "~14 min / 5 stories"] },
          { label: "The Evening", color: "#8b7ec8", items: ["Summaries & recaps", "Reflective, calm pacing", "Tomorrow preview section", "\"Your day, wrapped\" framing", "~10 min / 6 shorter stories"] },
        ].map((ed) => (
          <div key={ed.label} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: ed.color, fontSize: 14, marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{ed.label}</div>
            {ed.items.map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "#555", lineHeight: 1.7, paddingLeft: 12, position: "relative", fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ position: "absolute", left: 0, color: ed.color }}>·</span>
                {item}
              </div>
            ))}
          </div>
        ))}

        <div style={{ borderTop: "1px solid #eee", paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#1a1a1a" }}>Key Consideration</div>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            Differentiation across editions requires careful tone management so the WP voice remains consistent while pacing, story selection, and framing shift to match the listener's moment in the day.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP ---

export default function WPAudioEditions() {
  const [screen, setScreen] = useState("home"); // home | player
  const [activeEdition, setActiveEdition] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showMini, setShowMini] = useState(false);
  const currentEdition = getCurrentEdition();

  const openEdition = (ed) => {
    setActiveEdition(ed);
    setScreen("player");
    setIsPlaying(true);
    setActiveStory(0);
    setShowMini(false);
  };

  const goHome = () => {
    setScreen("home");
    if (activeEdition) setShowMini(true);
  };

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh",
      background: "#faf9f6", position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes barBounce { from { height: 4px; } to { height: 14px; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0ede8; }
      `}</style>

      {screen === "home" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {/* Status bar mock */}
          <div style={{ padding: "12px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 16, height: 10, border: "1.5px solid #1a1a1a", borderRadius: 2, position: "relative" }}>
                <div style={{ position: "absolute", inset: 2, background: "#1a1a1a", borderRadius: 0.5 }} />
              </div>
            </div>
          </div>

          {/* Header */}
          <div style={{ padding: "20px 24px 8px" }}>
            <WPLogo dark={false} />
            <div style={{
              fontFamily: "'Old Standard TT', serif", fontSize: 28, fontWeight: 700,
              color: "#1a1a1a", marginTop: 16, lineHeight: 1.2,
            }}>
              Daily Audio Editions
            </div>
            <div style={{ fontSize: 14, color: "rgba(0,0,0,0.45)", marginTop: 6, lineHeight: 1.5 }}>
              Three moments. One trusted voice. Your day, informed.
            </div>
          </div>

          {/* Day timeline */}
          <div style={{ padding: "20px 0 0" }}>
            <DaypartTimeline current={currentEdition} onSelect={openEdition} />
          </div>

          {/* Edition cards */}
          <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {["morning", "midday", "evening"].map((ed, i) => (
              <EditionCard
                key={ed}
                edition={ed}
                isCurrent={ed === currentEdition}
                onClick={() => openEdition(ed)}
                index={i}
              />
            ))}
          </div>

          {/* Concept info button */}
          <div style={{ padding: "0 20px 120px", display: "flex", justifyContent: "center" }}>
            <div onClick={() => setShowNotes(true)} style={{
              fontSize: 12, color: "rgba(0,0,0,0.35)", cursor: "pointer",
              padding: "8px 16px", borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.1)",
              fontWeight: 600, letterSpacing: "0.03em",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              ℹ️ Edition Design Notes
            </div>
          </div>
        </div>
      )}

      {screen === "player" && activeEdition && (
        <PlayerScreen
          edition={activeEdition}
          onBack={goHome}
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying(!isPlaying)}
          activeStory={activeStory}
          setActiveStory={setActiveStory}
        />
      )}

      {showMini && screen === "home" && activeEdition && (
        <MiniPlayer
          edition={activeEdition}
          onExpand={() => { setScreen("player"); setShowMini(false); }}
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying(!isPlaying)}
        />
      )}

      {showNotes && <ConceptNotes onClose={() => setShowNotes(false)} />}
    </div>
  );
}
