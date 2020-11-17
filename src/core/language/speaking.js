import nlpjs from '@nlpjs/basic'
import logger from 'hoopa-logger'
import nlp from 'node-nlp'
import Speaker from 'speaker'
import fs from 'fs'
import { mapFolder } from '../../helpers/files'
import { pickRandomValue } from '../../helpers/array'
import concat from 'concat-stream'
import { EventEmitter } from '../../helpers/events'
import AWS from 'aws-sdk'

const { NlpManager, ConversationContext } = nlp
const { dockStart } = nlpjs

const Polly = new AWS.Polly({
	signatureVersion: 'v4',
	region: 'us-east-1',
})

const DEFAULT_LANG = 'EN'
const CORPUS_PATH = {
	EN: 'src/core/language/corpus-en.json',
}

const LanguageManager = new NlpManager({ languages: ['en'] })
const context = new ConversationContext()

/**
 * Processes a give message and returns a textual response
 * @param {*} message
 */
async function processMessage(message, lang = DEFAULT_LANG) {
	/* 	const dock = await dockStart({ use: ['Basic'] })
	const nlp = dock.get('nlp')
	await nlp.addCorpus(CORPUS_PATH.EN)
	await nlp.train()
	const response = await nlp.process(lang, message) */

	manager.addDocument('en', 'Hello my name is %name%', 'greeting.hello')
	manager.addDocument('en', 'I have to go', 'greeting.bye')
	manager.addAnswer('en', 'greeting.hello', 'Hey there, {{name}}!')
	manager.addAnswer('en', 'greeting.bye', 'Till next time, {{name}}!')

	manager
		.train()
		.then((result) => manager.process('en', 'Hello my name is John', context))
		//	.then((result) => manager.process('en', 'I have to go', context))
		.then((result) => console.log(result.answer))

	// logger.info(JSON.stringify(response))
}

const answers = {
	en: {
		song_request: `Your song request has been fulfilled. I'm free! *poof*`,
	},
}

const example_documents = {
	en: [
		{
			input: 'play me a song',
			intent: 'song_request',
			answer: answers.en.song_request,
		},
		{
			input: 'play me some song from frank sinatra',
			intent: 'song_request',
			answer: answers.en.song_request,
		},
		{
			input: 'play me a nice jazzy song',
			intent: 'song_request',
			answer: answers.en.song_request,
		},
	],
}

class NLPManager {
	async train(documents = example_documents, defaultIntent) {
		logger.info('training nlp analysis...')

		this.addDocuments(documents, defaultIntent)
		LanguageManager.train()
	}

	async process(message) {
		logger.info(`processing the message "${message}"`)

		const response = await LanguageManager.process('en', message)
		console.log(response)
		return response
	}

	/**
	 * Adds a given vector of documents to the
	 * language manager.
	 *
	 * @param {Array} docs
	 * @param {String} intent
	 */
	addDocuments(docs, defaultIntent) {
		docs.en.map(({ input, answer, intent = defaultIntent }) => {
			LanguageManager.addDocument('en', input, intent)

			if (answer) {
				LanguageManager.addAnswer('en', intent, answer)
			}
		})
	}
}

const AUDIOS_PATH = 'audios/'
const MEESEEKS_AUDIOS = {
	greeting: [`${AUDIOS_PATH}/look.wav`],
}

const createSentence = (sentence) => {
	const Text = `
		<speak>
			<amazon:effect vocal-tract-length="+5%">
				<amazon:auto-breaths>
					${sentence}
				</amazon:auto-breaths>
			</amazon:effect>
		</speak>
	`

	return {
		Text,
		SampleRate: '8000',
		OutputFormat: 'pcm',
		TextType: 'ssml',
		VoiceId: 'Joanna',
	}
}

const createSpeaker = (callback) => {
	const speaker = new Speaker({
		channels: 1,
		bitDepth: 16,
		sampleRate: 8000,
	})

	speaker.on('open', () => {
		logger.info('Speaker opened')
	})

	speaker.on('close', () => {
		logger.info('Speaker closed')
		callback()
	})

	return speaker
}
class SpeechManager {
	constructor() {
		EventEmitter.on('speech_manager', this.speak)
	}

	createSpeaker(callback) {
		const speaker = new Speaker({
			channels: 1,
			bitDepth: 16,
			sampleRate: 88200,
		})

		speaker.on('open', () => {
			logger.info('Speaker opened')
		})

		speaker.on('close', () => {
			logger.info('Speaker closed')
			callback()
		})

		return speaker
	}

	async getAudio(audioId) {
		try {
			const files = await mapFolder('audios')
			const audioPath = pickRandomValue(files?.[audioId])
			const audioStream = fs.createReadStream(audioPath)

			return audioStream
		} catch (err) {
			logger.error(err)
		}
	}

	/**
	 * Returns a respective audio based on the
	 * given audioId.
	 *
	 * @param {String} audioId
	 */
	async speakFromAudio(audioId) {
		return new Promise(async (res, rej) => {
			try {
				const speaker = this.createSpeaker(res)
				const audio = await this.getAudio(audioId)

				// creates a buffer from the audio read stream
				const concatStream = concat((buffer) => {
					speaker.write(Bsuffer.from(buffer), () => {
						// closes the speaker
						setTimeout(() => speaker.close(), 1000)
					})
				})

				audio.pipe(concatStream)
			} catch (err) {
				//speaker.close()
				logger.error(err)
				rej(err)
			}
		})
	}

	speak(message) {
		return new Promise(async (resolve, reject) => {
			Polly.synthesizeSpeech(createSentence(message), (err, res) => {
				if (err || !(res.AudioStream instanceof Buffer)) {
					reject(err || 'Not is a buffer')
				}

				const speaker = createSpeaker(resolve)

				try {
					speaker.write(Buffer.from(res.AudioStream), () => {
						setTimeout(() => speaker.close(), 800)
					})
				} catch (error) {
					logger.error(`Error opening speaker: ${error}`)
				}
			})
		})
	}

	errorMessage() {}
}

const NLP = new NLPManager()
const Speech = new SpeechManager()

export { processMessage, NLP, Speech }
