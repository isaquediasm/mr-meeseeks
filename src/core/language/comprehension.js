import request from 'request'
import { broadcastEvent, EventEmitter } from '../../helpers/events'
import { requestConfig } from '../../helpers/wit'
import { NLP, Speech } from './speaking'

function findMainIntent(intents) {
	return intents.sort((a, b) => b.confidence - a.confidence)[0]
}

function processAudio() {
	const parseResult = async (err, resp, body) => {
		if (err) console.error(err)

		const transcription = JSON.parse(body)
		const intent = findMainIntent(transcription.intents)
		const processed = await NLP.process(transcription.text)

		// sends out the message to its stakeholders
		EventEmitter.emit(intent.name, transcription)

		// calls the speech manager with the current message
		EventEmitter.emit('speech_manager', processed?.answer)

		// Speech.speakFromAudio('ok')
		//	processMessage(transcription.text)

		// TODO: Add message-broker
		// NLP.process(transcription.text)
	}

	/**
	 * Sends audio to wit.ai
	 */
	return request.post(requestConfig, parseResult)
}

export { processAudio }
