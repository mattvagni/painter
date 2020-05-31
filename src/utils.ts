export function doTimes(num: number, fn: (index: number) => void) {
  for (let i = 0; i < num; i++) {
    fn(i);
  }
}
