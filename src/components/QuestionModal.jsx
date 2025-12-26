import React from "react";
import { safeInt } from "../utils/helpers.js";

export default function QuestionModal(props) {
  var open = props.open;
  var clue = props.clue;

  if (!open || !clue) return null;

  function stop(e) { e.stopPropagation(); }

  var isDailyDouble = clue.isDailyDouble === true;

  // Guard: require a valid team index before allowing scoring
  var teamCount = props.teams ? props.teams.length : 0;
  var teamIdx = safeInt(props.selectedTeamIndex, 0);
  var teamIdxValid = teamCount > 0 && teamIdx >= 0 && teamIdx < teamCount;

  function selectTeam(idx) {
    props.onSelectTeam(idx);
  }

  return (
    <div className="backdrop" onClick={stop /* disable click-off close */}>
      <div className="modal modalTV" onClick={stop}>
        <div className="modalHeader modalHeaderTV">
          <div className="modalTitleBlock">
            <div className="title modalTitleTV">
              {clue.categoryName} — ${clue.value} {isDailyDouble ? "• DAILY DOUBLE" : ""}
            </div>
            <div className="note modalSubTV">
              Tile {clue.rIndex + 1} / 5
            </div>
          </div>

          <div className="btnRow modalBtnsTV">
            <button className="btnPrimary" onClick={props.onRevealAnswer}>
              Reveal
            </button>
            <button className="btnDanger" onClick={props.onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="modalBody modalBodyTV">
          <div className="bigQuestion bigQuestionTV">{clue.q}</div>

          {props.answerRevealed ? (
            <div className="answerBox answerBoxTV">Answer: {clue.a}</div>
          ) : null}

          <div className="controlGrid controlGridTV">
            {/* LEFT: Scoring */}
            <div className="card sectionCard">
              <div className="cardHeader cardHeaderTV">
                <h2>Operator Scoring</h2>
                <div className="pill pillTV">
                  Selected:{" "}
                  <span style={{ color: "var(--gold)" }}>
                    {teamIdxValid ? props.teams[teamIdx].name : "—"}
                  </span>
                </div>
              </div>

              <div className="cardBody cardBodyTV">
                <div className="note noteTV">1) Select the team that buzzed in</div>

                {/* Big team picker buttons (fast + reduces errors) */}
                <div className="teamPicker">
                  {props.teams.map(function (t, idx) {
                    var active = idx === teamIdx;
                    return (
                      <button
                        key={"tp-" + idx}
                        className={active ? "teamPickBtn teamPickBtnActive" : "teamPickBtn"}
                        onClick={function () { selectTeam(idx); }}
                        type="button"
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown fallback (still useful for many teams) */}
                <div className="spacer10" />
                <label className="note noteTV">Or pick from list</label>
                <select
                  className="select selectTV"
                  value={String(teamIdx)}
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

                <div className="spacer10" />
                <div className="note noteTV">2) Confirm/override points if needed</div>

                <input
                  className="input inputTV"
                  type="number"
                  step="100"
                  value={String(props.points)}
                  onChange={function (e) {
                    props.onPointsChange(safeInt(e.target.value, clue.value));
                  }}
                />

                <div className="spacer10" />
                <div className="note noteTV">3) Score the result</div>

                <div className="btnRow btnRowTV">
                  <button
                    className="btnGood"
                    disabled={!teamIdxValid}
                    onClick={function () { props.onScore(+1); }}
                    type="button"
                  >
                    Correct (+)
                  </button>

                  <button
                    className="btnDanger"
                    disabled={!teamIdxValid}
                    onClick={function () { props.onScore(-1); }}
                    type="button"
                  >
                    Incorrect (-)
                  </button>

                  <button
                    disabled={!teamIdxValid}
                    onClick={function () { props.onScore(0); }}
                    type="button"
                  >
                    No Score
                  </button>
                </div>

                {isDailyDouble ? (
                  <div className="note noteTV" style={{ marginTop: 10 }}>
                    Daily Double: use “Point value” as the wager for the selected team.
                  </div>
                ) : null}
              </div>
            </div>

            {/* RIGHT: Round options */}
            <div className="card sectionCard">
              <div className="cardHeader cardHeaderTV">
                <h2>Round Options</h2>
              </div>
              <div className="cardBody cardBodyTV">
                <div className="btnRow btnRowTV">
                  <button onClick={props.onToggleDoubleRound} type="button">
                    Toggle Double
                  </button>
                  <button onClick={props.onStartPickDailyDouble} type="button">
                    Pick Daily Double
                  </button>
                </div>

                <div className="note noteTV" style={{ marginTop: 10 }}>
                  Double Jeopardy doubles tile values. Daily Double lets a team wager a custom amount.
                </div>

                <div className="pill pillTV" style={{ marginTop: 12 }}>
                  Used tiles: {props.usedCount} / {props.totalCount}
                </div>

                <div className="note noteTV" style={{ marginTop: 10 }}>
                  Tip: Use <span className="kbd">Esc</span> only if you truly want to exit.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
