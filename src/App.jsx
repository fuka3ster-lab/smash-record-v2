import React, { useEffect, useState } from "react";

export default function LucinaVIPTracker() {
  const [wins, setWins] = useState(() => {
    const saved = localStorage.getItem("lucina-wins");
    return saved ? Number(saved) : 0;
  });
  const [losses, setLosses] = useState(() => {
    const saved = localStorage.getItem("lucina-losses");
    return saved ? Number(saved) : 0;
  });
  const [memo, setMemo] = useState(() => {
    return localStorage.getItem("lucina-memo") || "";
  });
  const [gsp, setGsp] = useState(() => {
    const saved = localStorage.getItem("lucina-gsp");
    return saved ? Number(saved) : 8400000;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("lucina-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("lucina-wins", wins);
  }, [wins]);

  useEffect(() => {
    localStorage.setItem("lucina-losses", losses);
  }, [losses]);

  useEffect(() => {
    localStorage.setItem("lucina-memo", memo);
  }, [memo]);

  useEffect(() => {
    localStorage.setItem("lucina-gsp", gsp);
  }, [gsp]);

  useEffect(() => {
    localStorage.setItem("lucina-history", JSON.stringify(history));
  }, [history]);

  const [vipBorder, setVipBorder] = useState(() => {
    const saved = localStorage.getItem("lucina-vip-border");
    return saved ? Number(saved) : 14200000;
  });

  useEffect(() => {
    const fetchVipBorder = async () => {
      try {
        const response = await fetch(
          "https://elitegsp.com/api/ultimate"
        );

        if (!response.ok) return;

        const data = await response.json();

        if (data?.eliteGSP) {
          setVipBorder(Number(data.eliteGSP));
          localStorage.setItem(
            "lucina-vip-border",
            String(data.eliteGSP)
          );
        }
      } catch (error) {
        console.log("VIP取得失敗", error);
      }
    };

    fetchVipBorder();
  }, []);
  const diff = Math.max(0, vipBorder - gsp);

  const addWin = () => {
    setWins((prev) => prev + 1);
    setGsp((prev) => prev + 100000);
    setHistory((prev) => ["W", ...prev].slice(0, 20));
  };

  const addLoss = () => {
    setLosses((prev) => prev + 1);
    setGsp((prev) => Math.max(0, prev - 100000));
    setHistory((prev) => ["L", ...prev].slice(0, 20));
  };

  const resetSession = () => {
    setWins(0);
    setLosses(0);
    setMemo("");
    setHistory([]);
  };

  const totalGames = wins + losses;

  const currentStreak = (() => {
    if (history.length === 0) return 0;

    const first = history[0];
    let count = 0;

    for (const item of history) {
      if (item === first) {
        count++;
      } else {
        break;
      }
    }

    return first === "W" ? count : -count;
  })();
  const winRate =
    totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800">
            <h1 className="text-3xl font-bold mb-2">
              ⚔️ ルキナVIP管理
            </h1>
            <p className="text-zinc-400 leading-relaxed">
              「自分から崩れない」を意識するための簡易トラッカー
            </p>
          </div>

          {/* GSP Panel */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-sm text-zinc-400 mb-1">
                  現在戦闘力
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight">
                  {gsp.toLocaleString()}
                </div>
              </div>

              <div className="md:text-right">
                <div className="text-sm text-zinc-400 mb-1">
                  推定VIPボーダー
                </div>
                <div className="text-2xl font-semibold">
                  {vipBorder.toLocaleString()}
                </div>
                <div className="text-sm mt-2 text-zinc-400">
                  あと {diff.toLocaleString()} GSP
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <input
                type="range"
                min="0"
                max="20000000"
                step="10000"
                value={gsp}
                onChange={(e) => setGsp(Number(e.target.value))}
                className="w-full cursor-pointer"
              />

              <div className="text-xs text-zinc-500">
                スライダーで現在戦闘力を調整可能
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={addWin}
              className="h-32 rounded-3xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition text-4xl font-bold shadow-xl"
            >
              勝利 +
            </button>

            <button
              onClick={addLoss}
              className="h-32 rounded-3xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition text-4xl font-bold shadow-xl"
            >
              負け -
            </button>
          </div>

          {/* Stats */}
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">戦績</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800 rounded-2xl p-4 text-center">
                <div className="text-zinc-400 text-sm">勝利</div>
                <div className="text-4xl font-bold text-emerald-400">
                  {wins}
                </div>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-4 text-center">
                <div className="text-zinc-400 text-sm">敗北</div>
                <div className="text-4xl font-bold text-rose-400">
                  {losses}
                </div>
              </div>

              <div className="bg-zinc-800 rounded-2xl p-4 text-center col-span-2 md:col-span-1">
                <div className="text-zinc-400 text-sm">勝率</div>
                <div className="text-4xl font-bold text-sky-400">
                  {winRate}%
                </div>
              </div>
            </div>

            {losses >= 3 && (
              <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-300">
                ⚠ 3敗到達！ 一旦休憩して深呼吸 ⚔️
              </div>
            )}

            <div className="mt-5">
              <div className="text-sm text-zinc-400 mb-2">最近の戦績</div>

              <div className="flex flex-wrap gap-2">
                {history.length === 0 && (
                  <div className="text-zinc-500 text-sm">
                    まだ履歴なし
                  </div>
                )}

                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      item === "W"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-zinc-800 p-4 border border-zinc-700">
              <div className="text-lg font-semibold mb-3">
                📘 今日のまとめ
              </div>

              <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">
                <p>・総試合数：{totalGames}</p>
                <p>・勝利：{wins}</p>
                <p>・敗北：{losses}</p>
                <p>・勝率：{winRate}%</p>
                <p>
                  ・現在連勝/連敗：
                  {currentStreak > 0
                    ? `${currentStreak}連勝`
                    : currentStreak < 0
                    ? `${Math.abs(currentStreak)}連敗`
                    : "なし"}
                </p>
              </div>
            </div>

            <button
              onClick={resetSession}
              className="mt-5 px-4 py-3 rounded-2xl bg-zinc-700 hover:bg-zinc-600 transition font-medium"
            >
              セッションリセット
            </button>
          </div>
        </div>

        {/* Memo Panel */}
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">🦊 メモ</h2>

          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={
              "・焦って空前振りすぎた\n・中央維持を意識\n・差し返しを丁寧に"
            }
            className="flex-1 min-h-[500px] rounded-2xl bg-zinc-800 p-4 text-base resize-none outline-none border border-zinc-700 focus:border-zinc-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
