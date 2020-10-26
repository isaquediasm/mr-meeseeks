import nlpjs from '@nlpjs/basic'

const { dockStart } = nlpjs

const DEFAULT_LANG = 'EN'
const CORPUS_PATH = {
	EN: 'src/core/comprehension/corpus-en.json',
}

/**
 * Processes a give message and returns a textual response
 * @param {*} message
 */
async function processMessage(message, lang = DEFAULT_LANG) {
	const dock = await dockStart({ use: ['Basic'] })
	const nlp = dock.get('nlp')
	await nlp.addCorpus(CORPUS_PATH.EN)
	await nlp.train()
	const response = await nlp.process(lang, message)
	return response
}

export { processMessage }
