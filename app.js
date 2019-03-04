var cheerio = require('cheerio');
var charset = require('superagent-charset');
var superagent = charset(require('superagent'));
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

//用于爬虫的cookie
var ServerCookie = "ALF=1554300518; SCF=AvYt-GLfqb4K6j6gndw85OownBAd0S7GUGapxKDa9dUdgSV2_s10Ws_VUlqySkUr2l8jTHLEpCJA8p2DS5MUaYo.; SUB=_2A25xeUE3DeRhGeVH7FYR8SvFyjuIHXVSgm9_rDV6PUNbktANLRjSkW1NTztZoKKC2CvgEINmiTxBd8bjcPcPPi2-; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFhQm-zKH2T5Bn2OBsn_xzT5JpX5KMhUgL.Foe4S0B7eK-4eKM2dJLoIpjLxKqLB-BLBKzLxKqLB-BLBKzLxKqL1hBL1-2t; SUHB=03oFprLUGpyh2G; SSOLoginState=1551708519; _T_WM=a4d12608ce52b4a5cf4c720f0ad5d29a";
var _tmp;

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DEvarE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// var weibouid;
// var weiboname;
// var weibopagemax;
var weiboinfo = {};
var pagelist = {};
var mainuserslist = {};
var mainusername;
//对比weibo
var otherpagelist = {};
var otheruserslist = {};
var otherWeiboUid;
var otherusername;

//用于发送给客户端
var downonepagestatus;
var taskstatus = 1;
var nowdownpage = 0;


//所有微博放在一个月中看（发送次数）
var allinonemonth_weibomsgtimes;

//根据微博名称获取UID
function GetUidByName(name) {
    mainusername = name;
    var str = "https://weibo.cn/search/?pos=search&keyword=" + encodeURI(name) + "&suser=找人";
    //var str1 = "https://weibo.cn/search/?pos=search&keyword=%E5%8A%AA%E5%8A%9B%E5%8A%AA%E5%8A%9B%E5%86%8D%E5%8A%AA%E5%8A%9BX&suser=%E6%89%BE%E4%BA%BA";
    superagent
        .post(str).charset()
        .set('Content-Type', 'application/json;charset=UTF-8')
        .set('Cookie', ServerCookie)
        .charset()
        .end(function (err, res) {
            if (err) {
                console.log("");
            }
            var $ = cheerio.load(res.text, { decodeEntities: false });
            //保存uid
            weiboinfo.uid = ($("input[name='uidList']").attr("value").substr(0, 10));
            downonepagestatus = "成功获取UID";
            console.log("成功获取UID");
            //console.log(weiboinfo.uid);
            //StartDownPage();
            GetPage(weiboinfo.uid, 1);
        });
}


