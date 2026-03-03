import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ───
const SAMPLE_ARTICLES = [
  { id: 1, title: "How the new tariff regime is reshaping global supply chains", topic: "Economy", type: "Explainer", time: "Today", dur: "3:20", readCount: 12400, region: "Global", person: null },
  { id: 2, title: "The fight over semiconductor exports enters a new phase", topic: "Economy", type: "Explainer", time: "Today", dur: "2:45", readCount: 9800, region: "Asia", person: null },
  { id: 3, title: "What the latest jobs report actually tells us", topic: "Economy", type: "Explainer", time: "Yesterday", dur: "2:10", readCount: 18200, region: "U.S.", person: null },
  { id: 4, title: "Inside the Senate's last-minute deal on the spending bill", topic: "Politics", type: "Give me perspective", time: "Today", dur: "4:15", readCount: 22100, region: "U.S.", person: "Sen. Murray" },
  { id: 5, title: "Why moderate Republicans are breaking with leadership", topic: "Politics", type: "Give me perspective", time: "Today", dur: "3:30", readCount: 15600, region: "U.S.", person: null },
  { id: 6, title: "The political calculus behind the new immigration order", topic: "Politics", type: "Give me perspective", time: "Yesterday", dur: "3:50", readCount: 28900, region: "U.S.", person: null },
  { id: 7, title: "CRISPR's next frontier: editing genes to fight climate change", topic: "Science", type: "Educate me", time: "This week", dur: "3:40", readCount: 41200, region: "Global", person: null },
  { id: 8, title: "The ocean current that could reshape Europe's weather", topic: "Science", type: "Educate me", time: "This week", dur: "2:55", readCount: 38700, region: "Europe", person: null },
  { id: 9, title: "Why physicists are excited about the new particle data", topic: "Science", type: "Educate me", time: "This week", dur: "2:20", readCount: 34100, region: "Global", person: null },
  { id: 10, title: "Ukraine's drone strategy is changing modern warfare", topic: "World", type: "Deep dive", time: "Today", dur: "5:10", readCount: 31500, region: "Europe", person: "Zelensky" },
  { id: 11, title: "A tech CEO's radical plan to reinvent the office", topic: "Technology", type: "Profile", time: "This week", dur: "4:00", readCount: 19300, region: "U.S.", person: null },
  { id: 12, title: "The hidden cost of AI-generated content on journalism", topic: "Technology", type: "Explainer", time: "Yesterday", dur: "3:15", readCount: 26800, region: "Global", person: null },
];

const VOICE_EXAMPLES = [
  `"Give me the latest three explainers in economy"`,
  `"The most read science articles this week"`,
  `"I have 10 minutes — surprise me"`,
  `"Latest perspective pieces in politics"`,
  `"Stories from Europe, today"`,
  `"What's trending in technology?"`,
];

const QUICK_FILTERS = [
  { label: "10 min brief", icon: "⏱", query: "10 minutes, top stories" },
  { label: "Economy explainers", icon: "📊", query: "latest explainers in economy" },
  { label: "Politics perspectives", icon: "🏛", query: "give me perspective, politics" },
  { label: "Science deep dives", icon: "🔬", query: "most read educate me, science" },
  { label: "World today", icon: "🌍", query: "stories from today, world" },
  { label: "Trending now", icon: "🔥", query: "most read articles today" },
];

const parseTimeToSeconds = (dur) => {
  const [m, s] = dur.split(":").map(Number);
  return m * 60 + s;
};

const formatSeconds = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ─── VOICE WAVE ANIMATION ───
function VoiceWave({ active, color = "#fff", bars = 24, height = 48 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2.5, height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 2.5, borderRadius: 2,
          background: color,
          opacity: active ? 0.8 : 0.15,
          height: active ? undefined : 4,
          animation: active ? `voiceBar 0.8s ease ${i * 0.04}s infinite alternate` : "none",
          transition: "opacity 0.3s ease",
        }} />
      ))}
    </div>
  );
}

