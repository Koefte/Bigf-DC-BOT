const ytdl = require('ytdl-core');
const fs = require("fs");
const search = require("youtube-search")

const opts = {
  maxResults: 1,
  key: 'AIzaSyAVHtC-jkSP4U455Q9QQRsRJQURVEN2aac'
};


async function downloadAudio(searchQuery) {
  try {
    const {results} = await search(searchQuery, opts);
    const url = `https://www.youtube.com/watch?v=${results[0].id}`;
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    if (!format) {
      console.log('Could not find audio format');
      return;
    }
    const stream = ytdl.downloadFromInfo(info, { format });
    stream.pipe(fs.createWriteStream('audio.mp3'));
    console.log('Downloading audio...');

    // Create a promise that resolves when the stream emits 'finish'
    await new Promise((resolve, reject) => {
      stream.on('finish', () => {
        console.log('Audio download complete');
        resolve();
      });
      stream.on('error', reject);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  downloadAudio
};
