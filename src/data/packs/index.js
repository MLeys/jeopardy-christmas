// src/data/index.js

// ===== Existing packs =====
import { PACK_5_7 } from "./pack_5_7.js";
import { PACK_8_10 } from "./pack_8_10.js";
import { PACK_11_12 } from "./pack_11_12.js";
import { PACK_ALL_KIDS_5_12 } from "./pack_all_kids_5_12.js";
import { PACK_ADULTS } from "./pack_adults.js";

// ===== Christian Christmas packs =====
import { PACK_CHRISTIAN_CHRISTMAS_5_7 } from "./pack_christian_christmas_5_7.js";
import { PACK_CHRISTIAN_CHRISTMAS_8_10 } from "./pack_christian_christmas_8_10.js";
import { PACK_CHRISTIAN_CHRISTMAS_11_12 } from "./pack_christian_christmas_11_12.js";
import { PACK_CHRISTIAN_CHRISTMAS_ADULTS } from "./pack_christian_christmas_adults.js";

// ===== Christmas Movie packs =====
import { PACK_CHRISTMAS_MOVIES } from "./pack_christmas_movies.js";
import { PACK_CHRISTMAS_MOVIES_MIX } from "./pack_christmas_movies_mix.js";
import { PACK_NATIONAL_LAMPOON_CHRISTMAS_VACATION } from "./pack_national_lampoon_christmas_vacation.js";

// ===== Pack registry =====
// Keys here MUST match the IDs your app uses elsewhere
export var PACKS = {
  // Existing packs
  "kids-5-7": PACK_5_7,
  "kids-8-10": PACK_8_10,
  "kids-11-12": PACK_11_12,
  "kids-5-12": PACK_ALL_KIDS_5_12,
  "adults": PACK_ADULTS,

  // Christian Christmas packs
  "christian-christmas-5-7": PACK_CHRISTIAN_CHRISTMAS_5_7,
  "christian-christmas-8-10": PACK_CHRISTIAN_CHRISTMAS_8_10,
  "christian-christmas-11-12": PACK_CHRISTIAN_CHRISTMAS_11_12,
  "christian-christmas-adults": PACK_CHRISTIAN_CHRISTMAS_ADULTS,

  // Christmas Movie packs
  "christmas-movies": PACK_CHRISTMAS_MOVIES,
  "christmas-movies-mix": PACK_CHRISTMAS_MOVIES_MIX,
  "national-lampoon-christmas-vacation": PACK_NATIONAL_LAMPOON_CHRISTMAS_VACATION
};

// ===== Dropdown order =====
// This controls exactly how packs appear in the selector
export var PACK_ORDER = [
  // Existing packs
  "kids-5-7",
  "kids-8-10",
  "kids-11-12",
  "kids-5-12",
  "adults",

  // Christian Christmas packs
  "christian-christmas-5-7",
  "christian-christmas-8-10",
  "christian-christmas-11-12",
  "christian-christmas-adults",

  // Christmas Movie packs
  "christmas-movies",
  "christmas-movies-mix",
  "national-lampoon-christmas-vacation"
];