// ─── VOICE LISTENING OVERLAY ───
function VoiceListening({ onResult, onCancel }) {
  const [phase, setPhase] = useState("listening"); // listening | processing
  const [dots, setDots] = useState("");

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase("processing");
      setTimeout(() => onResult(), 1200);
    }, 2800);
    return () => clearTimeout(t);
  }, [onResult]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(8,8,16,0.95)", backdropFilter: "blur(30px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.25s ease",
    }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: phase === "listening"
            ? "radial-gradient(circle, rgba(200,80,60,0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(80,160,200,0.25) 0%, transparent 70%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: phase === "listening" ? "pulse 1.5s ease infinite" : "none",
          transition: "background 0.5s ease",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: phase === "listening"
              ? "linear-gradient(135deg, #c85040, #e87060)"
              : "linear-gradient(135deg, #4090b0, #60b8d8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
            boxShadow: phase === "listening"
              ? "0 0 40px rgba(200,80,60,0.35)"
              : "0 0 40px rgba(80,160,200,0.35)",
            transition: "all 0.5s ease",
          }}>
            {phase === "listening" ? "🎙" : "⚡"}
          </div>
        </div>
      </div>

      <VoiceWave active={phase === "listening"} color={phase === "listening" ? "#e87060" : "#60b8d8"} />

      <div style={{
        marginTop: 28, fontFamily: "'Libre Baskerville', serif",
        fontSize: 18, color: "#fff", textAlign: "center",
      }}>
        {phase === "listening" ? "Listening" + dots : "Building your brief" + dots}
      </div>
      <div style={{
        marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.4)",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {phase === "listening" ? "Say what you'd like to hear" : "Selecting the best stories"}
      </div>

      <div onClick={onCancel} style={{
        marginTop: 40, fontSize: 13, color: "rgba(255,255,255,0.35)",
        cursor: "pointer", padding: "8px 20px", borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "'Outfit', sans-serif",
      }}>Cancel</div>
    </div>
  );
}

// ─── POST-ARTICLE ACTIONS SHEET ───
function ArticleActions({ article, onClose, onAction }) {
  const actions = [
    { id: "full_audio", icon: "🎧", label: "Listen to full article", sub: "~8 min unabridged audio" },
    { id: "email", icon: "✉️", label: "Send article to my email", sub: "Read the full written piece later" },
    { id: "share", icon: "↗", label: "Share this story", sub: "Send to a friend or colleague" },
    { id: "more_like", icon: "✨", label: "More stories like this", sub: "Get similar recommendations" },
    { id: "skip", icon: "⏭", label: "Skip to next story", sub: null },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "linear-gradient(180deg, #1e1e2a 0%, #151520 100%)",
        borderRadius: "24px 24px 0 0", padding: "24px 20px 36px",
        maxWidth: 420, width: "100%",
        animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "none",
      }}>
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 2, margin: "0 auto 18px" }} />
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 15, color: "#fff",
          marginBottom: 4, lineHeight: 1.4,
        }}>{article.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>
          {article.topic} · {article.type} · {article.dur}
        </div>

        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
          fontFamily: "'Outfit', sans-serif",
        }}>
          🎙 Say a command or tap an option
        </div>

        {actions.map((a) => (
          <div key={a.id} onClick={() => onAction(a.id)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 16px", borderRadius: 14, cursor: "pointer",
            transition: "background 0.15s ease", marginBottom: 2,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>{a.icon}</div>
            <div>
              <div style={{ fontSize: 14, color: "#fff", fontWeight: 500, fontFamily: "'Outfit', sans-serif" }}>{a.label}</div>
              {a.sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, fontFamily: "'Outfit', sans-serif" }}>{a.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EMAIL GATE MODAL ───
function EmailGate({ onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 250,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "linear-gradient(180deg, #1e1e2a, #13131d)",
        borderRadius: 20, padding: "32px 24px", maxWidth: 360, width: "90%",
        border: "1px solid rgba(255,255,255,0.08)",
        animation: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
          <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, color: "#fff", marginBottom: 6 }}>
            Get the full article
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>
            We'll send it straight to your inbox. Sign in or enter your email to continue.
          </div>
        </div>
        <div style={{ position: "relative", marginBottom: 14 }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff", fontSize: 15, outline: "none",
              fontFamily: "'Outfit', sans-serif",
            }}
          />
        </div>
        <div onClick={() => onSubmit(email)} style={{
          width: "100%", padding: "14px", borderRadius: 12, textAlign: "center",
          background: "linear-gradient(135deg, #c85040, #d06050)",
          color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
        }}>Send article</div>
        <div style={{
          textAlign: "center", marginTop: 14, fontSize: 12,
          color: "rgba(255,255,255,0.3)", fontFamily: "'Outfit', sans-serif",
        }}>
          Already a subscriber? <span style={{ color: "#e87060", cursor: "pointer" }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

// ─── RECOMMENDATION SHEET ───
function RecommendationSheet({ currentArticle, onSelect, onClose }) {
  const recs = SAMPLE_ARTICLES
    .filter(a => a.id !== currentArticle.id && (a.topic === currentArticle.topic || a.type === currentArticle.type))
    .slice(0, 3);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "linear-gradient(180deg, #1e1e2a 0%, #151520 100%)",
        borderRadius: "24px 24px 0 0", padding: "24px 20px 36px",
        maxWidth: 420, width: "100%", animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        border: "1px solid rgba(255,255,255,0.06)", borderBottom: "none",
      }}>
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 2, margin: "0 auto 18px" }} />
        <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Outfit', sans-serif" }}>
          ✨ More like "{currentArticle.topic} · {currentArticle.type}"
        </div>
        {recs.map((a) => (
          <div key={a.id} onClick={() => onSelect(a)} style={{
            display: "flex", gap: 14, padding: "14px 12px", borderRadius: 14,
            cursor: "pointer", marginBottom: 2, transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, flexShrink: 0,
              fontFamily: "'Outfit', sans-serif",
            }}>{a.dur}</div>
            <div>
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 500, lineHeight: 1.4, fontFamily: "'Libre Baskerville', serif" }}>{a.title}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3, fontFamily: "'Outfit', sans-serif" }}>{a.type} · {a.topic} · {a.readCount.toLocaleString()} reads</div>
            </div>
          </div>
        ))}
        <div onClick={onClose} style={{
          textAlign: "center", padding: "12px", marginTop: 8,
          fontSize: 13, color: "rgba(255,255,255,0.4)", cursor: "pointer",
          fontFamily: "'Outfit', sans-serif",
        }}>Continue listening</div>
      </div>
    </div>
  );
}

