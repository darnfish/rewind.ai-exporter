const fs = require('fs')
const { exec } = require('child_process')

module.exports = function() {
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
	const chunkMonths = chunkNames.map(chunkName => {
		const year = chunkName.substring(0, 4)
		const month = chunkName.substring(4)

		return {
			date: new Date(year, month - 1),
			folder: chunkName
		}
	})

	const chunkDays = chunkMonths.map(({ date: _date, folder }) => {
		const contents = fs.readdirSync(`${ROOT_DIR}/chunks/${folder}`).filter(day => day !== '.DS_Store')

		const days = contents.map(day => {
			const date = new Date(_date)
			date.setDate(parseInt(day))

			return {
				date,
				folder: [folder, day].join('/')
			}
		})

		return days
	}).flat()

	let chunks = chunkDays.map(chunkDay => {
		return {
			date: chunkDay.date,
			path: fs.readdirSync(`${ROOT_DIR}/chunks/${chunkDay.folder}`).map(chunk => [chunkDay.folder, chunk].join('/'))
		}
	}).flat()

	// Sort properly based on date
	chunks = chunks.sort((a, b) => a.date.getTime() - b.date.getTime())
	chunks = chunks.map(chunk => chunk.path)
	chunks = chunks.flat()

	// Write videos
	const videos = chunks.map(chunk => `${ROOT_DIR}/chunks/${chunk}`)

	return videos
}
