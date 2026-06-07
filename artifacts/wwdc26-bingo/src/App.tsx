import { useState, useEffect, useRef, useCallback } from "react";
import bingoSrc from "@assets/image_1780852856694.png";

// Image natural size: 1514 x 1834
// We let the user fine-tune via a debug overlay if needed.
const IMG_W = 1514;
const IMG_H = 1834;

// Approximate pixel coordinates (top-left corner of each cell in the original image)
// Header: ~21% of height = ~385px
// 5 rows × (264px cell + 8px gap) = 1360px
// Side padding: ~38px, 5 cols × (280px cell + 8px gap) = 1432px
const COL_X = [38, 326, 614, 902, 1190] as const;   // left edge of each column
const ROW_Y = [383, 655, 927, 1199, 1471] as const;  // top edge of each row
const CELL_W = 280;  // cell width in original pixels
const CELL_H = 264;  // cell height in original pixels

// Shared image element (loaded once)
let sharedImg: HTMLImageElement | null = null;
const imgListeners: (() => void)[] = [];

function loadSharedImage(src: string) {
  if (sharedImg) return;
  sharedImg = new Image();
  sharedImg.onload = () => imgListeners.forEach(fn => fn());
  sharedImg.src = src;
}

function useBingoImage() {
  const [ready, setReady] = useState(sharedImg?.complete ?? false);
  useEffect(() => {
    if (sharedImg?.complete) { setReady(true); return; }
    const cb = () => setReady(true);
    imgListeners.push(cb);
    loadSharedImage(bingoSrc);
    return () => { const i = imgListeners.indexOf(cb); if (i >= 0) imgListeners.splice(i, 1); };
  }, []);
  return ready ? sharedImg : null;
}

// Trim N px from all sides of each crop so rounded-corner borders don't bleed in
const CROP_INSET = 5;

// Canvas cell that draws the exact crop from the original bingo image
function CellCanvas({ col, row }: { col: number; row: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const img = useBingoImage();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const sx = COL_X[col as 0|1|2|3|4] + CROP_INSET;
    const sy = ROW_Y[row as 0|1|2|3|4] + CROP_INSET;
    const sw = CELL_W - CROP_INSET * 2;
    const sh = CELL_H - CROP_INSET * 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  }, [img, col, row]);

  useEffect(() => { draw(); }, [draw]);

  // Redraw when canvas mounts or resizes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      draw();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

const BINGO_CELLS = [
  { id: 0,  label: "Next MacOS:\nMacOS Tiburon" },
  { id: 1,  label: "Keynote Length:\n105 Minutes (± 5)" },
  { id: 2,  label: "A Wallpaper Creator\nFeature Announced" },
  { id: 3,  label: "M5 Mac mini &\nMac Studios Announced" },
  { id: 4,  label: "Pick your\nAI Provider" },
  { id: 5,  label: "Apple Debuts an\nAirPods App" },
  { id: 6,  label: "Stephen Lemay\nAppears on Video" },
  { id: 7,  label: "OS 27 Features\nUpdated Genmoji Creation" },
  { id: 8,  label: "Apple Intelligence\nShortcut Integration" },
  { id: 9,  label: "Lil' Finder Guy\nMakes an Appearance" },
  { id: 10, label: "Apple Intelligence\nHealth Integration" },
  { id: 11, label: "A Memeable\nFederighi Moment" },
  { id: 12, label: '"Good Morning"\nFree Space', freeSpace: true },
  { id: 13, label: "Customizable\nCamera in iOS 27" },
  { id: 14, label: "A Siri Chat App\nis Announced" },
  { id: 15, label: "Apple Previews\nhomeOS + Hardware" },
  { id: 16, label: "Daily Brief\nFeature" },
  { id: 17, label: "A Secret Location is\nAccessed via\nWhimsical Transition" },
  { id: 18, label: "Liquid Glass\nPolish" },
  { id: 19, label: "Apple Debuts a\nGemini-Powered Siri" },
  { id: 20, label: "More AI Editing Tools\nCome to Camera/Photos" },
  { id: 21, label: "John Ternus Appears\nDuring the Event" },
  { id: 22, label: "More Native Apple\nVision Pro Apps" },
  { id: 23, label: "macOS/iOS 27\nEmphasize Stability\n& Battery Life" },
  { id: 24, label: "Tim Cook\nSays GoodBye" },
];

