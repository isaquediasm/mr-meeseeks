import fs from 'fs'
import logger from 'hoopa-logger'

export function readFolder(folderPath) {
	return new Promise((res, rej) => {
		try {
			let folders = []

			fs.readdirSync(folderPath).forEach((item) => folders.push(item))

			//console.log('##folders', folders)

			res(folders)
		} catch (err) {
			rej(err)
		}
	})
}

export async function mapFolder(folderPath) {
	const folders = await readFolder(folderPath)

	if (!folders.length) return

	try {
		const files = await folders.reduce(async (acc, folderName) => {
			const fileNames = await readFolder(`${folderPath}/${folderName}`)

			return {
				...(await acc),
				[folderName]: fileNames.map(
					(name) => `${folderPath}/${folderName}/${name}`
				),
			}
		}, {})

		return Promise.resolve(files)
	} catch (err) {
		logger.error(err)
	}
}
