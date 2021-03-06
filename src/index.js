import { processMessage } from './core/language'
import logger from 'hoopa-logger'
import request from 'request'
import recorder from 'node-record-lpcm16'
import fs from 'fs'
import { activateHotwordDetector, Hearing } from './core/language/listening'
import { NLP } from './core/language/speaking'
import { processAudio } from './core/language/comprehension'
import { subscribeSkills } from './skills'
import { pipe } from './helpers/math'
import { Music } from './skills/music'
import { Greeting } from './skills/greeting'

async function init() {
	try {
		subscribeSkills([Music, Greeting])

		activateHotwordDetector(async (restart) => {
			// iniializes the recorder
			Hearing.start().pipe(processAudio())
		})
	} catch (err) {
		logger.error(err)
	}

	/* const response = await processMessage('give me 10 songs')
	console.log(response) */
}

init()
