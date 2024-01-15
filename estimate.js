const fs = require('fs')
const exportFileLocations = require('./export')

// https://stackoverflow.com/a/18650828
function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const videos = exportFileLocations()

const videoStats = videos.map(video => fs.statSync(video))
const totalSize = videoStats.map(stat => stat.size).reduce((a, b) => a + b)

console.log(`Estimated size: ${formatBytes(totalSize)}`)
