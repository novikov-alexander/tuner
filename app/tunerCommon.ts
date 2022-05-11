export const noteStrings: string[] = [
    'C',
    'C♯',
    'D',
    'D♯',
    'E',
    'F',
    'F♯',
    'G',
    'G♯',
    'A',
    'A♯',
    'B'
  ];

export const semitone: number = 69;

/**
 * get the musical note's standard frequency
 *
 * @param note
 * @returns {number}
 */
export function getStandardFrequency (note, middleA: number): number {
  return middleA * Math.pow(2, (note - semitone) / 12)
}