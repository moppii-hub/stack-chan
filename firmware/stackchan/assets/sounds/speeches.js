const speeches_temperature = {
    hot: '今日はあついね',
    cold: '今日はさむいね',
    cool: '今日はすずしいね',
}

const speeches_weather = {
    rainy: '今日は雨が降りそうだね',
    sunny: '今日はいい天気だね',
    clowdy: '今日は曇りだよ',
}

const speeches_feeling = {
    feelgood: '今日はいい気分。今日も1日頑張ろう',
    feeltired: 'ちょっと疲れちゃった。ゆっくりしようかな',
    feelsleepy: 'もうねむねむだよ',
}

const speeches_howabout = {
    howareyou: '今日の調子はどうですか？',
    howhaveyoubeen: '最近なにか良いことはありましたか？',
    lookhappy: 'なんだか、ごきげんじゃないですか？',
    lookbad: '無理はしないでね'
}

const speeches_greetings = {
    goodmorning: 'おはよう',
    getupearly: '早起きだね',
    goodevening: 'こんばんわ',
    goodnight: 'おそくまで、お疲れさま',
    gotobed: 'おやすみなさい',
}

const speeches_all = {
    ...speeches_temperature,
    ...speeches_weather,
    ...speeches_feeling,
    ...speeches_howabout,
    ...speeches_greetings,
};


export default {
    shift: 1.5,
    speeches_all,
    speeches_temperature,
    speeches_weather,
    speeches_feeling,
    speeches_howabout,
    speeches_greetings,
}