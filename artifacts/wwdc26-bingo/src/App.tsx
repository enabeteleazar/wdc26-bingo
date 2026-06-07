import { useState, useEffect } from "react";

const BINGO_CELLS = [
  {
    id: 0,
    label: "Next MacOS: MacOS Tiburon",
    bg: "from-blue-400 via-green-300 to-blue-600",
    emoji: "🏔️",
  },
  {
    id: 1,
    label: "Keynote Length: 105 Minutes (± 5)",
    bg: "from-gray-700 to-gray-900",
    emoji: "⏱️",
    monospace: true,
  },
  {
    id: 2,
    label: "A Wallpaper Creator Feature Announced",
    bg: "from-pink-500 via-purple-500 to-blue-500",
    emoji: "🎨",
  },
  {
    id: 3,
    label: "M5 Mac mini & Mac Studios Announced",
    bg: "from-gray-300 to-gray-500",
    emoji: "🖥️",
  },
  {
    id: 4,
    label: "Pick your AI Provider",
    bg: "from-indigo-600 via-purple-500 to-pink-400",
    emoji: "✨",
  },
  {
    id: 5,
    label: "Apple Debuts an AirPods App",
    bg: "from-white to-gray-200",
    dark: false,
    emoji: "🎧",
  },
  {
    id: 6,
    label: "Stephen Lemay Appears on Video",
    bg: "from-gray-400 to-gray-600",
    emoji: "🎬",
  },
  {
    id: 7,
    label: "OS 27 Features Updated Genmoji Creation",
    bg: "from-yellow-300 via-orange-300 to-pink-400",
    emoji: "😊",
  },
  {
    id: 8,
    label: "Apple Intelligence Shortcut Integration",
    bg: "from-purple-700 to-indigo-800",
    emoji: "🔮",
  },
  {
    id: 9,
    label: "Lil' Finder Guy Makes an Appearance",
    bg: "from-blue-500 to-purple-600",
    emoji: "🗂️",
  },
  {
    id: 10,
    label: "Apple Intelligence Health Integration",
    bg: "from-pink-400 via-red-400 to-orange-400",
    emoji: "❤️",
  },
  {
    id: 11,
    label: "A Memeable Federighi Moment",
    bg: "from-gray-500 to-gray-700",
    emoji: "😎",
  },
  {
    id: 12,
    label: '"Good Morning"\nFree Space',
    bg: "from-orange-500 via-pink-500 to-purple-600",
    emoji: "⭐",
    freeSpace: true,
  },
  {
    id: 13,
    label: "Customizable Camera in iOS 27",
    bg: "from-gray-800 to-gray-900",
    emoji: "📷",
  },
  {
    id: 14,
    label: "A Siri Chat App is Announced",
    bg: "from-gray-900 to-gray-800",
    emoji: "💬",
  },
  {
    id: 15,
    label: "Apple Previews homeOS + Hardware",
    bg: "from-gray-300 via-blue-100 to-gray-400",
    dark: false,
    emoji: "🏠",
  },
  {
    id: 16,
    label: "Daily Brief Feature",
    bg: "from-white via-gray-100 to-blue-50",
    dark: false,
    emoji: "📋",
  },
  {
    id: 17,
    label: "A Secret Location is Accessed via Whimsical Transition",
    bg: "from-gray-400 via-gray-300 to-gray-500",
    emoji: "🌀",
  },
  {
    id: 18,
    label: "Liquid Glass Polish",
    bg: "from-cyan-400 via-pink-400 to-yellow-400",
    emoji: "💎",
  },
  {
    id: 19,
    label: "Apple Debuts a Gemini-Powered Siri",
    bg: "from-indigo-500 via-purple-600 to-violet-700",
    emoji: "🤖",
  },
  {
    id: 20,
    label: "More AI Editing Tools Come to Camera/Photos",
    bg: "from-gray-100 to-gray-200",
    dark: false,
    emoji: "📸",
  },
  {
    id: 21,
    label: "John Ternus Appears During the Event",
    bg: "from-gray-500 to-gray-700",
    emoji: "👨‍💼",
  },
  {
    id: 22,
    label: "More Native Apple Vision Pro Apps",
    bg: "from-red-500 via-purple-500 to-blue-500",
    emoji: "📱",
  },
  {
    id: 23,
    label: "macOS/iOS 27 Emphasize Stability & Battery Life",
    bg: "from-purple-600 via-pink-500 to-orange-400",
    emoji: "🔋",
  },
  {
    id: 24,
    label: "Tim Cook Says GoodBye",
    bg: "from-purple-900 via-pink-800 to-gray-900",
    emoji: "👋",
  },
];

const WINNING_LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function checkBingo(checked: Set<number>): number[][] {
  return WINNING_LINES.filter((line) => line.every((idx) => checked.has(idx)));
}

