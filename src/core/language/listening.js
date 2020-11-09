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

const recording = recorder.record({
	sampleRate: 44100,
	endOnSilence: true,
})

// TODO: implement recorder
class Hearing {
	static start(cb) {
		/* const file = fs.createReadStream('test-backup.wav')
		
		return file */

		const cbFn = () => {
			recording.stop()
			cb()
		}

		return recording.stream()
		//	return recording.start()
	}
	static stop() {
		return recording.stop()
	}
}

export { activateHotwordDetector, Hearing }
