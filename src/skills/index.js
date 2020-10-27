import { EventEmitter } from '../helpers/events'
import { Music } from './music'

function createListener(intents) {
	Object.keys(intents).map((key) => {
		EventEmitter.on(key, intents[key])
	})
}

function subscribe(skills) {
	return () => skills.map((item) => createListener(item.intents))
}

export const subscribeSkills = subscribe([Music])
