import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "smash-record-v2";

const createCharacter = (name) => ({
  id: Date.now().toString() + Math.random(),
  name,
  wins: 0,
  losses: 0,
  memo: "",
  currentGsp: "",
  startGsp: "",
  vipBorder: "",
  history: [],
  diary: [],
  sessionWins: 0,
  sessionLosses: 0,
});

export default function App() {
  const [characters, setCharacters] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [createCharacter("ルキナ")];
  });

  const [activeId, setActiveId] = useState(characters[0]?.id);
  const [newName, setNewName] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const active = characters.find((c) => c.id === activeId) || characters[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  const updateCharacter = (updater) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === active.id ? updater(c) : c))
    );
  };

  const addMatch = (result) => {
    updateCharacter((c) => {
      const history = [result, ...c.history].slice(0, 20);
      return {
        ...c,
        wins: result === "W" ? c.wins + 1 : c.wins,
        losses: result === "L" ? c.losses + 1 : c.losses,
        sessionWins: result === "W" ? c.sessionWins + 1 : c.sessionWins,
        sessionLosses: result === "L" ? c.sessionLosses + 1 : c.sessionLosses,
        history,
      };
    });
  };

  const total = (active?.wins || 0) + (active?.losses || 0);
  const winRate = total ? ((active.wins / total) * 100).toFixed(1) : "0.0";

  const streak = useMemo(() => {
    if (!active?.history?.length) return "なし";
    const first = active.history[0];
    let count = 0;
    for (const h of active.history) {
      if (h === first) count++;
      else break;
    }
    return `${count}${first === "W" ? "連勝" : "連敗"}`;
  }, [active]);

  const endToday = () => {
    updateCharacter((c) => ({
      ...c,
      diary: [
        {
          date: new Date().toLocaleString(),
          startGsp: c.startGsp,
          endGsp: c.currentGsp,
          wins: c.sessionWins,
          losses: c.sessionLosses,
          rate:
            c.sessionWins + c.sessionLosses > 0
              ? (
                  (c.sessionWins / (c.sessionWins + c.sessionLosses)) *
                  100
                ).toFixed(1)
              : "0.0",
          memo: c.memo,
        },
        ...c.diary,
      ],
      sessionWins: 0,
      sessionLosses: 0,
    }));
  };

  const resetSession = () => {
    updateCharacter((c) => ({
      ...c,
      sessionWins: 0,
      sessionLosses: 0,
    }));
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">スマブラ戦績管理 v2</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 rounded bg-blue-600 text-white"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {characters.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`px-3 py-2 rounded ${
                  c.id === activeId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="新キャラ名"
              className="border rounded p-2 text-black flex-1"
            />
            <button
              onClick={() => {
                if (!newName.trim()) return;
                const ch = createCharacter(newName);
                setCharacters((p) => [...p, ch]);
                setActiveId(ch.id);
                setNewName("");
              }}
              className="bg-green-600 text-white px-4 rounded"
            >
              追加
            </button>
          </div>

          {active && (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded bg-white dark:bg-gray-800">
                  <div>勝利: {active.wins}</div>
                  <div>敗北: {active.losses}</div>
                  <div>勝率: {winRate}%</div>
                  <div>{streak}</div>
                </div>

                <div className="p-4 rounded bg-white dark:bg-gray-800">
                  <input
                    value={active.startGsp}
                    onChange={(e) =>
                      updateCharacter((c) => ({ ...c, startGsp: e.target.value }))
                    }
                    placeholder="開始GSP"
                    className="w-full p-2 rounded text-black mb-2"
                  />
                  <input
                    value={active.currentGsp}
                    onChange={(e) =>
                      updateCharacter((c) => ({ ...c, currentGsp: e.target.value }))
                    }
                    placeholder="現在GSP"
                    className="w-full p-2 rounded text-black mb-2"
                  />
                  <input
                    value={active.vipBorder}
                    onChange={(e) =>
                      updateCharacter((c) => ({ ...c, vipBorder: e.target.value }))
                    }
                    placeholder="VIPボーダー"
                    className="w-full p-2 rounded text-black"
                  />
                </div>

                <div className="p-4 rounded bg-white dark:bg-gray-800 flex flex-col gap-2">
                  <button onClick={() => addMatch("W")} className="bg-green-600 p-2 rounded text-white">
                    勝利＋
                  </button>
                  <button onClick={() => addMatch("L")} className="bg-red-600 p-2 rounded text-white">
                    敗北－
                  </button>
                  <button onClick={endToday} className="bg-blue-600 p-2 rounded text-white">
                    今日を終了
                  </button>
                  <button onClick={resetSession} className="bg-gray-600 p-2 rounded text-white">
                    セッションリセット
                  </button>
                </div>
              </div>

              <div className="p-4 rounded bg-white dark:bg-gray-800">
                <h2 className="font-bold mb-2">メモ</h2>
                <textarea
                  value={active.memo}
                  onChange={(e) =>
                    updateCharacter((c) => ({ ...c, memo: e.target.value }))
                  }
                  className="w-full h-32 p-2 rounded text-black"
                />
              </div>

              <div className="p-4 rounded bg-white dark:bg-gray-800">
                <h2 className="font-bold mb-2">最近20戦</h2>
                <div className="flex flex-wrap gap-2">
                  {active.history.map((h, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-white ${
                        h === "W" ? "bg-green-600" : "bg-red-600"
                      }`}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded bg-white dark:bg-gray-800">
                <h2 className="font-bold mb-2">対戦日誌</h2>
                <div className="space-y-2">
                  {active.diary.map((d, i) => (
                    <div key={i} className="border p-2 rounded">
                      <div>{d.date}</div>
                      <div>GSP {d.startGsp} → {d.endGsp}</div>
                      <div>{d.wins}勝 {d.losses}敗 ({d.rate}%)</div>
                      <div>{d.memo}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
