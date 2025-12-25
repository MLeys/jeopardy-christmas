import React, { useEffect, useMemo, useState } from "react";
import Board from "./components/Board.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import SetupModal from "./components/SetupModal.jsx";
import QuestionModal from "./components/QuestionModal.jsx";
import FinalJeopardyModal from "./components/FinalJeopardyModal.jsx";

import { BASE_VALUES, PACKS, PACK_ORDER, DEFAULT_PACK_ID, getPackOrDefault } from "./data/gameData.js";
import { keyFor, safeInt } from "./utils/helpers.js";
import { loadState, saveState, clearState } from "./utils/persistence.js";

export default function App() {
  var persisted = useMemo(function () {
    return loadState();
  }, []);

  var [activePackId, setActivePackId] = useState(function () {
    return persisted && persisted.activePackId ? persisted.activePackId : DEFAULT_PACK_ID;
  });

  var activePack = useMemo(function () {
    return getPackOrDefault(activePackId);
  }, [activePackId]);

  var GAME = activePack.game;
  var totalCount = GAME.categories.length * BASE_VALUES.length;

  var [teams, setTeams] = useState(function () {
    return persisted
      ? persisted.teams
      : [
          { name: "Team 1", score: 0 },
          { name: "Team 2", score: 0 }
        ];
  });

  var [used, setUsed] = useState(function () {
    return persisted ? persisted.used : {};
  });

  var [doubleRound, setDoubleRound] = useState(function () {
    return persisted ? persisted.doubleRound : false;
  });

  var [pickingDailyDouble, setPickingDailyDouble] = useState(false);

  var [dailyDoubleKey, setDailyDoubleKey] = useState(function () {
    return persisted ? persisted.dailyDoubleKey : null;
  });

  var [setupOpen, setSetupOpen] = useState(false);

  // Transient UI state (NOT persisted)
  var [questionOpen, setQuestionOpen] = useState(false);
  var [answerRevealed, setAnswerRevealed] = useState(false);
  var [currentClue, setCurrentClue] = useState(null);

  var [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  var [points, setPoints] = useState(100);

  var [finalOpen, setFinalOpen] = useState(false);
  var [finalAnswerRevealed, setFinalAnswerRevealed] = useState(false);
  var [finalWagers, setFinalWagers] = useState([0, 0]);
  var [finalCorrect, setFinalCorrect] = useState([false, false]);

  // TV convenience
  var [snowOn, setSnowOn] = useState(true);
  var [showPanel, setShowPanel] = useState(true);

  // Host menu
  var [menuOpen, setMenuOpen] = useState(false);

  var usedCount = useMemo(function () {
    var count = 0;
    for (var k in used) {
      if (Object.prototype.hasOwnProperty.call(used, k)) count += 1;
    }
    return count;
  }, [used]);

  function tileValue(rowIndex) {
    var base = BASE_VALUES[rowIndex];
    return doubleRound ? base * 2 : base;
  }

  useEffect(
    function () {
      saveState({
        version: 1,
        activePackId: activePackId,
        teams: teams,
        used: used,
        doubleRound: doubleRound,
        dailyDoubleKey: dailyDoubleKey
      });
    },
    [activePackId, teams, used, doubleRound, dailyDoubleKey]
  );

  function newGameKeepTeams() {
    setUsed({});
    setDoubleRound(false);
    setPickingDailyDouble(false);
    setDailyDoubleKey(null);

    setQuestionOpen(false);
    setAnswerRevealed(false);
    setCurrentClue(null);
    setFinalOpen(false);
    setFinalAnswerRevealed(false);
  }

  function resetBoardOnly() {
    setUsed({});
    setQuestionOpen(false);
    setAnswerRevealed(false);
    setCurrentClue(null);
  }

  function adjustScore(teamIdx, delta) {
    setTeams(function (prev) {
      return prev.map(function (t, idx) {
        if (idx !== teamIdx) return t;
        return { name: t.name, score: t.score + delta };
      });
    });
  }

  function openClue(cIndex, rIndex) {
    var k = keyFor(cIndex, rIndex);
    if (used[k] === true) return;

    setUsed(function (prev) {
      var next = Object.assign({}, prev);
      next[k] = true;
      return next;
    });

    var category = GAME.categories[cIndex];
    var clue = category.clues[rIndex];
    var value = tileValue(rIndex);
    var isDD = dailyDoubleKey === k;

    setCurrentClue({
      cIndex: cIndex,
      rIndex: rIndex,
      q: clue.q,
      a: clue.a,
      value: value,
      categoryName: category.name,
      isDailyDouble: isDD
    });

    setPoints(value);
    setAnswerRevealed(false);
    setSelectedTeamIndex(0);
    setQuestionOpen(true);
  }

  function scoreCurrent(multiplier) {
    if (!currentClue) return;

    var teamIdx = selectedTeamIndex;
    var pts = safeInt(points, currentClue.value);

    setTeams(function (prev) {
      return prev.map(function (t, idx) {
        if (idx !== teamIdx) return t;
        return { name: t.name, score: t.score + pts * multiplier };
      });
    });

    setQuestionOpen(false);
    setAnswerRevealed(false);
    setCurrentClue(null);
  }

  function startPickDailyDouble() {
    setPickingDailyDouble(true);
    window.alert("Click any unused tile to set it as the Daily Double.");
  }

  function pickDailyDouble(k) {
    setDailyDoubleKey(k);
    setPickingDailyDouble(false);
    window.alert("Daily Double set! Now play normally.");
  }

  function openFinal() {
    setFinalOpen(true);
    setFinalAnswerRevealed(false);

    setFinalWagers(function () {
      var arr = [];
      for (var i = 0; i < teams.length; i++) arr.push(0);
      return arr;
    });

    setFinalCorrect(function () {
      var arr = [];
      for (var i = 0; i < teams.length; i++) arr.push(false);
      return arr;
    });
  }

  function applyFinal() {
    setTeams(function (prev) {
      return prev.map(function (t, idx) {
        var w = safeInt(finalWagers[idx], 0);
        var correct = finalCorrect[idx] === true;
        var nextScore = correct ? t.score + w : t.score - w;
        return { name: t.name, score: nextScore };
      });
    });

    setFinalOpen(false);
    setFinalAnswerRevealed(false);
  }

  function renameTeam(idx, name) {
    setTeams(function (prev) {
      return prev.map(function (t, i) {
        if (i !== idx) return t;
        var nextName = name && name.trim() ? name.trim() : "Team " + String(i + 1);
        return { name: nextName, score: t.score };
      });
    });
  }

  function addTeam() {
    setTeams(function (prev) {
      if (prev.length >= 6) return prev;
      var next = prev.slice();
      next.push({ name: "Team " + String(prev.length + 1), score: 0 });
      return next;
    });
  }

  function removeTeam() {
    setTeams(function (prev) {
      if (prev.length <= 2) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }

  function resetScores() {
    setTeams(function (prev) {
      return prev.map(function (t) {
        return { name: t.name, score: 0 };
      });
    });
  }

  useEffect(
    function () {
      function onKeyDown(e) {
        if (!e) return;

        if (e.key === "Escape") {
          if (questionOpen) {
            setQuestionOpen(false);
            setAnswerRevealed(false);
            setCurrentClue(null);
          }
          if (setupOpen) setSetupOpen(false);
          if (finalOpen) {
            setFinalOpen(false);
            setFinalAnswerRevealed(false);
          }
          if (menuOpen) setMenuOpen(false);
        }

        if (e.key === "f" || e.key === "F") toggleFullscreen();
        if (e.key === "p" || e.key === "P") setShowPanel(function (v) { return !v; });
        if (e.key === "m" || e.key === "M") setMenuOpen(function (v) { return !v; });
      }

      document.addEventListener("keydown", onKeyDown);
      return function () {
        document.removeEventListener("keydown", onKeyDown);
      };
    },
    [questionOpen, setupOpen, finalOpen, menuOpen]
  );

  function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    } catch (_e) {}
  }

  function switchPack(nextId) {
    setActivePackId(nextId);

    // Reset board on pack switch
    setUsed({});
    setDoubleRound(false);
    setPickingDailyDouble(false);
    setDailyDoubleKey(null);

    setQuestionOpen(false);
    setAnswerRevealed(false);
    setCurrentClue(null);
    setFinalOpen(false);
    setFinalAnswerRevealed(false);
  }

  return (
    <div className={(snowOn ? "snowOn " : "snowOff ") + "tvShell"}>
      <header className="festiveHeader tvHeaderCompact">
        <div className="tvHeaderBar">
          <div className="tvHeaderTitle" title={GAME.title}>
            {GAME.title}
          </div>

          <div className="tvHeaderControls">
            <span className="tvHeaderPackLabel">Pack</span>

            <select
              className="packSelectCompact"
              value={activePackId}
              onChange={function (e) { switchPack(e.target.value); }}
              aria-label="Pick a question pack"
            >
              {PACK_ORDER.map(function (id) {
                var p = PACKS[id];
                return (
                  <option key={id} value={id}>
                    {p.title}
                  </option>
                );
              })}
            </select>

            <button className="btnPrimary btnCompact" onClick={function () { setMenuOpen(true); }}>
              Menu
            </button>
          </div>
        </div>
      </header>

      <div className={showPanel ? "tvGrid panelOn" : "tvGrid panelOff"}>
        <main className="tvMain">
          <Board
            categories={GAME.categories}
            baseValues={BASE_VALUES}
            tileValue={tileValue}
            used={used}
            dailyDoubleKey={dailyDoubleKey}
            pickingDailyDouble={pickingDailyDouble}
            doubleRound={doubleRound}
            onPickDailyDouble={pickDailyDouble}
            onTileClick={openClue}
          />
        </main>

        <aside className="tvSide">
          <Scoreboard
            teams={teams}
            onSetup={function () { setSetupOpen(true); }}
            onAdjust={function (teamIdx, delta) { adjustScore(teamIdx, delta); }}
          />
        </aside>
      </div>

      {menuOpen ? (
        <div className="backdrop" onClick={function () { setMenuOpen(false); }}>
          <div className="menuModal" onClick={function (e) { e.stopPropagation(); }}>
            <div className="menuHeader">
              <div className="menuTitle">Host Menu</div>
              <button className="btnCompact" onClick={function () { setMenuOpen(false); }}>Close</button>
            </div>

            <div className="menuBody">
              <div className="menuGrid">
                <button className="btnPrimary" onClick={function () { newGameKeepTeams(); setMenuOpen(false); }}>
                  New Game
                </button>
                <button onClick={function () { resetBoardOnly(); setMenuOpen(false); }}>
                  Reset Board
                </button>
                <button className="btnPrimary" onClick={function () { openFinal(); setMenuOpen(false); }}>
                  Final
                </button>
                <button onClick={function () { setSetupOpen(true); setMenuOpen(false); }}>
                  Teams
                </button>
                <button onClick={function () { toggleFullscreen(); setMenuOpen(false); }}>
                  Fullscreen (F)
                </button>
                <button
                  onClick={function () {
                    setShowPanel(function (v) { return !v; });
                    setMenuOpen(false);
                  }}
                >
                  Panel: {showPanel ? "On" : "Off"} (P)
                </button>
                <button
                  onClick={function () {
                    setSnowOn(function (v) { return !v; });
                    setMenuOpen(false);
                  }}
                >
                  Snow: {snowOn ? "On" : "Off"}
                </button>
                <button
                  onClick={function () {
                    startPickDailyDouble();
                    setMenuOpen(false);
                  }}
                >
                  Set Daily Double
                </button>
                <button
                  className="btnDanger"
                  onClick={function () {
                    clearState();
                    window.location.reload();
                  }}
                >
                  Full Reset
                </button>
              </div>

              <div className="note">
                Shortcuts: <span className="kbd">F</span> fullscreen, <span className="kbd">P</span> panel,
                <span className="kbd">M</span> menu, <span className="kbd">Esc</span> close.
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <QuestionModal
        open={questionOpen}
        clue={currentClue}
        teams={teams}
        selectedTeamIndex={selectedTeamIndex}
        points={points}
        answerRevealed={answerRevealed}
        usedCount={usedCount}
        totalCount={totalCount}
        onSelectTeam={setSelectedTeamIndex}
        onPointsChange={setPoints}
        onRevealAnswer={function () { setAnswerRevealed(true); }}
        onClose={function () {
          setQuestionOpen(false);
          setAnswerRevealed(false);
          setCurrentClue(null);
        }}
        onScore={scoreCurrent}
        onToggleDoubleRound={function () { setDoubleRound(function (v) { return !v; }); }}
        onStartPickDailyDouble={startPickDailyDouble}
      />

      <SetupModal
        open={setupOpen}
        teams={teams}
        onClose={function () { setSetupOpen(false); }}
        onRename={renameTeam}
        onAdd={addTeam}
        onRemove={removeTeam}
        onResetScores={resetScores}
      />

      <FinalJeopardyModal
        open={finalOpen}
        final={GAME.final}
        teams={teams}
        wagers={finalWagers}
        correct={finalCorrect}
        answerRevealed={finalAnswerRevealed}
        onClose={function () {
          setFinalOpen(false);
          setFinalAnswerRevealed(false);
        }}
        onRevealAnswer={function () { setFinalAnswerRevealed(true); }}
        onSetWager={function (idx, value) {
          setFinalWagers(function (prev) {
            var next = prev.slice();
            next[idx] = Math.max(0, value);
            return next;
          });
        }}
        onToggleCorrect={function (idx) {
          setFinalCorrect(function (prev) {
            var next = prev.slice();
            next[idx] = !next[idx];
            return next;
          });
        }}
        onApply={applyFinal}
      />
    </div>
  );
}
