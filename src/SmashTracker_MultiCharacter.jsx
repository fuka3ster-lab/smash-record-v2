
import React, { useEffect, useState } from "react";

const CHARACTERS = ["ルキナ", "リンク", "クラウド", "マルス"];

export default function MultiCharacterVIPTracker() {
  const [character, setCharacter] = useState("ルキナ");

  const storageKey = (name) => `${character}-${name}`;

  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [memo, setMemo] = useState("");
  const [gspInput, setGspInput] = useState(0);
  const [startGspInput, setStartGspInput] = useState(0);
  const [history, setHistory] = useState([]);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [vipBorderInput, setVipBorderInput] = useState(1420);

  useEffect(() => {
    setWins(Number(localStorage.getItem(storageKey("wins"))) || 0);
    setLosses(Number(localStorage.getItem(storageKey("losses"))) || 0);
    setMemo(localStorage.getItem(storageKey("memo")) || "");
    setGspInput(Number(localStorage.getItem(storageKey("gsp"))) || 0);
    setStartGspInput(Number(localStorage.getItem(storageKey("startGsp"))) || 0);
    setHistory(JSON.parse(localStorage.getItem(storageKey("history")) || "[]"));
    setDailyRecords(JSON.parse(localStorage.getItem(storageKey("dailyRecords")) || "[]"));
    setVipBorderInput(Number(localStorage.getItem(storageKey("vipBorder"))) || 1420);
  }, [character]);

  useEffect(() => localStorage.setItem(storageKey("wins"), wins), [wins, character]);
  useEffect(() => localStorage.setItem(storageKey("losses"), losses), [losses, character]);
  useEffect(() => localStorage.setItem(storageKey("memo"), memo), [memo, character]);
  useEffect(() => localStorage.setItem(storageKey("gsp"), gspInput), [gspInput, character]);
  useEffect(() => localStorage.setItem(storageKey("startGsp"), startGspInput), [startGspInput, character]);
  useEffect(() => localStorage.setItem(storageKey("history"), JSON.stringify(history)), [history, character]);
  useEffect(() => localStorage.setItem(storageKey("dailyRecords"), JSON.stringify(dailyRecords)), [dailyRecords, character]);
  useEffect(() => localStorage.setItem(storageKey("vipBorder"), vipBorderInput), [vipBorderInput, character]);

  const totalGames = wins + losses;
  const winRate = totalGames ? Math.round((wins / totalGames) * 100) : 0;

  const addWin = () => {
    setWins(v => v + 1);
    setHistory(v => ["W", ...v].slice(0, 50));
  };

  const addLoss = () => {
    setLosses(v => v + 1);
    setHistory(v => ["L", ...v].slice(0, 50));
  };

  const finishToday = () => {
    setDailyRecords(v => [
      {
        date: new Date().toLocaleDateString("ja-JP"),
        startGsp: startGspInput,
        endGsp: gspInput,
        wins,
        losses,
        winRate,
        memo,
      },
      ...v,
    ]);

    setStartGspInput(gspInput);
    setWins(0);
    setLosses(0);
    setHistory([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>スマブラ戦績管理</h1>

      <select value={character} onChange={(e) => setCharacter(e.target.value)}>
        {CHARACTERS.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <h2>{character}</h2>

      <p>勝利: {wins}</p>
      <p>敗北: {losses}</p>
      <p>総試合数: {totalGames}</p>
      <p>勝率: {winRate}%</p>

      <button onClick={addWin}>勝利+</button>
      <button onClick={addLoss}>敗北-</button>

      <hr />

      <p>開始GSP</p>
      <input value={startGspInput} onChange={(e)=>setStartGspInput(Number(e.target.value))} />

      <p>現在GSP</p>
      <input value={gspInput} onChange={(e)=>setGspInput(Number(e.target.value))} />

      <p>VIPボーダー</p>
      <input value={vipBorderInput} onChange={(e)=>setVipBorderInput(Number(e.target.value))} />

      <hr />

      <textarea
        rows="8"
        style={{width:"100%"}}
        value={memo}
        onChange={(e)=>setMemo(e.target.value)}
      />

      <button onClick={finishToday}>今日を終了</button>

      <h3>日誌</h3>
      {dailyRecords.map((r,i)=>(
        <div key={i}>
          {r.date} {r.wins}勝{r.losses}敗
        </div>
      ))}
    </div>
  );
}