//爬取页面
//0为未下载，1为正在下载，2为下载完成，3为全部下载完成
function GetPage(uid, page) {
    //https://weibo.cn/u/3974015917?filter=0&page=1
    if (pagelist[page + 1] == null) {
        var str = "https://weibo.cn/u/" + uid + "?filter=0&page=" + page;
        superagent
            .get(str)
            .set('Content-Type', 'application/json;charset=UTF-8')
            .set('Cookie', ServerCookie)
            .charset()
            .end(function (err, res) {
                if (err) {
                    console.log("不是UID");
                }
                pagelist[page] = res.text;
                var $ = cheerio.load(res.text, { decodeEntities: false });
                //不为5说明不是最后一页
                downonepagestatus = "第 " + page + " 页爬取完成";
                console.log("第 " + page + " 页爬取完成");
                if ($("div#pagelist").children().children().children().length != 5) {
                    setTimeout(function () { GetPage(uid, page + 1); }, 500);
                    taskstatus = 1;
                } else {
                    downonepagestatus = "所有页面爬取任务完成";
                    nowdownpage = 0;


                    for (var i = 1; pagelist[i] != null; i++) {
                        var $ = cheerio.load(pagelist[i], { decodeEntities: false });
                        for (var j = 0; j < $("a").length; j++) {
                            //console.log($("a")[j].attribs.href);
                            //console.log($("a")[j].children[0].data.substr(0,1));
                            if ($("a")[j].children[0]) {
                                if ($("a")[j].children[0].data) {
                                    if ($("a")[j].children[0].data.substr(0, 1) == "@") {
                                        //获取所有@记录
                                        //console.log($("a")[j].children[0].data);
                                        if (mainuserslist[$("a")[j].children[0].data] == null) {
                                            mainuserslist[$("a")[j].children[0].data] = 1;
                                        } else if (mainuserslist[$("a")[j].children[0].data] == 0) {
                                            mainuserslist[$("a")[j].children[0].data] = 1;
                                        }
                                        else {
                                            mainuserslist[$("a")[j].children[0].data] += 1;
                                        }
                                    }
                                }
                            }

                        }
                    }
                    var maxname;
                    var maxtimes = 0;
                    mainuserslist["@他的"] = null;
                    mainuserslist["@" + mainusername] = null;
                    for (var i in mainuserslist) {
                        if (mainuserslist[i] > maxtimes) {
                            maxname = i;
                            maxtimes = mainuserslist[i];
                        }
                    }
                    console.log(maxname + "     " + maxtimes);
                    console.log(mainuserslist);
                    GetOtherUid(maxname.substr(1));
                }
            });
    }
}

function GetOtherUid(name) {
    otherusername = name;
    var str = "https://weibo.cn/search/?pos=search&keyword=" + encodeURI(name) + "&suser=找人";
    superagent
        .post(str).charset()
        .set('Content-Type', 'application/json;charset=UTF-8')
        .set('Cookie', ServerCookie)
        .charset()
        .end(function (err, res) {
            if (err) {
                console.log("");
            }
            var $ = cheerio.load(res.text, { decodeEntities: false });
            //保存uid
            otherWeiboUid = ($("input[name='uidList']").attr("value").substr(0, 10));
            GetOtherPage(otherWeiboUid, 1);
        });
}

