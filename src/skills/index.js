import { EventEmitter } from '../helpers/events'
import { pipe } from '../helpers/math'
import { NLP } from '../core/language/speaking'

/**
 * Creates an event listener to the
 * skill's intent and add its handler as a callback
 *
 * @param {*} skill
 * @returns skill
 */
function createListener(skill) {
	const { intents } = skill
	intents.forEach((item) => {
		EventEmitter.on(item.name, item.handler)
	})

	return skill
}

/**
 * Receives a list of intents and invokes
 * the NLP manager training method in order
 * to properly subscribe the Skill's language models
 *
 * @param {*} { intents }
 */
function trainLanguage(skill) {
	const { intents } = skill
	intents.forEach(({ languageModels, name }) => NLP.train(languageModels, name))

	return skill
}

/**
 * Interates through the given set of skills and
 * applies modifications and dependencies
 *
 * @param {*} skills
 */
export function subscribeSkills(skills) {
	skills.forEach(pipe(createListener, trainLanguage))
}
