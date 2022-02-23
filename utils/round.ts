export function round(num: number, decimalPlaces = 0) {
  const numRounded = Math.round(`${num}e${decimalPlaces}`);
  return Number(`${numRounded}e${-decimalPlaces}`);
}
