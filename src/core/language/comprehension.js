import request from 'request'
import { EventEmitter } from '../../helpers/events'
import { requestConfig } from '../../helpers/wit'
import { processMessage, NLP, Speech } from './speaking'

function findMainIntent(intents) {
	return intents.sort((a, b) => b.confidence - a.confidence)[0]
}

function analyseMessage(message) {
	if (!message.intents.length) {
		// EventEmitter.emit('conversation', { intent: ''})
		// TODO: Dispatch a "i dont understand" message
	}

	const mainIntent = findMainIntent(message.intents)
	EventEmitter.emit(mainIntent.name, message)
}

/**
 * Sends audio to wit.ai
 */
function processAudio() {
	const parseResult = (err, resp, body) => {
		if (err) console.error(err)

		const transcription = JSON.parse(body)

		analyseMessage(transcription)
		console.log(body)
		// Speech.speakFromAudio('ok')
		//	processMessage(transcription.text)

		// TODO: Add message-broker
		// NLP.process(transcription.text)
	}

	return request.post(requestConfig, parseResult)
}

export { processAudio }
