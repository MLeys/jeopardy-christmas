import React from "react";
import { safeInt } from "../utils/helpers.js";

export default function QuestionModal(props) {
  var open = props.open;
  var clue = props.clue;

  if (!open || !clue) return null;

  function stop(e) { e.stopPropagation(); }

  var isDailyDouble = clue.isDailyDouble === true;

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div className="modal" onClick={stop}>
        <div className="modalHeader">
          <div>
            <div className="title">
              {clue.categoryName} — ${clue.value} {isDailyDouble ? "(Daily Double)" : ""}
            </div>
            <div className="note">Tile {clue.rIndex + 1} of 5</div>
          </div>
          <div className="btnRow">
            <button className="btnPrimary" onClick={props.onRevealAnswer}>
              Reveal Answer
            </button>
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
                <label className="note">Team that answered</label>
                <select
                  className="select"
                  value={String(props.selectedTeamIndex)}
                  onChange={function (e) { props.onSelectTeam(safeInt(e.target.value, 0)); }}
                >
                  {props.teams.map(function (t, idx) {
                    return (
                      <option key={"topt-" + idx} value={String(idx)}>
                        {t.name}
                      </option>
                    );
                  })}
                </select>

                <div style={{ height: 10 }} />

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

                <div style={{ height: 10 }} />

                <div className="btnRow">
                  <button className="btnGood" onClick={function () { props.onScore(+1); }}>
                    Correct (+)
                  </button>
                  <button className="btnDanger" onClick={function () { props.onScore(-1); }}>
                    Incorrect (-)
                  </button>
                  <button onClick={function () { props.onScore(0); }}>
                    No Score
                  </button>
                </div>

                <div style={{ marginTop: 10 }} className="note">
                  {isDailyDouble
                    ? "Daily Double: select team and enter their wager, then mark correct/incorrect."
                    : ""}
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
