const fs = require('fs')
const { exec } = require('child_process')

// Cleanup and creation
if(fs.existsSync('./videos'))
	fs.rmSync('./videos', { recursive: true })

fs.mkdirSync('./videos')

if(fs.existsSync('./out.mp4'))
	fs.rmSync('./out.mp4')

if(fs.existsSync('./videos.txt'))
	fs.rmSync('./videos.txt')

// Find root directory
const ROOT_DIR = `${process.env.HOME}/Library/Application Support/com.memoryvault.MemoryVault`

// Find all chunks
let chunkNames = fs.readdirSync(`${ROOT_DIR}/chunks`)

// Remove .DS_Store
chunkNames = chunkNames.filter(chunkName => chunkName !== '.DS_Store')

// Add date object
chunkNames = chunkNames.map(chunkName => {
	const [rawDate, rawTime] = chunkName.split('T')

	const date =  new Date(rawDate)

	const [rawHours, rawMins, rawSeconds] = rawTime.split(':')

	date.setHours(rawHours)
	date.setMinutes(rawMins)
	date.setSeconds(rawSeconds)

	return {
		date,
		folder: chunkName
	}
})

// Remove in-progress chunks
chunkNames = chunkNames.map(chunkName => {
	const isChunkInProgress = fs.readdirSync(`${ROOT_DIR}/chunks/${chunkName.folder}`).length > 1

	return {
		...chunkName,
		isChunkInProgress
	}
})

chunkNames = chunkNames.filter(chunkName => !chunkName.isChunkInProgress)

// Sort properly based on date
chunkNames = chunkNames.sort((a, b) => a.date.getTime() - b.date.getTime())

// Logging
let i = 0 

// Copy locally
for(const chunkName of chunkNames) {
	const path = `${ROOT_DIR}/chunks/${chunkName.folder}/chunk`

	try {
		const data = fs.readFileSync(path)

		fs.writeFileSync(`./videos/${chunkName.folder}.mp4`, data)
	
		// console.log('OK', `${i}/${chunkNames.length}`, path, '>', chunkName.folder)
	} catch(error) {
		// console.error('ERR', `${i}/${chunkNames.length}`, path, '>', chunkName.folder)
	}

	i += 1
}

// Write videos
const videos = chunkNames.map(chunkName => `./videos/${chunkName.folder}.mp4`)

fs.writeFileSync('./videos.txt', videos.map(video => `file ${video}`).join('\n'), 'utf8')

// Log command
console.log('ffmpeg -f concat -safe 0 -i videos.txt -c copy out.mp4')
