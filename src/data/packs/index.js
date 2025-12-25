import { PACK_5_7 } from "./pack_5_7.js";
import { PACK_8_10 } from "./pack_8_10.js";
import { PACK_11_12 } from "./pack_11_12.js";
import { PACK_ALL_KIDS_5_12 } from "./pack_all_kids_5_12.js";
import { PACK_ADULTS } from "./pack_adults.js";

export var PACKS = {
  "kids-5-7": PACK_5_7,
  "kids-8-10": PACK_8_10,
  "kids-11-12": PACK_11_12,
  "kids-5-12": PACK_ALL_KIDS_5_12,
  adults: PACK_ADULTS
};

export var PACK_ORDER = ["kids-5-7", "kids-8-10", "kids-11-12", "kids-5-12", "adults"];
