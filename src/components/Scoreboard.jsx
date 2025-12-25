import React from "react";

export default function Scoreboard(props) {
  var teams = props.teams;
  var onSetup = props.onSetup;
  var onAdjust = props.onAdjust;

  return (
    <div className="card">
      <div className="cardHeader">
        <h2>Teams & Scores</h2>
        <button className="btnPrimary" onClick={onSetup}>
          Setup Teams
        </button>
      </div>

      <div className="cardBody">
        <div className="scores">
          {teams.map(function (t, idx) {
            return (
              <div className="teamRow" key={"team-" + idx}>
                <div>
                  <div className="teamName">{t.name}</div>
                  <div className="miniRow">
                    <button onClick={function () { onAdjust(idx, -100); }}>-100</button>
                    <button onClick={function () { onAdjust(idx, +100); }}>+100</button>
                  </div>
                </div>
                <div className="teamScore">{t.score}</div>
              </div>
            );
          })}
        </div>

        <div className="miniRow" style={{ marginTop: 12 }}>
          <span className="pill">
            Tip: Use <span className="kbd">Esc</span> to close modals
          </span>
          <span className="pill">Host selects team that answered</span>
        </div>

        <div style={{ marginTop: 12 }} className="note">
          Flow: click tile → read question → select team → reveal answer → mark correct/incorrect.
        </div>
      </div>
    </div>
  );
}
