var cheerio = require('cheerio');
var charset = require('superagent-charset');
var superagent = charset(require('superagent'));
var fs = require("fs");
var time = 0;
test2();
function test2(){
    for(var i = 0;i<500;i++){
        if(i<=498){
            test1();
        }
        else{
            test3();
        }

    }
    
}

function test1() {
    //console.log("启动时间: " + process.uptime());
    superagent
        .get('http://www.biquzi.com/0_703/7364623.html').charset()
        .end(function (err, res) {
            if (err) {
                return next(err);
            }
            //console.log("完成网页下载: " + process.uptime());
            let $ = cheerio.load(res.text, { decodeEntities: false });
            //console.log("完成cheerio载入: " + process.uptime());
            let str = $("#content").html();
            //console.log("获取网页源代码： " + process.uptime());
            str = str.replace(/<br>/ig, "\r");
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
            // //console.log(str);

        });
}

function test3() {
    //console.log("启动时间: " + process.uptime());
    superagent
        .get('http://www.biquzi.com/0_703/7364623.html').charset()
        .end(function (err, res) {
            if (err) {
                return next(err);
            }
            //console.log("完成网页下载: " + process.uptime());
            let $ = cheerio.load(res.text, { decodeEntities: false });
            //console.log("完成cheerio载入: " + process.uptime());
            let str = $("#content").html();
            //console.log("获取网页源代码： " + process.uptime());
            str = str.replace(/<br>/ig, "\r");
            console.log("完成时间: " + process.uptime());
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
            // //console.log(str);

        });
}



