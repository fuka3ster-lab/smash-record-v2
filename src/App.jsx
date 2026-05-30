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

  const [gspInput, setGspInput] = useState(() => {
    const saved = localStorage.getItem("lucina-gsp-input");
    return saved ? Number(saved) : 840;
  });

  const [startGspInput, setStartGspInput] = useState(() => {
    const saved = localStorage.getItem("lucina-start-gsp-input");
    return saved ? Number(saved) : 840;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("lucina-history");
    return saved ? JSON.parse(saved) : [];
  });

  const [vipBorderInput, setVipBorderInput] = useState(() => {
    const saved = localStorage.getItem("lucina-vip-border-input");
    return saved ? Number(saved) : 1420;
  });

  const [dailyRecords, setDailyRecords] = useState(() => {
    const saved = localStorage.getItem("lucina-daily-records");
    return saved ? JSON.parse(saved) : [];
  });

  const gsp = gspInput * 10000;
  const vipBorder = vipBorderInput * 10000;
  const remainingToVip = Math.max(0, vipBorder - gsp);

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
    localStorage.setItem("lucina-gsp-input", gspInput);
  }, [gspInput]);

  useEffect(() => {
    localStorage.setItem("lucina-start-gsp-input", startGspInput);
  }, [startGspInput]);

  useEffect(() => {
    localStorage.setItem(
      "lucina-history",
      JSON.stringify(history)
    );
  }, [history]);

  useEffect(() => {
    localStorage.setItem(
      "lucina-vip-border-input",
      vipBorderInput
    );
  }, [vipBorderInput]);

  useEffect(() => {
    localStorage.setItem(
      "lucina-daily-records",
      JSON.stringify(dailyRecords)
    );
  }, [dailyRecords]);

  const addWin = () => {
    setWins((prev) => prev + 1);
    setHistory((prev) => ["W", ...prev].slice(0, 20));
  };

  const addLoss = () => {
    setLosses((prev) => prev + 1);
    setHistory((prev) => ["L", ...prev].slice(0, 20));
  };

  const resetSession = () => {
    setWins(0);
    setLosses(0);
    setMemo("");
    setHistory([]);
    setStartGspInput(gspInput);
  };

  const finishToday = () => {
  const record = {
    date: new Date().toLocaleDateString("ja-JP"),
    startGsp: startGspInput,
    endGsp: gspInput,
    wins,
    losses,
    winRate,
    memo,
  };

  setDailyRecords((prev) => [record, ...prev]);

  // 次回開始GSPへ引継ぎ
  setStartGspInput(gspInput);

  // 当日データリセット
  setWins(0);
  setLosses(0);
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
    totalGames > 0
      ? Math.round((wins / totalGames) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-3 md:p-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-3xl font-bold mb-2">
              ⚔️ ルキナVIP管理
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              「自分から崩れない」を意識するための簡易トラッカー
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                onClick={addWin}
                className="h-40 rounded-3xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition text-5xl font-bold shadow-xl touch-manipulation text-white"
              >
                勝利 +
              </button>

              <button
                onClick={addLoss}
                className="h-40 rounded-3xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition text-5xl font-bold shadow-xl touch-manipulation text-white"
              >
                負け -
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">戦績</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 text-center">
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">勝利</div>
                <div className="text-4xl font-bold text-emerald-500">{wins}</div>
              </div>

              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 text-center">
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">敗北</div>
                <div className="text-4xl font-bold text-rose-500">{losses}</div>
              </div>

              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-4 text-center col-span-2 md:col-span-1">
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">勝率</div>
                <div className="text-4xl font-bold text-sky-500">{winRate}%</div>
              </div>
            </div>

            {losses >= 3 && (
              <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-500">
                ⚠ 3敗到達！ 一旦休憩して深呼吸 ⚔️
              </div>
            )}

            <div className="mt-5">
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                最近の戦績
              </div>

              <div className="flex flex-wrap gap-2">
                {history.length === 0 && (
                  <div className="text-zinc-500 text-sm">まだ履歴なし</div>
                )}

                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      item === "W"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-rose-500/20 text-rose-500"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-6">
            <div className="rounded-3xl bg-zinc-100 dark:bg-zinc-800 p-6 border border-zinc-200 dark:border-zinc-700">
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 tracking-wide">
                現在戦闘力
              </div>

              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {gsp.toLocaleString()}
              </div>
            </div>

            <div className="rounded-3xl bg-zinc-100 dark:bg-zinc-800 p-6 border border-zinc-200 dark:border-zinc-700 space-y-4">
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                  VIPボーダー（下4桁省略）
                </div>

                <input
                  type="number"
                  value={vipBorderInput}
                  onChange={(e) => {
                    setVipBorderInput(Number(e.target.value));
                  }}
                  className="w-full md:w-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-4 py-3 outline-none text-lg font-semibold"
                />
              </div>

              <a
                href="https://elitegsp.com/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-500 underline break-all text-sm"
              >
                https://elitegsp.com/
              </a>

              <div className="text-2xl md:text-4xl font-bold text-amber-500 tracking-tight">
                VIPまであと {remainingToVip.toLocaleString()} GSP
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                  開始時GSP（下4桁省略）
                </div>

                <input
                  type="number"
                  value={startGspInput}
                  onChange={(e) => {
                    setStartGspInput(Number(e.target.value));
                  }}
                  className="w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                  終了時GSP（下4桁省略）
                </div>

                <input
                  type="number"
                  value={gspInput}
                  onChange={(e) => {
                    setGspInput(Number(e.target.value));
                  }}
                  className="w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-4 py-3 outline-none"
                />
              </div>
            </div>

            <div className="text-sm text-zinc-500">
              入力値 × 10,000 で計算されます
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">
              📝 メモ
            </h2>

            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={"・焦って空前振りすぎた\n・中央維持を意識\n・差し返しを丁寧に"}
              className="flex-1 min-h-[420px] rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-4 text-base resize-none outline-none border border-zinc-300 dark:border-zinc-700 leading-relaxed"
            />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="text-lg font-semibold mb-3">
              📘 今日のまとめ
            </div>

            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
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

          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="text-lg font-semibold mb-3">
              🗓 今日の履歴
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800">
              <div className="text-lg font-semibold mb-3">
                📚 対戦日誌
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dailyRecords.length === 0 && (
                  <div className="text-zinc-500">
                    まだ保存なし
                  </div>
                )}

                {dailyRecords.map((record, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-4"
                  >
                    <div className="font-bold mb-2">
                      {record.date}
                    </div>

                    <div className="text-sm">
                      {record.startGsp} →
                      {record.endGsp}
                    </div>

                    <div className="text-sm">
                      {record.wins}勝
                      {record.losses}敗
                      （勝率 {record.winRate}%）
                    </div>

                    {record.memo && (
                      <div className="mt-2 text-xs whitespace-pre-wrap text-zinc-500">
                        {record.memo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 max-h-48 overflow-y-auto">
              {history.length === 0 && (
                <div className="text-zinc-500">まだ履歴なし</div>
              )}

              {history.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2 flex items-center justify-between"
                >
                  <span>#{history.length - index}</span>

                  <span
                    className={
                      item === "W"
                        ? "text-emerald-500 font-bold"
                        : "text-rose-500 font-bold"
                    }
                  >
                    {item === "W" ? "勝利" : "敗北"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={finishToday}
            className="w-full px-4 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white transition font-medium"
          >
            📅 今日を終了する
          </button>

          <button
            onClick={resetSession}
            className="w-full px-4 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white transition font-medium"
          >
            セッションリセット
          </button>
        </div>
      </div>
    </div>
  );
}