// ─── PLAYER SCREEN ───
function PlayerScreen({ articles, query, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showRecs, setShowRecs] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const intervalRef = useRef(null);

  const article = articles[currentIdx];
  const totalDur = articles.reduce((s, a) => s + parseTimeToSeconds(a.dur), 0);
  const elapsed = articles.slice(0, currentIdx).reduce((s, a) => s + parseTimeToSeconds(a.dur), 0)
    + progress * parseTimeToSeconds(article.dur);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 1) {
            if (currentIdx < articles.length - 1) {
              setCurrentIdx(i => i + 1);
              return 0;
            }
            setIsPlaying(false);
            setShowActions(true);
            return 1;
          }
          return p + 0.004;
        });
      }, 50);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentIdx, articles.length]);

  useEffect(() => {
    setProgress(0);
  }, [currentIdx]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleAction = (id) => {
    setShowActions(false);
    if (id === "full_audio") showToast("🎧 Full article queued");
    else if (id === "email") setShowEmail(true);
    else if (id === "share") showToast("↗ Share link copied");
    else if (id === "more_like") setShowRecs(true);
    else if (id === "skip" && currentIdx < articles.length - 1) {
      setCurrentIdx(i => i + 1);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{
      background: "linear-gradient(180deg, #0c0c14 0%, #12121e 50%, #0a0a12 100%)",
      minHeight: "100vh", fontFamily: "'Outfit', sans-serif",
      animation: "fadeIn 0.35s ease",
    }}>
      {/* Top bar */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onBack} style={{
          cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 18 }}>‹</span> Back
        </div>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: 13,
          color: "rgba(255,255,255,0.7)", letterSpacing: "0.02em",
        }}>Your Brief</div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "1.5px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, cursor: "pointer",
        }}>🎙</div>
      </div>

      {/* Query display */}
      <div style={{ padding: "8px 24px 6px", textAlign: "center" }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 20,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
          fontSize: 12, color: "rgba(255,255,255,0.4)", fontStyle: "italic",
        }}>"{query}"</div>
      </div>

      {/* Now playing */}
      <div style={{ padding: "28px 24px 20px", textAlign: "center" }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "#c85040",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
        }}>{article.type} · {article.topic}</div>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
          color: "#fff", lineHeight: 1.4, marginBottom: 12,
          maxWidth: 340, margin: "0 auto 12px",
        }}>{article.title}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          Story {currentIdx + 1} of {articles.length} · {article.dur}
        </div>
      </div>

      {/* Waveform */}
      <div style={{ padding: "12px 24px 20px" }}>
        <VoiceWave active={isPlaying} color="#c85040" bars={40} height={40} />
      </div>

      {/* Progress */}
      <div style={{ padding: "0 24px" }}>
        {/* Story progress */}
        <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
          {articles.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2, overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
            }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: i < currentIdx ? "#c85040" : i === currentIdx ? "#c85040" : "transparent",
                width: i < currentIdx ? "100%" : i === currentIdx ? `${progress * 100}%` : "0%",
                transition: i === currentIdx ? "width 0.05s linear" : "none",
              }} />
            </div>
          ))}
        </div>
        {/* Full brief progress */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 28 }}>
          <span>{formatSeconds(Math.floor(elapsed))}</span>
          <span>{formatSeconds(totalDur)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28, padding: "0 24px 16px" }}>
        <div onClick={() => { if (currentIdx > 0) { setCurrentIdx(i => i - 1); setProgress(0); } }}
          style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
          ⏮
        </div>
        <div onClick={() => setIsPlaying(!isPlaying)} style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg, #c85040, #d06858)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 24px rgba(200,80,64,0.35)",
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.93)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </div>
        <div onClick={() => { if (currentIdx < articles.length - 1) { setCurrentIdx(i => i + 1); setProgress(0); } }}
          style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
          ⏭
        </div>
      </div>

      {/* Voice & speed controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, padding: "4px 24px 24px" }}>
        {["1.0×", "🎙 Voice cmd", "Transcript"].map((l) => (
          <div key={l} style={{
            fontSize: 11, color: "rgba(255,255,255,0.35)", cursor: "pointer",
            padding: "6px 14px", borderRadius: 20,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>{l}</div>
        ))}
      </div>

      {/* Article actions trigger */}
      <div style={{ padding: "0 24px 12px", textAlign: "center" }}>
        <div onClick={() => { setIsPlaying(false); setShowActions(true); }} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 20px", borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        >
          <span style={{ fontSize: 14 }}>⚡</span>
          Article options · or say "full article" / "email me this" / "share"
        </div>
      </div>

      {/* Upcoming stories */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        borderRadius: "24px 24px 0 0",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "22px 20px 100px", marginTop: 12,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
        }}>Your brief · {articles.length} stories</div>
        {articles.map((a, i) => (
          <div key={a.id} onClick={() => { setCurrentIdx(i); setProgress(0); setIsPlaying(true); }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 12, marginBottom: 3,
              cursor: "pointer",
              background: i === currentIdx ? "rgba(200,80,64,0.1)" : "transparent",
              borderLeft: i === currentIdx ? "3px solid #c85040" : "3px solid transparent",
              transition: "all 0.2s ease",
            }}>
            <div style={{ flexShrink: 0, width: 20, textAlign: "center" }}>
              {i === currentIdx && isPlaying ? (
                <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 12, justifyContent: "center" }}>
                  {[6, 12, 8, 10].map((h, j) => (
                    <div key={j} style={{
                      width: 2, background: "#c85040", borderRadius: 1,
                      animation: `voiceBar 0.6s ease ${j * 0.1}s infinite alternate`,
                    }} />
                  ))}
                </div>
              ) : (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: i < currentIdx ? "rgba(255,255,255,0.15)" : i === currentIdx ? "#c85040" : "rgba(255,255,255,0.25)",
                }}>{i + 1}</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, color: i === currentIdx ? "#c85040" : "rgba(255,255,255,0.25)",
                fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 2,
              }}>{a.type} · {a.topic}</div>
              <div style={{
                fontSize: 13, color: i < currentIdx ? "rgba(255,255,255,0.3)" : "#fff",
                fontWeight: 500, lineHeight: 1.35,
                textDecoration: i < currentIdx ? "line-through" : "none",
                textDecorationColor: "rgba(255,255,255,0.15)",
                fontFamily: "'Libre Baskerville', serif",
              }}>{a.title}</div>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>{a.dur}</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showActions && <ArticleActions article={article} onClose={() => setShowActions(false)} onAction={handleAction} />}
      {showEmail && <EmailGate onClose={() => setShowEmail(false)} onSubmit={(e) => { setShowEmail(false); setEmailSent(true); showToast("✉️ Article sent to " + (e || "your email")); }} />}
      {showRecs && <RecommendationSheet currentArticle={article} onSelect={(a) => { setShowRecs(false); showToast("✨ Added to your brief"); }} onClose={() => setShowRecs(false)} />}

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          background: "rgba(30,30,42,0.95)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14, padding: "12px 22px", fontSize: 13, color: "#fff",
          zIndex: 500, animation: "fadeIn 0.2s ease",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          fontFamily: "'Outfit', sans-serif",
        }}>{toastMsg}</div>
      )}
    </div>
  );
}

