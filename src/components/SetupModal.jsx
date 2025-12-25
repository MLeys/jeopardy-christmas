import React from "react";

export default function SetupModal(props) {
  var teams = props.teams;

  if (!props.open) return null;

  function stop(e) { e.stopPropagation(); }

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div className="modal" onClick={stop}>
        <div className="modalHeader">
          <div className="title">Setup Teams</div>
          <div className="btnRow">
            <button onClick={props.onClose}>Done</button>
          </div>
        </div>

        <div className="modalBody">
          <div className="card sectionCard">
            <div className="cardHeader">
              <h2>Team Names</h2>
            </div>
            <div className="cardBody">
              {teams.map(function (t, idx) {
                return (
                  <div key={"ti-" + idx} style={{ marginBottom: 10 }}>
                    <input
                      className="input"
                      value={t.name}
                      onChange={function (e) { props.onRename(idx, e.target.value); }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="btnRow">
            <button className="btnPrimary" onClick={props.onAdd} disabled={teams.length >= 6}>
              Add Team
            </button>
            <button onClick={props.onRemove} disabled={teams.length <= 2}>
              Remove Team
            </button>
            <button className="btnDanger" onClick={props.onResetScores}>
              Reset Scores
            </button>
          </div>

          <div className="note">Recommended: 2–4 teams for kids.</div>
        </div>
      </div>
    </div>
  );
}
