const fs = require('fs')
const exportFileLocations = require('./export')

const videos = exportFileLocations()

fs.writeFileSync('./videos.txt', videos.map(video => `file '${video}'`).join('\n'), 'utf8')

// Log command
console.log('ffmpeg -f concat -safe 0 -i videos.txt -c copy out.mp4')
