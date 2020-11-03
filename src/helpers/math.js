export function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const _pipe = (a, b) => (arg) => b(a(arg))
export const pipe = (...ops) => ops.reduce(_pipe)
