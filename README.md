# Rewind.ai Exporter
Export your Rewind.ai history into a single .mp4, completely locally

## Requirements
You will of course need Rewind.ai installed, and a copy of ffmpeg:
```sh
brew install ffmpeg
```

## Usage
```sh
git clone https://github.com/darnfish/rewind.ai-exporter.git
cd rewind.ai-exporter
yarn
node . | sh
```

You can run `estimate.js` to view an estimated size of the mp4 output. For example:
```
$ node estimate.js
Estimated size: 129.68 GiB
```

## License
MIT
