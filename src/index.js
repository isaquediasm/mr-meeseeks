import { processMessage } from './core/language'
import logger from 'hoopa-logger'
import request from 'request'
import recorder from 'node-record-lpcm16'
import fs from 'fs'
import { hotKeywordDetector } from './core/language/listening'

async function init() {
	hotKeywordDetector()
	/* const response = await processMessage('give me 10 songs')
	console.log(response) */
}

init()
