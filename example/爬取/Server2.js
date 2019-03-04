var transliteration = require('transliteration');

console.log(transliteration.transliterate('你好世界')); // Ni Hao ,Shi Jie
console.log(transliteration.slugify('你好，世界')); // ni-hao-shi-jie
console.log(transliteration.slugify('你好，世界', {lowercase: true, separator: ''})); // Ni_Hao_Shi_Jie