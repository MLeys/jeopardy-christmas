import React from "react";
import { safeInt } from "../utils/helpers.js";

export default function QuestionModal(props) {
  var open = props.open;
  var clue = props.clue;

  if (!open || !clue) return null;

  function stop(e) { e.stopPropagation(); }

  var isDailyDouble = clue.isDailyDouble === true;
  var teamSelected = props.selectedTeamIndex !== null;

  return (
    <div className="backdrop">
      <div className="modal" onClick={stop}>
        <div className="modalHeader">
          <div>
            <div className="title">
              {clue.categoryName} — ${clue.value} {isDailyDouble ? "(Daily Double)" : ""}
            </div>
            <div className="note">Tile {clue.rIndex + 1} of 5</div>
          </div>
          <div className="btnRow">
            <button onClick={props.onClose}>Back to Board</button>
          </div>
        </div>

        <div className="modalBody">
          <div className="bigQuestion">{clue.q}</div>

          {props.answerRevealed ? (
            <div className="answerBox">Answer: {clue.a}</div>
          ) : null}

          <div className="controlGrid">
            <div className="card sectionCard">
              <div className="cardHeader"><h2>Scoring</h2></div>
              <div className="cardBody">
                <div className="note">Team that answered</div>

                <div className="teamPickGrid" role="group" aria-label="Select the team that answered">
                  {props.teams.map(function (t, idx) {
                    var active = props.selectedTeamIndex === idx;
                    var cls = "teamPickBtn" + (active ? " teamPickBtnActive" : "");
                    return (
                      <button
                        key={"teamPick-" + idx}
                        type="button"
                        className={cls}
                        onClick={function () { props.onSelectTeam(idx); }}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>

                {/* Primary action in the operator flow */}
                <div style={{ marginTop: 10 }}>
                  <button
                    className="btnPrimary"
                    onClick={props.onRevealAnswer}
                    style={{ width: "100%" }}
                  >
                    Reveal Answer
                  </button>
                </div>

                <div style={{ marginTop: 10 }} className={teamSelected ? "pill" : "pill pillWarn"}>
                  Selected:{" "}
                  {teamSelected
                    ? props.teams[props.selectedTeamIndex].name
                    : "NONE — pick a team for Correct/Incorrect"}
                </div>

                <div style={{ height: 12 }} />

                <label className="note">Point value (override if needed)</label>
                <input
                  className="input"
                  type="number"
                  step="100"
                  value={String(props.points)}
                  onChange={function (e) {
                    props.onPointsChange(safeInt(e.target.value, clue.value));
                  }}
                />

                <div style={{ height: 12 }} />

                <div className="btnRow">
                  <button
                    className="btnGood"
                    disabled={!teamSelected}
                    onClick={function () { props.onScore(+1); }}
                  >
                    Correct
                  </button>
                  <button
                    className="btnDanger"
                    disabled={!teamSelected}
                    onClick={function () { props.onScore(-1); }}
                  >
                    Incorrect
                  </button>

                  {/* No Score is allowed without selecting a team */}
                  <button onClick={function () { props.onScore(0); }}>
                    No Score
                  </button>

                  <button
                    type="button"
                    onClick={function () { props.onSelectTeam(null); }}
                    disabled={!teamSelected}
                    title="Clear selected team"
                  >
                    Clear Team
                  </button>
                </div>

                <div style={{ marginTop: 10 }} className="note">
                  Tip: If you hit <b>Back to Board</b> without scoring, this tile stays available.
                  Use <b>No Score</b> to finalize without changing any score.
                </div>
              </div>
            </div>

            <div className="card sectionCard">
              <div className="cardHeader"><h2>Round Options</h2></div>
              <div className="cardBody">
                <div className="btnRow">
                  <button onClick={props.onToggleDoubleRound}>
                    Toggle Double Jeopardy
                  </button>
                  <button onClick={props.onStartPickDailyDouble}>
                    Pick a Daily Double
                  </button>
                </div>

                <div style={{ marginTop: 10 }} className="note">
                  Double Jeopardy doubles tile values. Daily Double lets a team wager a custom amount.
                </div>

                <div style={{ marginTop: 10 }} className="pill">
                  Used tiles: {props.usedCount} / {props.totalCount}
                </div>

                <div style={{ marginTop: 10 }} className="note">
                  Daily Double: click “Pick a Daily Double” then click any unused tile (host choice).
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
