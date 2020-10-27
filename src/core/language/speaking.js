import nlpjs from '@nlpjs/basic'
import logger from 'hoopa-logger'
import nlp from 'node-nlp'
import Speaker from 'speaker'
import fs from 'fs'
import { mapFolder } from '../../helpers/files'
import { pickRandomValue } from '../../helpers/array'
import concat from 'concat-stream'

const { NlpManager, ConversationContext } = nlp
const { dockStart } = nlpjs

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

const documents = {
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

class NLP {
	static async train() {
		logger.info('training nlp analysis...')

		this.addDocuments(documents)
		LanguageManager.train()
	}

	static async process(message) {
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
	 */
	static addDocuments(docs) {
		docs.en.map((item) => {
			LanguageManager.addDocument('en', item.input, item.intent)

			if (item.answer) {
				LanguageManager.addAnswer('en', item.intent, item.answer)
			}
		})
	}
}

const AUDIOS_PATH = 'audios/'
const MEESEEKS_AUDIOS = {
	greeting: [`${AUDIOS_PATH}/look.wav`],
}

class Speech {
	static createSpeaker(callback) {
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

	static async getAudio(audioId) {
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
	static async speakFromAudio(audioId) {
		return new Promise(async (res, rej) => {
			try {
				const speaker = this.createSpeaker(res)
				const audio = await this.getAudio(audioId)

				// creates a buffer from the audio read stream
				const concatStream = concat((buffer) => {
					speaker.write(Buffer.from(buffer), () => {
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
}

export { processMessage, NLP, Speech }