// ─── HOME SCREEN ───
function HomeScreen({ onStartVoice, onQuickFilter }) {
  const [exampleIdx, setExampleIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setExampleIdx(i => (i + 1) % VOICE_EXAMPLES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      background: "linear-gradient(180deg, #0c0c14 0%, #12121e 100%)",
      minHeight: "100vh", fontFamily: "'Outfit', sans-serif",
      animation: "fadeIn 0.3s ease",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: 14,
          color: "rgba(255,255,255,0.8)", letterSpacing: "0.02em",
        }}>The Washington Post</div>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, cursor: "pointer",
        }}>👤</div>
      </div>

      {/* Hero */}
      <div style={{ padding: "44px 24px 24px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 30, fontWeight: 700,
          color: "#fff", lineHeight: 1.2, marginBottom: 10,
        }}>
          Your Audio Brief
        </div>
        <div style={{
          fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.6,
          maxWidth: 300, margin: "0 auto",
        }}>
          Tell us what you want to hear. We'll build it for you in seconds.
        </div>
      </div>

      {/* Big mic button */}
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0 16px" }}>
        <div onClick={onStartVoice} style={{
          width: 110, height: 110, borderRadius: "50%",
          background: "radial-gradient(circle at 40% 40%, #d06050, #b04438)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          boxShadow: "0 0 60px rgba(200,80,64,0.25), 0 4px 20px rgba(200,80,64,0.3)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 80px rgba(200,80,64,0.35), 0 4px 30px rgba(200,80,64,0.4)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(200,80,64,0.25), 0 4px 20px rgba(200,80,64,0.3)"; }}
        >
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1px solid rgba(200,80,64,0.15)", animation: "pulse 2s ease infinite" }} />
          <div style={{ position: "absolute", inset: -24, borderRadius: "50%", border: "1px solid rgba(200,80,64,0.08)", animation: "pulse 2s ease 0.5s infinite" }} />
          <span style={{ fontSize: 40 }}>🎙</span>
        </div>
      </div>

      {/* Rotating examples */}
      <div style={{ textAlign: "center", padding: "8px 24px 28px", minHeight: 48 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginBottom: 6 }}>Try saying:</div>
        <div key={exampleIdx} style={{
          fontSize: 14, color: "rgba(255,255,255,0.55)", fontStyle: "italic",
          animation: "fadeIn 0.4s ease",
          fontFamily: "'Libre Baskerville', serif",
        }}>{VOICE_EXAMPLES[exampleIdx]}</div>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 28px 20px" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>or choose a preset</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Quick filters grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
        padding: "0 20px 32px",
      }}>
        {QUICK_FILTERS.map((f, i) => (
          <div key={f.label} onClick={() => onQuickFilter(f)} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "18px 16px", cursor: "pointer",
            transition: "all 0.2s ease",
            animation: `fadeSlideUp 0.4s ease ${i * 0.06}s both`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{f.label}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>3–5 stories · voice-built</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{
        margin: "0 20px 32px", padding: "22px 20px",
        background: "rgba(255,255,255,0.02)", borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14,
        }}>How it works</div>
        {[
          { step: "1", text: "Tell us what you want — topic, time, type, or just how long you have" },
          { step: "2", text: "We select 3–5 article summaries tailored to your request" },
          { step: "3", text: "Listen hands-free. After each story, say \"full article\", \"share\", or \"next\"" },
        ].map((s) => (
          <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0,
              background: "rgba(200,80,64,0.12)", color: "#c85040",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
            }}>{s.step}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.text}</div>
          </div>
        ))}
      </div>

      {/* Concept notes */}
      <div style={{
        margin: "0 20px 32px", padding: "20px",
        background: "rgba(200,80,64,0.04)", borderRadius: 18,
        border: "1px solid rgba(200,80,64,0.1)",
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#c85040", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Concept: Hands-free voice control
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
          Every interaction is available by voice. After each summary, the listener can say:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {['"Listen to full article"', '"Email me this"', '"Share it"', '"More like this"', '"Next story"', '"Go back"', '"Pause"', '"Speed up"'].map((cmd) => (
            <span key={cmd} style={{
              fontSize: 11, padding: "5px 12px", borderRadius: 20,
              background: "rgba(200,80,64,0.08)", color: "#e87060",
              border: "1px solid rgba(200,80,64,0.15)",
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
            }}>{cmd}</span>
          ))}
        </div>
      </div>

      <div style={{ height: 60 }} />
    </div>
  );
}

