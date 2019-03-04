var cheerio = require('cheerio');
var charset = require('superagent-charset');
var superagent = charset(require('superagent'));
var fs = require("fs");
test3();

function test3() {
    //console.log("启动时间: " + process.uptime());
    superagent
        .get('http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&fp=result&queryWord=%E8%AE%B8%E5%85%81%E7%BE%8E&cl=2&lm=-1&ie=utf-8&oe=utf-8&st=-1&ic=0&word=%E8%AE%B8%E5%85%81%E7%BE%8E&face=0&istype=2nc=1&pn=120&rn=60').charset()
        .end(function (err, res) {
            if (err) {
                return next(err);
            }
            //console.log("完成网页下载: " + process.uptime());
            //let $ = cheerio.load(res.text, { decodeEntities: false });
            //console.log("完成cheerio载入: " + process.uptime());
            //let str = $("#content").html();
            //console.log("获取网页源代码： " + process.uptime());
            //str = str.replace(/<br>/ig, "\r");
            //console.log("完成时间: " + process.uptime());
            //console.log("替换网页内容时间: " + process.uptime());
            // fs.writeFile("/test.html", str, function (err) {
            //     if (err) {
            //         return console.log(err);
            //     }
            //     console.log("文件写入完成： " + process.uptime());
            //     time = process.uptime();
            //     //console.log("文件写入成功");
            //     //console.log(process.uptime());
            // });
            console.log(res.text);

        });
}



