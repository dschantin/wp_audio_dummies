import { useState, useEffect, useRef } from "react";

const MODES = {
  update: {
    id: "update",
    label: "Update Me",
    emoji: "⚡",
    tagline: "What's happening right now.",
    description: "Fast, factual briefings on breaking and developing stories. No filler, just the essentials.",
    tone: "Brisk · Direct · Factual",
    duration: "8–12 min",
    color: "#2563eb",
    colorSoft: "rgba(37,99,235,0.08)",
    colorMid: "rgba(37,99,235,0.15)",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #1a2744 50%, #0f172a 100%)",
    stories: [
      { tag: "BREAKING", title: "Senate clears emergency spending package in 52-48 vote", dur: "1:40", fresh: true },
      { tag: "DEVELOPING", title: "Tariff deadline moves to Friday after last-minute extension", dur: "1:20", fresh: true },
      { tag: "MARKETS", title: "Dow drops 280 points on mixed signals from the Fed", dur: "1:05", fresh: false },
      { tag: "WORLD", title: "EU announces new Eastern European defense commitments", dur: "1:30", fresh: false },
      { tag: "TECH", title: "FTC moves to block major AI acquisition", dur: "1:15", fresh: true },
      { tag: "QUICK HIT", title: "CDC updates spring allergy guidance for 2026", dur: "0:45", fresh: false },
    ],
  },
  explain: {
    id: "explain",
    label: "Explain It",
    emoji: "🔍",
    tagline: "Help me understand.",
    description: "Context-rich explainers that break down complex stories. Background, history, and why it matters.",
    tone: "Clear · Layered · Educational",
    duration: "12–18 min",
    color: "#0d9488",
    colorSoft: "rgba(13,148,136,0.08)",
    colorMid: "rgba(13,148,136,0.15)",
    gradient: "linear-gradient(135deg, #134e4a 0%, #0f2d2b 50%, #0a1a19 100%)",
    stories: [
      { tag: "EXPLAINER", title: "The spending bill: What's actually in it and why it took months", dur: "4:10", fresh: false },
      { tag: "HOW IT WORKS", title: "Tariffs, explained — who pays and what changes at the store", dur: "3:30", fresh: false },
      { tag: "BACKSTORY", title: "The 30-year path to this week's EU security pact", dur: "3:15", fresh: false },
      { tag: "101", title: "What the Fed rate decision actually means for your mortgage", dur: "2:50", fresh: false },
      { tag: "DEEP DIVE", title: "Why AI regulation keeps stalling — and what's different now", dur: "3:45", fresh: false },
    ],
  },
  perspective: {
    id: "perspective",
    label: "Give Me Perspective",
    emoji: "💭",
    tagline: "What should I think about this?",
    description: "Analysis, opinion, and multiple viewpoints on the stories that matter. Hear the arguments, form your view.",
    tone: "Nuanced · Provocative · Multi-angle",
    duration: "14–20 min",
    color: "#9333ea",
    colorSoft: "rgba(147,51,234,0.08)",
    colorMid: "rgba(147,51,234,0.15)",
    gradient: "linear-gradient(135deg, #3b1764 0%, #1e0a3a 50%, #0f0520 100%)",
    stories: [
      { tag: "ANALYSIS", title: "The spending bill is a win — but for whom?", dur: "3:40", fresh: false },
      { tag: "DEBATE", title: "Two views: Are tariffs protecting or punishing American workers?",  dur: "4:20", fresh: false },
      { tag: "OPINION", title: "Europe's defense pivot is long overdue. Here's why it still won't be enough.", dur: "3:10", fresh: false },
      { tag: "COLUMNIST", title: "The Fed is out of good options. That's the point.", dur: "3:00", fresh: false },
      { tag: "GLOBAL VIEW", title: "How the rest of the world sees America's AI regulation gap", dur: "2:50", fresh: false },
    ],
  },
  inspire: {
    id: "inspire",
    label: "Inspire Me",
    emoji: "✨",
    tagline: "Show me something unexpected.",
    description: "Surprising stories, bold ideas, and the people changing things. The news you didn't know you needed.",
    tone: "Uplifting · Surprising · Human",
    duration: "10–15 min",
    color: "#e0447a",
    colorSoft: "rgba(224,68,122,0.08)",
    colorMid: "rgba(224,68,122,0.15)",
    gradient: "linear-gradient(135deg, #5c1a34 0%, #3a0f20 50%, #1a0710 100%)",
    stories: [
      { tag: "BREAKTHROUGH", title: "The teenager who built a water filter that could change rural healthcare", dur: "3:20", fresh: true },
      { tag: "RETHINK", title: "What a tiny Finnish town figured out about loneliness that cities can't", dur: "3:00", fresh: false },
      { tag: "HIDDEN STORY", title: "Inside the postal workers quietly reuniting families across borders", dur: "2:45", fresh: false },
      { tag: "IDEAS", title: "A radical proposal: What if highways became parks?", dur: "2:30", fresh: true },
      { tag: "VOICES", title: "She left Wall Street to farm. Five years later, she has no regrets.", dur: "3:10", fresh: false },
    ],
  },
  help: {
    id: "help",
    label: "Help Me",
    emoji: "🧭",
    tagline: "What should I actually do?",
    description: "Actionable guidance tied to the news. Practical steps, tools, and decisions to make today.",
    tone: "Practical · Empowering · Actionable",
    duration: "10–14 min",
    color: "#dc6b20",
    colorSoft: "rgba(220,107,32,0.08)",
    colorMid: "rgba(220,107,32,0.15)",
    gradient: "linear-gradient(135deg, #5c2d0e 0%, #3a1a07 50%, #1a0d03 100%)",
    stories: [
      { tag: "YOUR MONEY", title: "The spending bill passed. Here's what changes for your wallet.", dur: "2:30", fresh: false },
      { tag: "ACTION STEP", title: "Tariff prices hitting soon — what to buy now vs. wait on", dur: "2:15", fresh: false },
      { tag: "DECISION GUIDE", title: "Should you lock in your mortgage rate before Wednesday?", dur: "2:40", fresh: false },
      { tag: "CHECKLIST", title: "AI tools at work: What your company should be doing right now", dur: "2:20", fresh: false },
      { tag: "TIP", title: "New CDC allergy guidance — 3 things to do this week", dur: "1:50", fresh: false },
    ],
  },
};

