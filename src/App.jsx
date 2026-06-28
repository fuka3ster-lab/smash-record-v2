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

const normalizeCharacter = (character) => ({
  ...createCharacter(character?.name || "名無し"),
  ...character,
  wins: Number(character?.wins || 0),
  losses: Number(character?.losses || 0),
  sessionWins: Number(character?.sessionWins || 0),
  sessionLosses: Number(character?.sessionLosses || 0),
  history: Array.isArray(character?.history) ? character.history : [],
  diary: Array.isArray(character?.diary) ? character.diary : [],
});

const safeLoadCharacters = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [createCharacter("ルキナ")];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createCharacter("ルキナ")];
    }

    return parsed.map(normalizeCharacter);
  } catch {
    return [createCharacter("ルキナ")];
  }
};

export default function App() {
  const [characters, setCharacters] = useState(safeLoadCharacters);
  const [activeId, setActiveId] = useState(() => {
    const loaded = safeLoadCharacters();
    return loaded[0]?.id;
  });
  const [newName, setNewName] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const active = characters.find((c) => c.id === activeId) || characters[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    if (!active && characters.length > 0) {
      setActiveId(characters[0].id);
    }
  }, [active, characters]);

  const updateCharacterById = (characterId, updater) => {
    setCharacters((prev) =>
      prev.map((character) =>
        character.id === characterId ? updater(normalizeCharacter(character)) : character
      )
    );
  };

  const updateActiveCharacter = (updater) => {
    if (!active?.id) return;
    updateCharacterById(active.id, updater);
  };

  const addMatch = (result) => {
    if (!active?.id) return;

    updateCharacterById(active.id, (character) => {
      const history = [result, ...character.history].slice(0, 20);

      return {
        ...character,
        wins: result === "W" ? character.wins + 1 : character.wins,
        losses: result === "L" ? character.losses + 1 : character.losses,
        sessionWins:
          result === "W" ? character.sessionWins + 1 : character.sessionWins,
        sessionLosses:
          result === "L" ? character.sessionLosses + 1 : character.sessionLosses,
        history,
      };
    });
  };

  const total = (active?.wins || 0) + (active?.losses || 0);
  const winRate = total ? ((active.wins / total) * 100).toFixed(1) : "0.0";

  const sessionTotal = (active?.sessionWins || 0) + (active?.sessionLosses || 0);
  const sessionWinRate = sessionTotal
    ? (((active?.sessionWins || 0) / sessionTotal) * 100).toFixed(1)
    : "0.0";

  const streak = useMemo(() => {
    if (!active?.history?.length) return "なし";

    const first = active.history[0];
    let count = 0;

    for (const result of active.history) {
      if (result === first) count++;
      else break;
    }

    return `${count}${first === "W" ? "連勝" : "連敗"}`;
  }, [active]);

  const endToday = () => {
    if (!active?.id) return;

    updateCharacterById(active.id, (character) => {
      const currentSessionTotal = character.sessionWins + character.sessionLosses;
      const currentSessionWinRate = currentSessionTotal
        ? ((character.sessionWins / currentSessionTotal) * 100).toFixed(1)
        : "0.0";

      return {
        ...character,
        diary: [
          {
            id: Date.now().toString() + Math.random(),
            date: new Date().toLocaleString(),
            startGsp: character.startGsp,
            endGsp: character.currentGsp,
            wins: character.sessionWins,
            losses: character.sessionLosses,
            rate: currentSessionWinRate,
            memo: character.memo,
          },
          ...character.diary,
        ],
        startGsp: character.currentGsp,
        sessionWins: 0,
        sessionLosses: 0,
      };
    });
  };

  const resetSession = () => {
    if (!active?.id) return;

    updateCharacterById(active.id, (character) => ({
      ...character,
      sessionWins: 0,
      sessionLosses: 0,
    }));
  };

  const addCharacter = () => {
    const name = newName.trim();
    if (!name) return;

    const character = createCharacter(name);
    setCharacters((prev) => [...prev, character]);
    setActiveId(character.id);
    setNewName("");
  };

  if (!active) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-white">
          読み込み中...
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">スマブラ戦績管理 v2</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                キャラ別に戦績・GSP・日誌を保存
              </p>
            </div>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="rounded bg-blue-600 px-3 py-2 text-white"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {characters.map((character) => (
              <button
                key={character.id}
                onClick={() => setActiveId(character.id)}
                className={`rounded px-3 py-2 ${
                  character.id === active.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {character.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addCharacter();
              }}
              placeholder="新キャラ名"
              className="min-w-0 flex-1 rounded border p-2 text-black"
            />
            <button
              onClick={addCharacter}
              className="rounded bg-green-600 px-4 text-white"
            >
              追加
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded bg-white p-4 shadow-sm dark:bg-gray-800">
              <h2 className="mb-2 font-bold">{active.name}</h2>

              <div>累計勝利: {active.wins}</div>
              <div>累計敗北: {active.losses}</div>
              <div>累計勝率: {winRate}%</div>
              <div>連勝/連敗: {streak}</div>

              <div className="mt-3 rounded bg-yellow-100 p-3 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200">
                <div className="font-bold">現在セッション</div>
                <div>
                  {active.sessionWins}勝 {active.sessionLosses}敗
                </div>
                <div>勝率: {sessionWinRate}%</div>
              </div>
            </div>

            <div className="rounded bg-white p-4 shadow-sm dark:bg-gray-800">
              <input
                value={active.startGsp}
                onChange={(event) =>
                  updateActiveCharacter((character) => ({
                    ...character,
                    startGsp: event.target.value,
                  }))
                }
                placeholder="開始GSP"
                className="mb-2 w-full rounded p-2 text-black"
              />

              <input
                value={active.currentGsp}
                onChange={(event) =>
                  updateActiveCharacter((character) => ({
                    ...character,
                    currentGsp: event.target.value,
                  }))
                }
                placeholder="現在GSP"
                className="mb-2 w-full rounded p-2 text-black"
              />

              <input
                value={active.vipBorder}
                onChange={(event) =>
                  updateActiveCharacter((character) => ({
                    ...character,
                    vipBorder: event.target.value,
                  }))
                }
                placeholder="VIPボーダー"
                className="w-full rounded p-2 text-black"
              />
            </div>

            <div className="flex flex-col gap-2 rounded bg-white p-4 shadow-sm dark:bg-gray-800">
              <button
                onClick={() => addMatch("W")}
                className="rounded bg-green-600 p-2 text-white"
              >
                勝利＋
              </button>

              <button
                onClick={() => addMatch("L")}
                className="rounded bg-red-600 p-2 text-white"
              >
                敗北－
              </button>

              <button
                onClick={endToday}
                className="rounded bg-blue-600 p-2 text-white"
              >
                今日を終了
              </button>

              <button
                onClick={resetSession}
                className="rounded bg-gray-600 p-2 text-white"
              >
                セッションリセット
              </button>
            </div>
          </div>

          <div className="rounded bg-white p-4 shadow-sm dark:bg-gray-800">
            <h2 className="mb-2 font-bold">メモ</h2>
            <textarea
              value={active.memo}
              onChange={(event) =>
                updateActiveCharacter((character) => ({
                  ...character,
                  memo: event.target.value,
                }))
              }
              className="h-32 w-full rounded p-2 text-black"
              placeholder="今日の反省、意識すること、苦手キャラなど"
            />
          </div>

          <div className="rounded bg-white p-4 shadow-sm dark:bg-gray-800">
            <h2 className="mb-2 font-bold">最近20戦</h2>

            {active.history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                まだ対戦履歴がありません。
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {active.history.map((result, index) => (
                  <span
                    key={`${result}-${index}`}
                    className={`rounded px-2 py-1 text-white ${
                      result === "W" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded bg-white p-4 shadow-sm dark:bg-gray-800">
            <h2 className="mb-2 font-bold">対戦日誌</h2>

            {active.diary.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                まだ日誌がありません。
              </p>
            ) : (
              <div className="space-y-2">
                {active.diary.map((diary) => (
                  <div
                    key={diary.id || diary.date}
                    className="rounded border border-gray-300 p-3 dark:border-gray-700"
                  >
                    <div className="font-bold">{diary.date}</div>
                    <div>
                      GSP {diary.startGsp || "未入力"} →{" "}
                      {diary.endGsp || "未入力"}
                    </div>
                    <div>
                      {diary.wins}勝 {diary.losses}敗 ({diary.rate}%)
                    </div>
                    {diary.memo && (
                      <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                        {diary.memo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