function GetOtherPage(uid, page) {
    //https://weibo.cn/u/3974015917?filter=0&page=1
    if (otherpagelist[page + 1] == null) {
        var str = "https://weibo.cn/u/" + uid + "?filter=0&page=" + page;
        superagent
            .get(str)
            .set('Content-Type', 'application/json;charset=UTF-8')
            .set('Cookie', ServerCookie)
            .charset()
            .end(function (err, res) {
                if (err) {
                    console.log("不是UID");
                }
                otherpagelist[page] = res.text;
                var $ = cheerio.load(res.text, { decodeEntities: false });
                //不为5说明不是最后一页
                console.log("第 " + page + " 页爬取完成");
                if ($("div#pagelist").children().children().children().length != 5) {
                    setTimeout(function () { GetOtherPage(uid, page + 1); }, 2000);
                } else {
                    for (var i = 1; otherpagelist[i] != null; i++) {
                        var $ = cheerio.load(otherpagelist[i], { decodeEntities: false });
                        for (var j = 0; j < $("a").length; j++) {
                            //console.log($("a")[j].attribs.href);
                            //console.log($("a")[j].children[0].data.substr(0,1));
                            if ($("a")[j].children[0]) {
                                if ($("a")[j].children[0].data) {
                                    if ($("a")[j].children[0].data.substr(0, 1) == "@") {
                                        //获取所有@记录
                                        //console.log($("a")[j].children[0].data);
                                        if (otheruserslist[$("a")[j].children[0].data] == null) {
                                            otheruserslist[$("a")[j].children[0].data] = 1;
                                        } else if (otheruserslist[$("a")[j].children[0].data] == 0) {
                                            otheruserslist[$("a")[j].children[0].data] = 1;
                                        }
                                        else {
                                            otheruserslist[$("a")[j].children[0].data] += 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var maxname;
                    var maxtimes = 0;
                    otheruserslist["@他的"] = null;
                    otheruserslist["@" + otherusername] = null;
                    for (var i in otheruserslist) {
                        if (otheruserslist[i] > maxtimes) {
                            maxname = i;
                            maxtimes = otheruserslist[i];
                        }
                    }
                    console.log(maxname + "     " + maxtimes);
                    console.log(otheruserslist);
                }
            });
    }
}


//获取状态
app.get('/status', function (req, res) {
    res.json({ ret_code: taskstatus, ret_msg: downonepagestatus });
});
//获取数据
app.get('/getdata', function (req, res) {
    console.log("调用了getdata接口");
    //console.log(req.query.type);
    //所有微博放在一个月中看（发送次数）
    if (req.query.type == "allinonemonth_weibomsgtimes") {
        var data = {};
        for (var i = 1; pagelist[i] != null; i++) {
            var $ = cheerio.load(pagelist[i], { decodeEntities: false });
            for (var j = 0; j < $("span.ct").length; j++) {
                //看是否是 xx月xx日格式
                //var _tmpstr = $("span.ct")[j].children[0].data;
                if ($("span.ct")[j].children[0].data.substr(2, 1) == "月") {
                    if (data[$("span.ct")[j].children[0].data.substr(3, 2)] == null) {
                        data[$("span.ct")[j].children[0].data.substr(3, 2)] = 0;
                    } else {
                        data[$("span.ct")[j].children[0].data.substr(3, 2)] += 1;
                    }
                } else if ($("span.ct")[j].children[0].data.substr(0, 1) == "今") {
                    if (data[new Date().getDate()] == null) {
                        data[new Date().getDate()] = 0;
                    }
                    if (new Date().getDate() < 10) {
                        var _tmpstr1 = new Date().getDate();
                        data["0" + _tmpstr1] += 1;
                    } else {
                        data[new Date().getDate()] += 1;
                    }
                } else {
                    if (data[$("span.ct")[j].children[0].data.substr(8, 2)] == null) {
                        data[$("span.ct")[j].children[0].data.substr(8, 2)] = 0;
                    } else {
                        data[$("span.ct")[j].children[0].data.substr(8, 2)] += 1;
                    }
                }
            }
        }
        //console.log(data);
        res.json(data);

    } else if (req.query.type == "contrast") {
        //对比数据
        //res.json({ ret_code: taskstatus, ret_msg: downonepagestatus });
        res.json({ mainusername: mainusername, otherusername: otherusername, mainuserslist: mainuserslist, otheruserslist: otheruserslist });
    }
});
//index函数
app.get('/index', function (req, res) {
    console.log("调用了status接口")
    res.sendfile("./public/index.html");
});
//开始接口
app.get('/start', function (req, res) {
    console.log("调用了start接口");
    weiboinfo.name = req.query.name;
    taskstatus = 1;
    pagelist = {};
    mainuserslist = {};
    mainusername = "";
    //对比weibo
    otherpagelist = {};
    otheruserslist = {};
    otherWeiboUid = 0;
    otherusername = "";

    if (req.query.isname == "true") {
        GetUidByName(req.query.name);
    } else {
        weiboinfo.uid = req.query.name;
        GetPage(weiboinfo.uid, 1);
    }
    res.json({ ret_code: 0 });
});

//测试函数
function test() {
    var name = "努力努力再努力x";
    var name1 = "me66ccff";
    var name2 = "广告小沙弥";
    var name3 = "2811025410";
    //var name3 = GetUidByName(name);
    //GetUidByName(name);
    //GetPage(name3, 1);
    //console.log();
};
test();




var server = app.listen(10086, function () {
    //var host = server.address().address
    //var port = server.address().port
    //console.log("访问地址为 http://%s:%s", host, port)
});