const TOPICS = [
  { id: "top", label: "Top Stories", icon: "📰" },
  { id: "politics", label: "Politics", icon: "🏛" },
  { id: "economy", label: "Economy", icon: "📊" },
  { id: "tech", label: "Technology", icon: "💻" },
  { id: "world", label: "World", icon: "🌍" },
  { id: "climate", label: "Climate", icon: "🌱" },
];

// ---- COMPONENTS ----

function WPLogo({ dark }) {
  return (
    <div style={{ fontFamily: "'Old Standard TT', serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em", color: dark ? "#fff" : "#1a1a1a", opacity: 0.9 }}>
      The Washington Post
    </div>
  );
}

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState(["top", "politics"]);

  const toggleTopic = (id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  if (step === 0) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0f0f14",
        display: "flex", flexDirection: "column", padding: "0 24px",
        fontFamily: "'DM Sans', sans-serif", animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ paddingTop: 60, flex: 1 }}>
          <WPLogo dark />
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Audio Briefings
            </div>
            <div style={{
              fontFamily: "'Old Standard TT', serif", fontSize: 32, fontWeight: 700,
              color: "#fff", lineHeight: 1.2, marginBottom: 12,
            }}>
              News that fits<br />how you think.
            </div>
            <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: 300 }}>
              Choose how you want to hear the news. We'll shape every briefing to match.
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.values(MODES).map((m, i) => (
              <div key={m.id} onClick={() => setSelectedMode(m.id)} style={{
                padding: "18px 20px", borderRadius: 14, cursor: "pointer",
                background: selectedMode === m.id ? m.colorMid : "rgba(255,255,255,0.04)",
                border: selectedMode === m.id ? `2px solid ${m.color}` : "2px solid rgba(255,255,255,0.06)",
                transition: "all 0.25s ease",
                animation: `fadeSlideUp 0.4s ease ${i * 0.08}s both`,
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ fontSize: 26, width: 40, textAlign: "center" }}>{m.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{m.tagline}</div>
                </div>
                {selectedMode === m.id && (
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 0 40px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginBottom: 12 }}>
            You can always switch modes later
          </div>
          <button onClick={() => selectedMode && setStep(1)} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: selectedMode ? MODES[selectedMode].color : "rgba(255,255,255,0.08)",
            color: selectedMode ? "#fff" : "rgba(255,255,255,0.25)",
            fontSize: 15, fontWeight: 700, cursor: selectedMode ? "pointer" : "default",
            transition: "all 0.3s ease",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0f0f14",
        display: "flex", flexDirection: "column", padding: "0 24px",
        fontFamily: "'DM Sans', sans-serif", animation: "fadeIn 0.4s ease",
      }}>
        <div style={{ paddingTop: 60, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Step 2 of 2
          </div>
          <div style={{
            fontFamily: "'Old Standard TT', serif", fontSize: 28, fontWeight: 700,
            color: "#fff", lineHeight: 1.2, marginBottom: 8,
          }}>
            Pick your topics.
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 32 }}>
            We'll prioritize these in your <span style={{ color: MODES[selectedMode].color, fontWeight: 600 }}>{MODES[selectedMode].label}</span> briefings.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TOPICS.map((t, i) => (
              <div key={t.id} onClick={() => toggleTopic(t.id)} style={{
                padding: "20px 16px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                background: selectedTopics.includes(t.id) ? MODES[selectedMode].colorMid : "rgba(255,255,255,0.04)",
                border: selectedTopics.includes(t.id) ? `2px solid ${MODES[selectedMode].color}` : "2px solid rgba(255,255,255,0.06)",
                transition: "all 0.25s ease",
                animation: `fadeSlideUp 0.4s ease ${i * 0.06}s both`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 0 40px" }}>
          <button onClick={() => onComplete(selectedMode, selectedTopics)} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: MODES[selectedMode].color, color: "#fff",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Build My Briefing →
          </button>
        </div>
      </div>
    );
  }
}