// ─── MAIN APP ───
export default function WPAudioBrief() {
  const [screen, setScreen] = useState("home"); // home | listening | player
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [currentQuery, setCurrentQuery] = useState("");

  const buildBrief = useCallback((query) => {
    // Simulate AI/ML story selection based on query
    let filtered = [...SAMPLE_ARTICLES];
    const q = query.toLowerCase();
    if (q.includes("economy") || q.includes("economic")) filtered = filtered.filter(a => a.topic === "Economy");
    else if (q.includes("politic")) filtered = filtered.filter(a => a.topic === "Politics");
    else if (q.includes("science")) filtered = filtered.filter(a => a.topic === "Science");
    else if (q.includes("world") || q.includes("europe")) filtered = filtered.filter(a => a.topic === "World" || a.region === "Europe");
    else if (q.includes("tech")) filtered = filtered.filter(a => a.topic === "Technology");

    if (q.includes("explainer")) filtered = filtered.filter(a => a.type === "Explainer");
    else if (q.includes("perspective")) filtered = filtered.filter(a => a.type === "Give me perspective");
    else if (q.includes("educate")) filtered = filtered.filter(a => a.type === "Educate me");

    if (q.includes("most read") || q.includes("trending")) filtered.sort((a, b) => b.readCount - a.readCount);

    if (q.includes("10 min")) {
      let total = 0;
      const result = [];
      for (const a of filtered.sort((a, b) => b.readCount - a.readCount)) {
        if (total + parseTimeToSeconds(a.dur) <= 660) {
          result.push(a);
          total += parseTimeToSeconds(a.dur);
        }
        if (result.length >= 5) break;
      }
      filtered = result;
    }

    const result = filtered.slice(0, Math.min(5, Math.max(3, filtered.length)));
    if (result.length < 3) {
      const extras = SAMPLE_ARTICLES.filter(a => !result.includes(a)).slice(0, 3 - result.length);
      result.push(...extras);
    }
    return result;
  }, []);

  const handleVoiceResult = useCallback(() => {
    const q = currentQuery || "Top stories for you";
    setSelectedArticles(buildBrief(q));
    setScreen("player");
  }, [currentQuery, buildBrief]);

  const handleQuickFilter = (filter) => {
    setCurrentQuery(filter.query);
    setSelectedArticles(buildBrief(filter.query));
    setScreen("player");
  };

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.02); } }
        @keyframes voiceBar {
          0% { height: 3px; }
          50% { height: 18px; }
          100% { height: 8px; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0c14; }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {screen === "home" && (
        <HomeScreen
          onStartVoice={() => { setCurrentQuery("Latest three explainers in economy"); setScreen("listening"); }}
          onQuickFilter={handleQuickFilter}
        />
      )}

      {screen === "listening" && (
        <VoiceListening
          onResult={handleVoiceResult}
          onCancel={() => setScreen("home")}
        />
      )}

      {screen === "player" && selectedArticles.length > 0 && (
        <PlayerScreen
          articles={selectedArticles}
          query={currentQuery}
          onBack={() => setScreen("home")}
        />
      )}
    </div>
  );
}
