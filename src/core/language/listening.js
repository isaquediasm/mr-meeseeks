import fs from 'fs'
import logger from 'hoopa-logger'
import recorder from 'node-record-lpcm16'
import { Speech } from './speaking'

// TODO: Implement hot keyword detector logic
function activateHotwordDetector(callback) {
	// Speech.speakFromAudio('greetings')

	callback(activateHotwordDetector)

	/* const recording = recorder.record({
		sampleRate: 44100,
	})*/

	// recording.stream().pipe(postAudio())
}

// TODO: implement recorder
class Hearing {
	static start() {
		const file = fs.createReadStream('test-backup.wav')

		return file
	}
}

export { activateHotwordDetector, Hearing }
