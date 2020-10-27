const WIT_TOKEN = 'A5D4YS2UV5TSNAU35SNQT3HBGDTYDZPD'
const WIT_URL =
	'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json'

const requestConfig = {
	url: WIT_URL,
	headers: {
		Accept: 'application/vnd.wit.20160202+json',
		Authorization: `Bearer ${WIT_TOKEN}`,
		'Content-Type': 'audio/wav',
	},
}

export { requestConfig }
