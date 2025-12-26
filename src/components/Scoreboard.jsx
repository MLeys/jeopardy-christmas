import React from "react";

export default function Scoreboard(props) {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2>Teams</h2>
        <button onClick={props.onSetup}>Edit Teams</button>
      </div>

      <div className="cardBody">
        <div className="scores scoresTV">
          {props.teams.map(function (team, idx) {
            return (
              <div key={"team-" + idx} className="teamRow teamRowTV">
                <div className="teamName teamNameTV">
                  {team.name}
                </div>
                <div className="teamScore teamScoreTV">
                  ${team.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