export default function App() {
  const [checked, setChecked] = useState<Set<number>>(new Set([12]));
  const [newBingoLines, setNewBingoLines] = useState<number[][]>([]);
  const [showBannerFor, setShowBannerFor] = useState<number[][]>([]);
  const [prevBingos, setPrevBingos] = useState<number>(0);

  const bingoLines = checkBingo(checked);
  const winningCells = new Set(bingoLines.flat());

  useEffect(() => {
    const count = bingoLines.length;
    if (count > prevBingos) {
      const newLines = bingoLines.slice(prevBingos);
      setNewBingoLines(newLines);
      setShowBannerFor(newLines);
      const timeout = setTimeout(() => setShowBannerFor([]), 3000);
      setPrevBingos(count);
      return () => clearTimeout(timeout);
    }
  }, [bingoLines.length]);

  const toggle = (id: number) => {
    if (id === 12) return;
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const reset = () => {
    setChecked(new Set([12]));
    setPrevBingos(0);
    setNewBingoLines([]);
    setShowBannerFor([]);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a14 60%, #000 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      {showBannerFor.length > 0 && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          style={{ animation: "fadeInOut 3s forwards" }}
        >
          <div
            className="text-center px-12 py-8 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,200,0,0.95), rgba(255,120,0,0.95))",
              boxShadow: "0 0 80px rgba(255,180,0,0.6), 0 20px 60px rgba(0,0,0,0.5)",
              animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            <div className="text-8xl font-black text-white tracking-tight" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              BINGO!
            </div>
            <div className="text-white text-xl font-semibold mt-2 opacity-90">
              {showBannerFor.length > 1 ? `${showBannerFor.length} lignes complétées !` : "Ligne complétée !"}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          15% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0.3) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.4); }
          50% { box-shadow: 0 0 35px rgba(255, 215, 0, 0.9); }
        }
        .bingo-cell {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: pointer;
        }
        .bingo-cell:hover:not(.free-space) {
          transform: scale(1.04);
          box-shadow: 0 8px 25px rgba(0,0,0,0.5);
        }
        .bingo-cell:active:not(.free-space) {
          transform: scale(0.97);
        }
        .winning-glow {
          animation: pulseGlow 1.5s ease-in-out infinite;
          border: 2px solid rgba(255, 215, 0, 0.8) !important;
        }
      `}</style>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-1">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              🍎
            </div>
            <h1
              className="text-6xl font-black tracking-tight text-white"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a0c4ff 50%, #c3a6ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WWDC26
            </h1>
          </div>
          <p
            className="text-2xl font-bold tracking-[0.3em] uppercase"
            style={{
              background: "linear-gradient(90deg, #a0c4ff, #c3a6ff, #ffd6a5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BINGO
          </p>
        </div>

        {bingoLines.length > 0 && (
          <div className="text-center mb-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-black"
              style={{
                background: "linear-gradient(90deg, #ffd700, #ff8c00)",
                boxShadow: "0 0 20px rgba(255,200,0,0.5)",
              }}
            >
              🏆 {bingoLines.length} BINGO{bingoLines.length > 1 ? "S" : ""} !
            </span>
          </div>
        )}

        <div
          className="grid grid-cols-5 gap-1.5 p-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          {BINGO_CELLS.map((cell) => {
            const isChecked = checked.has(cell.id);
            const isWinning = winningCells.has(cell.id);
            const isFreeSpace = cell.freeSpace;

            return (
              <div
                key={cell.id}
                onClick={() => toggle(cell.id)}
                className={`bingo-cell relative rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center ${isFreeSpace ? "free-space" : ""} ${isWinning ? "winning-glow" : ""}`}
                style={{
                  border: isWinning
                    ? "2px solid rgba(255,215,0,0.8)"
                    : "1px solid rgba(255,255,255,0.12)",
                  cursor: isFreeSpace ? "default" : "pointer",
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cell.bg}`}
                  style={{ opacity: isChecked ? 1 : 0.85 }}
                />

                {!isChecked && !isFreeSpace && (
                  <div
                    className="absolute inset-0"
                    style={{ background: "rgba(0,0,0,0.35)" }}
                  />
                )}

                {isChecked && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.25)", zIndex: 5 }}
                  >
                    <div
                      style={{
                        animation: "checkmark 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                        fontSize: "clamp(28px, 5vw, 42px)",
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
                      }}
                    >
                      ✅
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col items-center gap-1 p-1.5 text-center">
                  {isFreeSpace && (
                    <div className="text-xs font-black text-yellow-300 uppercase tracking-widest leading-none mb-0.5">
                      One Last
                    </div>
                  )}
                  <p
                    className="leading-tight font-semibold"
                    style={{
                      fontSize: "clamp(7px, 1.4vw, 11px)",
                      color: cell.dark === false ? "#1a1a2e" : "white",
                      textShadow:
                        cell.dark === false
                          ? "none"
                          : "0 1px 4px rgba(0,0,0,0.8)",
                      whiteSpace: cell.monospace ? "pre" : undefined,
                      fontFamily: cell.monospace ? "monospace" : undefined,
                    }}
                  >
                    {cell.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-3 mx-auto rounded-xl py-2 px-4 text-center"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            <span className="font-bold text-yellow-300">Instant BINGO:</span>{" "}
            Apple Increases base iCloud Storage from 5GB
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {checked.size - 1} case{checked.size - 1 !== 1 ? "s" : ""} cochée{checked.size - 1 !== 1 ? "s" : ""}
          </p>
          <button
            onClick={reset}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
