import fs from 'fs'
import logger from 'hoopa-logger'
import recorder from 'node-record-lpcm16'
import { postAudio } from '../../helpers/wit'

function hotKeywordDetector() {
	// TODO: Implement hot keyword detector logic

	logger.info('Mr Meeseeks, look at me! Im listening!')

	/* const recording = recorder.record({
		sampleRate: 44100,
	})*/

	// recording.stream().pipe(postAudio())

	fs.createReadStream('test-backup.wav').pipe(postAudio())
}

export { hotKeywordDetector }