function HomeScreen({ primaryMode, onSelectMode, onPlay, onShowNotes }) {
  const m = MODES[primaryMode];
  return (
    <div style={{ animation: "fadeIn 0.3s ease", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <WPLogo dark={false} />
        <div onClick={onShowNotes} style={{
          width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, cursor: "pointer",
        }}>ℹ</div>
      </div>

      {/* Hero card for primary mode */}
      <div style={{ padding: "8px 20px 20px" }}>
        <div style={{
          background: m.gradient, borderRadius: 20, padding: "32px 24px",
          position: "relative", overflow: "hidden",
          animation: "fadeSlideUp 0.5s ease",
        }}>
          <div style={{
            position: "absolute", top: 14, right: 16, fontSize: 10, fontWeight: 700,
            color: m.color, background: "rgba(255,255,255,0.1)", borderRadius: 20,
            padding: "3px 10px", letterSpacing: "0.06em", textTransform: "uppercase",
            backdropFilter: "blur(8px)",
          }}>YOUR MODE</div>

          <div style={{ fontSize: 38, marginBottom: 14 }}>{m.emoji}</div>
          <div style={{
            fontFamily: "'Old Standard TT', serif", fontSize: 26, fontWeight: 700,
            color: "#fff", marginBottom: 6,
          }}>{m.label}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginBottom: 6 }}>{m.description}</div>
          <div style={{ fontSize: 11, color: m.color, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 20 }}>{m.tone}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div onClick={() => onPlay(primaryMode)} style={{
              background: m.color, borderRadius: 14, padding: "14px 28px",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: `0 4px 20px ${m.color}44`,
            }}>
              ▶ Play · {m.duration}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {m.stories.length} stories · Today
            </div>
          </div>
        </div>
      </div>

      {/* Stories preview */}
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Today's {m.label} Briefing
        </div>
        {m.stories.slice(0, 3).map((s, i) => (
          <div key={i} onClick={() => onPlay(primaryMode)} style={{
            padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,0.06)",
            cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
            animation: `fadeSlideUp 0.4s ease ${i * 0.08}s both`,
          }}>
            <div style={{ flexShrink: 0, marginTop: 3 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: s.fresh ? m.color : "rgba(0,0,0,0.12)",
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: "0.06em" }}>{s.tag}</span>
                {s.fresh && <span style={{ fontSize: 8, background: m.colorSoft, color: m.color, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>NEW</span>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4, fontFamily: "'Old Standard TT', serif" }}>{s.title}</div>
            </div>
            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", flexShrink: 0, marginTop: 14 }}>{s.dur}</span>
          </div>
        ))}
        <div onClick={() => onPlay(primaryMode)} style={{
          fontSize: 13, color: m.color, fontWeight: 600, cursor: "pointer",
          marginTop: 12, display: "flex", alignItems: "center", gap: 4,
        }}>
          See all {m.stories.length} stories →
        </div>
      </div>

      {/* Other modes */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
          Try a different lens
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
          {Object.values(MODES).filter((x) => x.id !== primaryMode).map((mode, i) => (
            <div key={mode.id} onClick={() => onSelectMode(mode.id)} style={{
              minWidth: 150, padding: "18px 16px", borderRadius: 14, cursor: "pointer",
              background: mode.colorSoft, border: `1.5px solid ${mode.color}22`,
              flexShrink: 0, transition: "all 0.2s ease",
              animation: `fadeSlideUp 0.4s ease ${i * 0.08 + 0.2}s both`,
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{mode.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{mode.label}</div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", lineHeight: 1.4 }}>{mode.tagline}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Same news, different lens comparison */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
          Same story, five lenses
        </div>
        <div style={{
          background: "#f5f3ef", borderRadius: 16, padding: "20px 18px",
          animation: "fadeSlideUp 0.5s ease 0.3s both",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14, fontFamily: "'Old Standard TT', serif" }}>
            The Senate Spending Bill
          </div>
          {Object.values(MODES).map((mode) => {
            const angles = {
              update: "Senate passes emergency spending bill, 52-48",
              explain: "What's in the bill and how we got here",
              perspective: "A win — but for whom? Two views inside.",
              inspire: "The freshman senator who brokered the impossible deal",
              help: "What changes for your wallet starting Monday",
            };
            return (
              <div key={mode.id} onClick={() => onPlay(mode.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                borderBottom: `1px solid rgba(0,0,0,0.05)`, cursor: "pointer",
              }}>
                <div style={{ fontSize: 18, width: 28 }}>{mode.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: mode.color, letterSpacing: "0.04em", marginBottom: 2 }}>{mode.label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 1.4 }}>{angles[mode.id]}</div>
                </div>
                <div style={{ color: mode.color, fontSize: 14, cursor: "pointer" }}>▶</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayerScreen({ mode, onBack, isPlaying, onToggle, activeStory, setActiveStory }) {
  const m = MODES[mode];
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.003)), 50);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  return (
    <div style={{ background: m.gradient, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={onBack} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18 }}>‹</span> Back
        </div>
        <WPLogo dark />
        <div style={{ width: 50 }} />
      </div>

      {/* Hero */}
      <div style={{ padding: "20px 24px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>{m.emoji}</div>
        <div style={{ fontFamily: "'Old Standard TT', serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{m.label}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{m.tagline}</div>
        <div style={{ fontSize: 11, color: m.color, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{m.tone}</div>
      </div>

      {/* Player */}
      <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 8, overflow: "hidden" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: m.color, borderRadius: 2, transition: "width 0.05s linear" }} />
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
          <span>{Math.floor(progress * 15)}:{String(Math.floor((progress * 15 * 60) % 60)).padStart(2, "0")}</span>
          <span>{m.duration.split("–")[1] || m.duration}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>−15s</div>
          <div onClick={onToggle} style={{
            width: 64, height: 64, borderRadius: "50%", background: m.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: "#fff", cursor: "pointer",
            boxShadow: `0 4px 20px ${m.color}55`,
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isPlaying ? "❚❚" : "▶"}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>+30s</div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {["1.0×", "Transcript", "Share"].map((l) => (
            <div key={l} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px 10px", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Story list */}
      <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "24px 24px 0 0", padding: "24px 20px 60px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
          In this briefing
        </div>
        {m.stories.map((s, i) => (
          <div key={i} onClick={() => setActiveStory(i)} style={{
            padding: "14px 16px", borderRadius: 12, marginBottom: 6, cursor: "pointer",
            background: activeStory === i ? m.colorMid : "transparent",
            borderLeft: activeStory === i ? `3px solid ${m.color}` : "3px solid transparent",
            transition: "all 0.2s ease",
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              {activeStory === i && isPlaying ? (
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 14 }}>
                  {[8, 14, 10, 12].map((h, j) => (
                    <div key={j} style={{ width: 2.5, background: m.color, borderRadius: 1, animation: `barBounce 0.6s ease ${j * 0.1}s infinite alternate`, height: h }} />
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 600, width: 16, textAlign: "center" }}>{i + 1}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: m.color, letterSpacing: "0.06em" }}>{s.tag}</span>
                {s.fresh && <span style={{ fontSize: 8, background: m.colorMid, color: m.color, padding: "1px 5px", borderRadius: 3, fontWeight: 700 }}>NEW</span>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.4, fontFamily: "'Old Standard TT', serif" }}>{s.title}</div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", flexShrink: 0, marginTop: 14 }}>{s.dur}</div>
          </div>
        ))}
      </div>
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
        <h3 style={{ fontFamily: "'Old Standard TT', serif", fontSize: 20, marginBottom: 16, color: "#1a1a1a" }}>User-Needs Audio Framework</h3>

        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>
          Inspired by the BBC user-needs model, adapted for audio consumption. Each mode repackages the same editorial output with different framing, depth, and pacing.
        </div>

        {Object.values(MODES).map((m) => (
          <div key={m.id} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: m.color, fontSize: 14, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{m.emoji} {m.label}</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6, paddingLeft: 12, fontFamily: "'DM Sans', sans-serif" }}>{m.description}</div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid #eee", paddingTop: 16, marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#1a1a1a" }}>Key Insight</div>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            Same stories, different packaging. One editorial pipeline produces scripts that are reframed per mode. AI/ML selects the best story-mode combinations. User picks their primary mode at onboarding but can switch freely — building a habit loop around their preferred consumption style.
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 16, marginTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#1a1a1a" }}>Same Story, Five Lenses</div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
            <strong style={{ color: "#2563eb" }}>Update:</strong> "Senate passes bill, 52-48"<br/>
            <strong style={{ color: "#0d9488" }}>Explain:</strong> "What's in it and how we got here"<br/>
            <strong style={{ color: "#9333ea" }}>Perspective:</strong> "A win — but for whom?"<br/>
            <strong style={{ color: "#e0447a" }}>Inspire:</strong> "The senator who brokered the impossible deal"<br/>
            <strong style={{ color: "#dc6b20" }}>Help:</strong> "What changes for your wallet"
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- MAIN APP ----

export default function WPUserNeedsAudio() {
  const [phase, setPhase] = useState("onboarding");
  const [primaryMode, setPrimaryMode] = useState("update");
  const [screen, setScreen] = useState("home");
  const [activeMode, setActiveMode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const completeOnboarding = (mode) => {
    setPrimaryMode(mode);
    setPhase("app");
  };

  const playMode = (mode) => {
    setActiveMode(mode);
    setScreen("player");
    setIsPlaying(true);
    setActiveStory(0);
  };

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh",
      background: phase === "onboarding" ? "#0f0f14" : "#faf9f6",
      position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes barBounce { from { height: 4px; } to { height: 14px; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #e8e5e0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {phase === "onboarding" && (
        <OnboardingScreen onComplete={completeOnboarding} />
      )}

      {phase === "app" && screen === "home" && (
        <HomeScreen
          primaryMode={primaryMode}
          onSelectMode={(m) => { setPrimaryMode(m); }}
          onPlay={playMode}
          onShowNotes={() => setShowNotes(true)}
        />
      )}

      {phase === "app" && screen === "player" && activeMode && (
        <PlayerScreen
          mode={activeMode}
          onBack={() => setScreen("home")}
          isPlaying={isPlaying}
          onToggle={() => setIsPlaying(!isPlaying)}
          activeStory={activeStory}
          setActiveStory={setActiveStory}
        />
      )}

      {showNotes && <ConceptNotes onClose={() => setShowNotes(false)} />}
    </div>
  );
}
