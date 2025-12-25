import React from "react";
import { safeInt } from "../utils/helpers.js";

export default function FinalJeopardyModal(props) {
  if (!props.open) return null;

  function stop(e) { e.stopPropagation(); }

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div className="modal" onClick={stop}>
        <div className="modalHeader">
          <div className="title">Final Jeopardy</div>
          <div className="btnRow">
            <button onClick={props.onClose}>Back</button>
          </div>
        </div>

        <div className="modalBody">
          <div className="note">Category: {props.final.category}</div>
          <div className="bigQuestion">{props.final.q}</div>

          {props.answerRevealed ? (
            <div className="answerBox">Answer: {props.final.a}</div>
          ) : null}

          <div className="card sectionCard">
            <div className="cardHeader"><h2>Wagers & Results</h2></div>
            <div className="cardBody">
              {props.teams.map(function (t, idx) {
                return (
                  <div className="teamRow" key={"fj-" + idx}>
                    <div>
                      <div className="teamName">
                        {t.name} (Score: {t.score})
                      </div>

                      <div className="note" style={{ marginTop: 6 }}>Wager</div>
                      <input
                        className="input"
                        type="number"
                        step="100"
                        value={String(props.wagers[idx])}
                        onChange={function (e) {
                          props.onSetWager(idx, safeInt(e.target.value, 0));
                        }}
                      />
                    </div>

                    <button
                      className={props.correct[idx] ? "btnGood" : ""}
                      onClick={function () { props.onToggleCorrect(idx); }}
                    >
                      Correct: {props.correct[idx] ? "YES" : "NO"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="btnRow">
            <button className="btnPrimary" onClick={props.onRevealAnswer}>
              Reveal Final Answer
            </button>
            <button className="btnGood" onClick={props.onApply}>
              Apply Results
            </button>
          </div>

          <div className="note">
            Flow: enter wagers → let teams decide → reveal answer → mark correct per team → apply.
          </div>
        </div>
      </div>
    </div>
  );
}
