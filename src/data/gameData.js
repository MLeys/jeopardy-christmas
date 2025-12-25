import { PACKS, PACK_ORDER } from "./packs/index.js";

export var BASE_VALUES = [100, 200, 300, 400, 500];

export { PACKS, PACK_ORDER };

export var DEFAULT_PACK_ID = "kids-5-12";

export function getPackOrDefault(packId) {
  if (packId && PACKS[packId]) return PACKS[packId];
  return PACKS[DEFAULT_PACK_ID];
}
