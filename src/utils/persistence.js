var STORAGE_KEY = "cj:state:v1";

export function loadState() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    var parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return null;

    if (!Array.isArray(parsed.teams)) return null;
    if (typeof parsed.used !== "object" || parsed.used === null) return null;

    // Normalize teams
    var teams = parsed.teams.map(function (t, idx) {
      var name =
        t && typeof t.name === "string" && t.name.trim()
          ? t.name.trim()
          : "Team " + String(idx + 1);

      var score = parseInt(t && t.score, 10);
      if (isNaN(score)) score = 0;

      return { name: name, score: score };
    });

    // Clamp teams 2..6
    if (teams.length < 2) {
      teams = teams.concat([{ name: "Team 2", score: 0 }]);
    }
    if (teams.length > 6) {
      teams = teams.slice(0, 6);
    }

    // Ensure used map is boolean values
    var used = {};
    for (var k in parsed.used) {
      if (Object.prototype.hasOwnProperty.call(parsed.used, k)) {
        used[k] = parsed.used[k] === true;
      }
    }

    var doubleRound = parsed.doubleRound === true;
    var dailyDoubleKey = typeof parsed.dailyDoubleKey === "string" ? parsed.dailyDoubleKey : null;

    var activePackId = typeof parsed.activePackId === "string" ? parsed.activePackId : null;

    return {
      version: 1,
      teams: teams,
      used: used,
      doubleRound: doubleRound,
      dailyDoubleKey: dailyDoubleKey,
      activePackId: activePackId
    };
  } catch (_e) {
    return null;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_e) {}
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (_e) {}
}
