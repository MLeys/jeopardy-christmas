// src/components/Board.jsx
import React from "react";

export default function Board(props) {
  var categories = props.categories;
  var baseValues = props.baseValues;
  var tileValue = props.tileValue;
  var used = props.used;
  var dailyDoubleKey = props.dailyDoubleKey;
  var pickingDailyDouble = props.pickingDailyDouble;
  var onTileClick = props.onTileClick;
  var onPickDailyDouble = props.onPickDailyDouble;

  return (
    <div className="card">
      <div className="cardHeader">
        <h2>Board</h2>
        <div className="pill pillCompact">
          Round: <span>{props.doubleRound ? "Double Jeopardy" : "Single"}</span>
        </div>
      </div>

      <div className="cardBody">
        <div className="board" role="grid" aria-label="Jeopardy board">
          {categories.map(function (cat, cIndex) {
            return (
              <div className="cat" key={"cat-" + cIndex} role="columnheader">
                {cat.name}
              </div>
            );
          })}

          {baseValues.map(function (_v, rIndex) {
            return categories.map(function (_cat, cIndex) {
              var k = String(cIndex) + "-" + String(rIndex);
              var isUsed = used[k] === true;

              var className = "tile" + (isUsed ? " used" : "");
              var label = isUsed ? "—" : "$" + String(tileValue(rIndex));

              var style = {};
              if (!isUsed && dailyDoubleKey === k) {
                style.outline = "2px solid rgba(255, 210, 138, 0.55)";
                style.outlineOffset = "2px";
              }

              function handleClick() {
                if (isUsed) return;
                if (pickingDailyDouble) {
                  onPickDailyDouble(k);
                  return;
                }
                onTileClick(cIndex, rIndex);
              }

              return (
                <div
                  key={k}
                  className={className}
                  style={style}
                  onClick={isUsed ? undefined : handleClick}
                  role="button"
                  aria-disabled={isUsed ? "true" : "false"}
                >
                  {label}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
