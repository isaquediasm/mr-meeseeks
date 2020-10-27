import { getRandomNumber } from './math'

export function pickRandomValue(arr) {
	return arr[getRandomNumber(0, arr.length - 1)]
}
