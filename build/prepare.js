const fs = require('fs');
fs.createReadStream('node_modules/pierophp-pinyin/shared/helpers/separate-pinyin-in-syllables.js').pipe(fs.createWriteStream('src/helpers/separate-pinyin-in-syllables.js'));