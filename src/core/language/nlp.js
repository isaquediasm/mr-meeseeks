import nlpjs from '@nlpjs/basic'
import logger from 'hoopa-logger'
import nlp from 'node-nlp'
import Speaker from 'speaker'
import fs from 'fs'
import { mapFolder } from '../../helpers/files'
import { pickRandomValue } from '../../helpers/array'
import concat from 'concat-stream'

export class NLP {
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
