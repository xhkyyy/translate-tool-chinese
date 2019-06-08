const Nightmare = require('nightmare')

function readSentenceFromStdin(trans) {
  var sentence = '';
  var stdin = process.stdin;
  stdin.on('readable', function () {
    var data = stdin.read();
    if (data != null) {
      sentence += data;
    }
  });

  stdin.on('end', function () {
    trans(sentence);
  });
}

function logx(website, transText) {
  console.log("\n" + website + ":\n" + transText.trim());
}

function google(sentenceStr) {
  Nightmare({
      show: false
    }).goto('https://translate.google.cn/#view=home&op=translate&sl=zh-CN&tl=en')
    .type('#source', sentenceStr)
    .wait('div.text-wrap.tlid-copy-target')
    .wait(3000)
    .evaluate(() => document.querySelector('div.text-wrap.tlid-copy-target').innerText)
    .end()
    .then(text => {
      logx("Google", text)
    })
    .catch(error => {
      console.error('Translate failed:', error)
    });
}

function sogou(sentenceStr) {
  Nightmare({
      show: false
    }).goto('https://fanyi.sogou.com')
    .type('#sogou-translate-input', sentenceStr)
    .wait(function () {
      return document.querySelector('#sogou-translate-output').innerText.trim().length > 0
    })
    .wait(3000)
    .evaluate(() => document.querySelector('#sogou-translate-output').innerText)
    .end()
    .then(text => {
      logx("Sogou", text)
    })
    .catch(error => {
      console.error('Translate failed:', error)
    });
}

function youdao(sentenceStr) {
  Nightmare({
      show: false
    }).goto('http://fanyi.youdao.com')
    .type('#inputOriginal', sentenceStr)
    .wait(function () {
      return document.querySelector('#transTarget').innerText.trim().length > 0
    })
    .wait(3000)
    .evaluate(() => document.querySelector('#transTarget').innerText)
    .end()
    .then(text => {
      logx("Youdao", text)
    })
    .catch(error => {
      console.error('Translate failed:', error)
    });
}

function bing(sentenceStr) {
  Nightmare({
      show: false
    }).goto('https://www.bing.com/translator')
    .select('#t_tl', 'en')
    .type('#t_sv', sentenceStr)
    .wait(function () {
      const t = document.querySelector('#t_tv').value.trim();
      return t.length > 0 && t != '...' && (!t.endsWith('...') || !t.endsWith('......'));
    })
    .wait(3000)
    .evaluate(() => document.querySelector('#t_tv').value)
    .end()
    .then(text => {
      logx("Bing", text)
    })
    .catch(error => {
      console.error('Translate failed:', error)
    });
}

function qq(sentenceStr) {
  Nightmare({
      show: false
    }).goto('https://fanyi.qq.com')
    .type('div.textpanel-source-textarea > textarea', sentenceStr)
    .wait('div.textpanel-target > div.textpanel-target-textblock')
    .wait(function () {
      return document.querySelector('div.textpanel-target > div.textpanel-target-textblock').innerText.trim().length > 0
    })
    .wait(3000)
    .evaluate(() => document.querySelector('div.textpanel-target > div.textpanel-target-textblock').innerText)
    .end()
    .then(text => {
      logx("QQ", text)
    })
    .catch(error => {
      console.error('Translate failed:', error)
    });
}

function baidu(sentenceStr) {
  Nightmare({
      show: false
    }).goto('https://fanyi.baidu.com/#zh/en')
    .type('div.input-wrap', sentenceStr)
    .click('#translate-button')
    .wait('div.output-bd')
    .wait(function () {
      return document.querySelector('div.output-bd').innerText.trim().length > 0
    })
    .wait(3000)
    .evaluate(() => document.querySelector('div.output-bd').innerText)
    .end()
    .then(text => {
      logx("baidu", text)
    })
    .catch(error => {
      console.error('Translate failed:', error)
    });
}

function chnToEn(sentenceStr) {
  google(sentenceStr);
  sogou(sentenceStr);
  youdao(sentenceStr);
  bing(sentenceStr);
  qq(sentenceStr);
  baidu(sentenceStr);
}

var args = process.argv.slice(2);

(args.length > 0 ? chnToEn(args[0]) : readSentenceFromStdin(chnToEn));

