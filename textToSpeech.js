
const gTTS = require('gtts');
     

async function downloadVoice(textToSay) {   
    const  gtts = new gTTS(textToSay, 'de');
    gtts.save('voice.mp3', function (err, result){
        if(err) { throw new Error(err); }
    });
}

module.exports = {
    downloadVoice,
}