const WINNING_LINES = [
  [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
  [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
  [0,6,12,18,24],[4,8,12,16,20],
];

function checkBingo(checked: Set<number>) {
  return WINNING_LINES.filter(line => line.every(i => checked.has(i)));
}

export default function App() {
  const [checked, setChecked] = useState<Set<number>>(new Set([12]));
  const [showBanner, setShowBanner] = useState(false);
  const [prevBingoCount, setPrevBingoCount] = useState(0);

  const bingoLines = checkBingo(checked);
  const winningCells = new Set(bingoLines.flat());

  useEffect(() => {
    if (bingoLines.length > prevBingoCount) {
      setShowBanner(true);
      setPrevBingoCount(bingoLines.length);
      const t = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(t);
    }
  }, [bingoLines.length]);

  const toggle = (id: number) => {
    if (id === 12) return;
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const reset = () => {
    setChecked(new Set([12]));
    setPrevBingoCount(0);
    setShowBanner(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-3"
      style={{
        background: "radial-gradient(ellipse at top, #1c1c2e 0%, #0a0a14 60%, #000 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: scale(0.7) rotate(-4deg); }
          15%  { opacity: 1; transform: scale(1.05) rotate(1deg); }
          25%  { transform: scale(1) rotate(0deg); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: scale(0.9); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.25) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes winPulse {
          0%,100% { box-shadow: 0 0 10px 2px rgba(255,215,0,0.5); }
          50%      { box-shadow: 0 0 28px 6px rgba(255,215,0,0.9); }
        }
        .bingo-cell {
          cursor: pointer;
          transition: transform 0.13s ease;
        }
        .bingo-cell:hover { transform: scale(1.05); }
        .bingo-cell:active { transform: scale(0.96); }
        .free-cell { cursor: default !important; }
        .free-cell:hover { transform: none !important; }
        .win-cell { animation: winPulse 1.6s ease-in-out infinite; border: 2px solid rgba(255,215,0,0.85) !important; }
      `}</style>

      {showBanner && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          style={{ animation: "fadeInOut 3s forwards" }}
        >
          <div
            className="px-14 py-8 rounded-3xl text-center"
            style={{
              background: "linear-gradient(135deg, #ffd700 0%, #ff6b00 100%)",
              boxShadow: "0 0 80px rgba(255,180,0,0.7), 0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div className="text-8xl font-black text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              BINGO !
            </div>
            <div className="text-white text-xl font-semibold mt-1 opacity-90">
              {bingoLines.length > 1 ? `${bingoLines.length} lignes complètes !` : "Ligne complète !"}
            </div>
          </div>
        </div>
      )}

      <div className="w-full" style={{ maxWidth: 640 }}>
        <div className="text-center mb-4 select-none">
          <div className="flex items-center justify-center gap-3 mb-0.5">
            <span className="text-3xl">🍎</span>
            <h1
              className="text-5xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a8c8ff 50%, #d0aaff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WWDC26
            </h1>
          </div>
          <p
            className="text-xl font-bold tracking-[0.35em] uppercase"
            style={{
              background: "linear-gradient(90deg, #a8c8ff, #d0aaff, #ffd6a5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BINGO
          </p>
        </div>

        {bingoLines.length > 0 && (
          <div className="text-center mb-3">
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
          className="grid grid-cols-5 gap-1.5 p-2 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {BINGO_CELLS.map(cell => {
            const col = cell.id % 5;
            const row = Math.floor(cell.id / 5);
            const isChecked = checked.has(cell.id);
            const isWinning = winningCells.has(cell.id);
            const isFree = cell.freeSpace;

            return (
              <div
                key={cell.id}
                onClick={() => toggle(cell.id)}
                className={`bingo-cell relative rounded-xl overflow-hidden ${isFree ? "free-cell" : ""} ${isWinning ? "win-cell" : ""}`}
                style={{
                  aspectRatio: `${CELL_W}/${CELL_H}`,
                  border: isWinning
                    ? "2px solid rgba(255,215,0,0.85)"
                    : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <CellCanvas col={col} row={row} />

                {/* Dim unchecked cells */}
                {!isFree && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isChecked ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.22)",
                      transition: "background 0.2s ease",
                      zIndex: 2,
                    }}
                  />
                )}

                {/* Checkmark */}
                {isChecked && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ zIndex: 10 }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(24px, 4.2vw, 38px)",
                        animation: "checkPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
                      }}
                    >
                      ✅
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        <div
          className="mt-2.5 rounded-xl py-1.5 px-4 text-center"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
            <span className="font-bold text-yellow-300">Instant BINGO :</span>{" "}
            Apple Increases base iCloud Storage from 5GB
          </p>
        </div>

        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-xs select-none" style={{ color: "rgba(255,255,255,0.35)" }}>
            {checked.size - 1} case{checked.size - 1 !== 1 ? "s" : ""} cochée{checked.size - 1 !== 1 ? "s" : ""}
          </p>
          <button
            onClick={reset}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.13)",
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
