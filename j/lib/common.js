var util = {};
util.debug = false;
util.log = function() {
  if (util.debug) {
    console.log.apply(console, arguments);
  }
}
var ypObj;
util.getQueryString = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
function jsonp(json) {
    json.data = json.data || {};
    json.timeout = json.timeout || 0;
    json.callback = json.callback || 'callback';
    var fnName = 'jsonp_' + Math.random();
    fnName = fnName.replace('.', '');
    window[fnName] = function(result) {
        clearTimeout(jsonp_timer);
        json.success && json.success(result);
        json.complete && json.complete();
        oHead.removeChild(oS);
        window[fnName] = null ;
    };
    json.data[json.callback] = fnName;
    var arr = [];
    for (var i in json.data) {
        arr.push(i + '=' + encodeURIComponent(json.data[i]));
    }
    var sData = '&' + arr.join('&');
    var oS = document.createElement('script');
    oS.src = json.url + sData;
    var oHead = document.getElementsByTagName('head')[0];
    oHead.appendChild(oS);
    if (json.timeout) {
        var jsonp_timer = setTimeout(function() {
            json.error && json.error();
            json.complete && json.complete();
            oHead.removeChild(oS);
            window[fnName] = null ;
        }, json.timeout);
    }
}

/**
 * 登录
 */
// var tapclick = 'ontouchstart' in window ? "tap" : "click";
;(function(win, doc) {
  util.INTERFACE_USER = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r=http%3A%2F%2Fai.lottery.sina.com.cn%2Fuc%2Fm%2Fmyorder_m.shtml&amp;revalid=1';
  // util.INTERFACE_USER = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r='+encodeURIComponent(location.href)+'&amp;revalid=1';
  // 退出跳转
  util.INTERFACE_HOME_IN = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r=http%3A%2F%2Feuro.sina.cn%2Flottery%2F&amp;revalid=1';

  util.INTERFACE_HOME = 'http://passport.sina.cn/sso/logout?entry=wapsso&vt=4&r=http%3A%2F%2Feuro.sina.cn%2Flottery%2F';

  $(".js-login").attr("href", util.INTERFACE_HOME_IN);
  $(".loginout").attr("href", util.INTERFACE_HOME);

  var isLogin = window.checkLogin();
  // console.log('isLogin:' + isLogin);
  if (!isLogin) {
    //alert("未登录");
    $('.js-login').removeClass('js-login-r');
    $('.loginout').hide();
  } else {
    $('.js-login').addClass('js-login-r');
    $('.loginout').show();
    setWbInfo2();
    $(".js-login").attr("href", "http://ai.lottery.sina.com.cn/uc/m/myorder_m.shtml?from=euro");
  }

  $('.js-login-r').on("click", function() {
    var isLogin = window.checkLogin();
    // console.log('isLogin:' + isLogin);
    if (isLogin) {
      $('.js-login').addClass('js-login-r');
      $('.loginout').show();
      setWbInfo2();
      $(".js-login").attr("href", "http://ai.lottery.sina.com.cn/uc/m/myorder_m.shtml?from=euro");
      //假如需要登录跳转订单页面
      window.location.href = util.INTERFACE_USER;
      return false;
    }
  });
})(window, document, undefined);

function middleLogin(msg) {
  // var hurl = location.href.indexOf('m=');
  // var url = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r='+encodeURIComponent(location.href)+'&amp;revalid=1';
  url = 'http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r=http%3A%2F%2Feuro.sina.cn%2Flottery%2F&amp;revalid=1';
  windowOpen(url,"_self");
}
function setWbInfo2() {
  if(window.userInfo){
    util.wbId = userInfo.uid;
    $(".js-login").find("img").attr("src",userInfo.userface);

    var ckName = 'SINA_WB_LOCAL_NICKNAME';
    var ckNameId = 'SINA_WB_LOCAL_NICKNAME_UID';
    var ckDomain = 'sina.com.cn';
    setSinaWbCookie(ckName, userInfo.uname, ckDomain, 0);
    setSinaWbCookie(ckNameId, userInfo.uid, ckDomain, 0);
    // 拿到购买数据

    // 登录成功之后  验证是否已经购买过比赛。  需要测试
    if(window.match_num && (window.curpagename!='mtop')){
      for(var i=0; i<match_num; i++){
        $("#smart_box_0"+i).show();
        gsmart.controller(i);
      }
    }
  } else {
    var url = 'https://passport.sina.cn/sso/islogin?';
    if (url.indexOf('?') == -1) {
      url = url + '?';
    }
    var oDate = new Date();
    var data = {
      random: Math.random(),
      time: oDate.getTime()
    }
    jsonp({
      success: function(rs) {
        rs.data = rs.data || {};
        rs.data.uname = rs.data.nick;
        rs.data.userface = rs.data.portrait_url;
        // if (rs.data.islogin && rs.data.uid) {
        //   setCookie('sina_ucode', convNum(rs.data.uid), 240, '/', '.sina.cn');
        // }
        
        window.userInfo = rs.data;
        util.wbId = rs.data.uid;
        $(".js-login").find("img").attr("src",rs.data.userface);

        var ckName = 'SINA_WB_LOCAL_NICKNAME';
        var ckNameId = 'SINA_WB_LOCAL_NICKNAME_UID';
        var ckDomain = 'sina.com.cn';
        setSinaWbCookie(ckName, rs.data.uname, ckDomain, 0);
        setSinaWbCookie(ckNameId, rs.data.uid, ckDomain, 0);
        // 拿到购买数据
        if(window.match_num && (window.curpagename!='mtop')){
          for(var i=0; i<match_num; i++){
            $("#smart_box_0"+i).show();
            gsmart.controller(i);
          }
        }
      },
      error: function() {

      },
      url: url,
      data: data,
      timeout: 3000
    })
  }
}


function windowOpen(url, target) {
  var a = document.createElement("a");
  a.setAttribute("href", url);
  if (target == null) {
    target = '_blank';
  }
  a.setAttribute("target", target);
  document.body.appendChild(a);
  if (a.click) {
    a.click();
  } else {
    try {
      var evt = document.createEvent('Event');
      a.initEvent('click', true, true);
      a.dispatchEvent(evt);
    } catch (e) {
      window.open(url);
    }
  }
  document.body.removeChild(a);
}

function setSinaWbCookie(name, value, domain, expires) {
  domain = domain || document.domain;
  if (typeof(expires) == 'undefiend' || expires == null || expires == '') {
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=" + "/" + "; domain=" + domain;
  } else {
    var expTimes = expires * 1000;
    var expDate = new Date();
    expDate.setTime(expDate.getTime() + expTimes);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expDate.toGMTString() + "; path=" + "/" + "; domain=" + domain;
  }
}

function getSinaWbCookieVal(name) {
  var cookieArr = document.cookie.replace(/\s/g, "").split(';');
  for (var i = 0; i < cookieArr.length; i++) {
    var tempObj = cookieArr[i].split('=');
    if (tempObj[0] == name)
      return decodeURIComponent(tempObj[1]);
  }
  return null;
}

//获取定位的top值
function getScrollTop(id) {
  var topHeight = 0;
  var scrollTop = 0;

  var obj = document.getElementById(id);
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
  }

  objHeight = (document.documentElement.clientHeight - obj.offsetHeight) / 2 + scrollTop - 120;
  return objHeight;
}


util.windowOpen = function(url,target){
  var a = document.createElement("a");
  a.setAttribute("href", url);
  if(target == null){
    target = '_blank';
  }
  a.setAttribute("target", target);
  document.body.appendChild(a);
  if(a.click){
    a.click();
  }else{
    try{
      var evt = document.createEvent('Event');
      a.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }catch(e){
      window.open(url);
    }
  }
  document.body.removeChild(a);
}

util.dateFormatFmt = function (date, fmt) { 
  if(Object.prototype.toString.call(date) == "[object String]"){
    date = date.replace(/-/g, '/');
  }
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
util.getQueryString = function(name) {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null) return decodeURIComponent(r[2]); return null;
}
util.byId = function(id) {
  return document.getElementById(id)
}
// jsonp
util.jsonp = function(url, callback, callbackName) {
  if (!url) {
    return;
  }
  var head = document.getElementsByTagName('head')[0];
  var ojs = util.byId(url);
  ojs && head.removeChild(ojs);
  if (url.indexOf('?') === -1) {
    url += '?callback=';
  } else {
    url += '&callback=';
  }
  url += callbackName;
  var remote_script = document.createElement('script');
  window[callbackName] = function(data) {
    callback && callback(data);
  }
  remote_script.src = url;
  remote_script.id = url;
  remote_script.type = 'text/javascript';
  remote_script.language = "javascript";
  head.appendChild(remote_script);
};
util.extend = function(target, source, deep) {
  target = target || {};
  var sType = typeof source,
    i = 1,
    options;
  if (sType === 'undefined' || sType === 'boolean') {
    deep = sType === 'boolean' ? source : false;
    source = target;
    target = this;
  }
  if (typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]') {
    source = {}
  }
  while (i <= 2) {
    options = i === 1 ? target : source;
    if (options !== null) {
      for (var name in options) {
        var src = target[name],
          copy = options[name];
        if (target === copy) {
          continue
        }
        if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
          target[name] = this.extend(src || (copy.length !== null ? [] : {}), copy, deep)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
    i++
  }
  return target
}

util.viewData = function() {
  var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
  var j = window, h = document, k = h.documentElement;
  e = k.clientWidth || h.body.clientWidth || 0;
  l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
  g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
  i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
  f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
  m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
  return {scrollTop: g,scrollLeft: i,documentWidth: f,documentHeight: m,viewWidth: e,viewHeight: l};
};

util.cookie = (function(doc, win){
  return {
    getItem: function(key){
      var cookieKey = key + '=';
      var result = '';
      if(doc.cookie.length > 0){
        var index = doc.cookie.indexOf(cookieKey);
        if(index != -1){
          index += cookieKey.length;
          var lastIndex = doc.cookie.indexOf(';', index);
          if(lastIndex == -1){
            lastIndex = doc.cookie.length;
          }
          result = win.decodeURIComponent(doc.cookie.substring(index, lastIndex));
        }
      }
      return result;
    },
    setItem: function(key, value, expiresDays){
      var time = new Date();
      if(expiresDays){
        //将time设置为 expiresDays 天以后的时间 
        time.setTime(time.getTime()+expiresDays*24*3600*1000); 
      } else {
        time.setFullYear(time.getFullYear() + 1);
      }

      if (expiresDays == 0) {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + ';';
      } else {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + '; expires=' + time.toGMTString() + ';';
      }
      
    },
    removeItem: function(key){
      // alert(key);
      var time = new Date();
      time.setDate(time.getDate()-1); 
      doc.cookie = key + '=0; expires=' + time.toGMTString();
      // alert(util.cookie.getItem("fstar_cityLoc"));
    //   var self = this;
    //   var exp = new Date();
    //   exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
    //   var cval = self.getItem(key);
    //   alert(cval);
    //   document.cookie = key + "=" + cval + "; expires=" + exp.toGMTString();
      // alert(key);
      // alert(util.cookie.getItem(key));
      var cval = util.cookie.getItem(key);
      if(cval){
        util.cookie.setItem(key, "0");
      }
    }
  };
})(document, window);

util.storage = (function(doc, win){
  var localStorage = window.localStorage;
  // 优先使用localStorage
  if(localStorage){
    return {
      getItem: function(key){
        return localStorage.getItem(key);
      },
      setItem: function(key, value){
        // 在一些设备下, setItem之前必须调用removeItem
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      },
      removeItem: function(key){
        localStorage.removeItem(key);
      }
    };
  } else {
    return {
      getItem: util.cookie.getItem,
      setItem: util.cookie.setItem,
      removeItem: util.cookie.removeItem
    };
  }
})(document, window);


util.alert = function(msg){
  $('#popup_msg').html(msg);
  popupShow($popup_msg);
}

/**
 *支付模块
 */
// 3种玩法 玩法类型:z_sx(上下盘) z_spf(胜平负) z_dx(大小球)  默认z_sx

var euro_gameType = 'z_sx';
var euro_gameTypeArr = ['z_sx','z_spf','z_dx'];
var euro_pankou = '';
var euro_hostTeam = '';
var euro_awayTeam = '';
var euro_matchTime = '';
// 用户id nba_-param_sm
var euro_memberid = '';
// 订单id nba_-param_so
var euro_orderid= '';
// 比赛id nba_-param_sb
var euro_matchid= '';

util.wbId = '';
util.payduing={};
util.money = {};
util.payment = {
  getwbid: function(){
    //判断登录状态
    var isLogin = window.checkLogin();
    if(!isLogin){
      return false;
    } else {
      var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
      var uId = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME_UID');
      euro_wbId = util.wbId || uId; 
      return euro_wbId;
    }
  },
  checkwbid: function(){
    // 再次判断一次wbId
    if(euro_wbId){
      return euro_wbId;
    } else {
      var isLogin = window.checkLogin();
      if(!isLogin){
        util.alert('请登录');
        return false;
      } else {
        var uId = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME_UID');
        euro_wbId = util.wbId || uId; 
        if(!euro_wbId){
          util.alert('未获取到微博id');
          return false;
        }
        return euro_wbId;
      }
    }
  },
  payStep0: function(thirdId, matchId, gameType, isShow){
    var self = this;
    // 再次判断一次wbId
    if(!thirdId){
      return;
    }

    var self = this;
    $.ajax({
      url:'http://odds.sports.sina.com.cn/odds/uefa/ckPro?thirdId='+thirdId+'&gameType='+gameType+'&matchId='+matchId+'&format=json',
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"ckPro_step0_"+matchId +"_"+gameType,
      type:"get",
      success: function(data) {
          // data = {
          //   "result":  {
          //     "status":  {
          //       "code": 0,
          //       "msg": ""
          //     },
          //     "matchId":matchId,
          //     "thirdId":"1247653442",
          //     "gameType":gameType,
          //     "member_id": "519526",
          //     "data": {
          //       "hostWinPro":'',//'上盘概率'
          //       "awayWinPro":0.35,//'下盘概率'
          //       "pinWinPro":0.35,
          //       "awayScore":0,
          //       "hostScore":0,
          //       "pankou":"1/1.25",//'上下盘盘口'
          //       "forecastResult":1, //0（未给出结果），－1（错），1（准）
          //       "matchStatus":3  //1(未赛)，2（赛中），3（完赛）
          //     }
          //   }
          // }
        var rdata = data.result;
        if (rdata.status.code === 0) {
          render_smart(data.result, isShow);
        }
      }
    });
  },
  // step1 点击购买小炮预测验证比赛id  获取相应的数据
  payStep1: function(thirdId, matchId, gameType, pankou, hostTeam, awayTeam, matchTime, ismd){
    // 再次判断一次wbId getwbid
    var self = this;
    if(!thirdId){
      self.checkwbid();
      thirdId = euro_wbId;
    }

    // 为下一步点击立即支付按钮全局存储信息
    euro_matchid = matchId;
    euro_gameType = gameType;
    euro_pankou = pankou;
    euro_hostTeam = hostTeam;
    euro_awayTeam = awayTeam;
    euro_matchTime = matchTime;

    $.ajax({
      url:'http://odds.sports.sina.com.cn/odds/uefa/ckPro?thirdId='+thirdId+'&gameType='+gameType+'&matchId='+matchId+'&format=json',
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"ckPro_step1_"+matchId+"_"+gameType,
      type:"get",
      success: function(data) { 
        // if(gameType == 'z_sx'){
        //   data = {
        //         "result":  {
        //           "status":  {
        //             "code": 405,
        //             "msg": ""
        //           },
        //           "matchId":"139180",
        //           "thirdId":"1247653442",
        //           "gameType":"z_sx",
        //           "member_id": "519526",
        //           "data": {
        //             "hostWinPro":0.65,//'上盘概率'
        //             "awayWinPro":0.35,//'下盘概率'
        //             "pinWinPro":0.75,
        //             "awayScore":0,
        //             "hostScore":0,
        //             "pankou":"1/1.25"//'上下盘盘口'
        //           }
        //         }
        //       }
        // } else if(gameType == 'z_spf'){
        //   data = {
        //         "result":  {
        //           "status":  {
        //             "code": 405,
        //             "msg": ""
        //           },
        //           "matchId":"139180",
        //           "thirdId":"1247653442",
        //           "gameType":"z_spf",
        //           "member_id": "519526",
        //           "data": {
        //             "hostWinPro":0.35,//'上盘概率'
        //             "awayWinPro":0.35,//'下盘概率'
        //             "pinWinPro":0.35,
        //             "awayScore":0,
        //             "hostScore":0,
        //             "pankou":"2.5"//'上下盘盘口'
        //           }
        //         }
        //       }
        // } else {
        //   data = {
        //         "result":  {
        //           "status":  {
        //             "code": 0,
        //             "msg": ""
        //           },
        //           "matchId":"139180",
        //           "thirdId":"1247653442",
        //           "gameType":"z_dx",
        //           "member_id": "519526",
        //           "data": {
        //             "hostWinPro":0.35,//'上盘概率'
        //             "awayWinPro":0.35,//'下盘概率'
        //             "pinWinPro":0.35,
        //             "awayScore":0,
        //             "hostScore":0,
        //             "pankou":"3.5/4"//'上下盘盘口'
        //           }
        //         }
        //       }
        // }
        
        //   0:成功返回预测结果数据
        // 400:玩法类型格式错误
        // 400:用户未登录或ID不匹配
        // 400:比赛ID不存在
        // 300:未绑定手机号码
        // 402:暂无单场的购买记录
        // 405:未购买当前玩法预测数据
        // 500:暂时没有本场预测数据
        var code = data.result.status.code;
        if (code === 0) {
          var rdata = data.result;
          euro_memberid = rdata.member_id;
          if(ismd){
            render_md_haspay(rdata);
          } else {
            render_smart(rdata);
          }
          
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
          return;
        } else if(code == 405 || code == 402){
          //405订单是未支付的,当前页面弹出充值提示  402没有单场购买记录
          var strpankou = (pankou == 'z_spf')? '':('&pankou='+pankou);
          $.ajax({
            url:'http://ai.lottery.sina.com.cn/zc/order/dc.htm?thirdId='+thirdId+'&matchId='+matchId+'&gameType='+gameType+strpankou,
            dataType:'jsonp',
            data: {},
            cache: true,
            jsonpCallback:"dc_"+matchId,
            type:"get",
            success: function(dcdata) {
              var code = dcdata.code;
              if( code && (code == "201" || code == "200")){
                // 获取真实的价格
                $.ajax({
                  url:'http://odds.sports.sina.com.cn/uefa/userCurPrice?thirdId='+thirdId+'&matchID='+matchId+'&price=29&format=json',
                  dataType:'jsonp',
                  data: {},
                  cache: true,
                  jsonpCallback:"userCurPrice_"+matchId,
                  type:"get",
                  success: function(data) {
                    // data = {
                    //   "result":  {
                    //     "status":  {
                    //     "code": 0,
                    //     "msg": ""
                    //     },
                    //     "source_pirce": 29,//原价
                    //     "data":  {
                    //     "price": 1//当前适用价格
                    //     }
                    //   }
                    // };
                    // 显示弹出层
                    var result = data.result;
                    if(result.source_pirce != result.data.price ){
                      $(".popup_money").html(result.data.price+"元<em>"+result.source_pirce+"元</em>");
                    } else{
                      $(".popup_money").html(result.data.price+"元");
                    }
                    util.money[matchId] = result.data.price;
                    popupShow($popup);
                  }
                });
              } else if (code == 300) { //未关联注册  
                var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
                registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
                return;
              } else {
                util.alert(dcdata.msg);
              }
            }
          });
        } else {
          util.alert(data.result.status.msg);
        }
      }
    });
  },
  
  // step2 点击弹出层立即支付按钮 先验证是否存在订单号
  payStep2: function(thirdId,matchId,gameType,pankou){
    // 再次判断一次wbId getwbid
    var self = this;
    if(!thirdId){
      self.checkwbid();
      thirdId = euro_wbId;
    }
    var strpankou = pankou == 'z_spf'? '':('&pankou='+pankou);
    $.ajax({
      url:'http://ai.lottery.sina.com.cn/zc/order/dc.htm?thirdId='+thirdId+'&matchId='+matchId+'&gameType='+gameType+strpankou,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"dc_"+matchId,
      type:"get",
      success: function(data) {
        // data = {"memberId":519526,"result":"success","code":200,"orderLogNo":"w"};
        var code = data.code;
        if( code && code == "201"){
          // 不存在订单号  直接 payStep3  生成订单号
          self.payStep3( util.wbId, euro_matchid, util.money[euro_matchid],data.memberId, euro_gameType, euro_pankou);
        } else if(code && code == "200"){
          // 已存在订单号  1.打开新开页面paypre.html  2.显示弹出层 我已支付成功
          // data = {"matchId":"139180","memberId":519526,"gameType":"z_dx","pankou":"1/1.25","result":"success","code":200,"orderLogNo":"D1605261057018327995","hostTeam":" 法国","awayTeam":"罗马尼亚","matchTime":"2016-06-11 03:00"}
          data.matchId = euro_matchid;
          data.gameType = euro_gameType;
          data.pankou = euro_pankou;
          data.result = "success";
          data.code = 200;
          data.hostTeam = euro_hostTeam;
          data.awayTeam = euro_awayTeam;
          data.matchTime = euro_matchTime;
          euro_memberid = data.memberId;
          self.payStepToPaypre(data);

          euro_orderid = data.orderLogNo;
          popupShow($popup_canpay);
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
          return;
        } else {
          util.alert(data.msg);
        }
      }
    });
  },
  /**
   * wiki:
   http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=101711874
   */ 
  // step3 点击弹出层立即支付按钮 没有订单号 生成订单号
  payStep3: function(thirdId,matchID,price,memberId,gameType,pankou){
    // 再次判断一次wbId getwbid
    var self = this;
    if(!thirdId){
      self.checkwbid();
      thirdId = euro_wbId;
    }
    $.ajax({
      url:'http://odds.sports.sina.com.cn/uefa/dcToPay?format=json',
      data: {
        thirdId:thirdId,
        matchId:matchID,
        price:price,
        memberId:memberId,
        gameType:gameType,
        pankou:pankou
      },
      cache: true,
      type:"post",
      success: function(data) {
        // data = {"matchId":"139180","memberId":519526,"gameType":"z_dx","pankou":"1/1.25","result":"success","code":200,"orderLogNo":"D1605261057018327995","hostTeam":" 法国","awayTeam":"罗马尼亚","matchTime":"2016-06-11 03:00"}
        var code = data.code;
        if(code && code == "200"){
          // 生成订单号  1.打开新开页面paypre.html  2.显示弹出层 我已支付成功
          self.payStepToPaypre(data);

          euro_orderid = data.orderLogNo;
          euro_memberid = data.memberId;
          popupShow($popup_canpay);
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
          return;
        } else {
          util.alert(data.msg);
        }
      }
    });
  },
  // 打开页面 ./payper.htm
  payStepToPaypre: function(data){
    var self = this;
    var self = this;

    var self = this;
    var info = JSON.stringify(data);
    var thirdId = euro_wbId || util.wbId;
    var price = util.money[data.matchId];

    var actionUrl = 'http://odds.sports.sina.com.cn/uefa/prePay?info='+info+'&thirdId='+thirdId + '&price='+price;
    window.newWin.location.href = actionUrl;
    
    // var actionUrl = 'http://odds.sports.sina.com.cn/uefa/prePay';
    // var payForm = document.createElement("form");
    // //一定要加入到body中！！   
    // document.body.appendChild(payForm);
    // payForm.method = 'post';
    // payForm.action = actionUrl;
    // payForm.id = 'pay_form';
    // payForm.target = '_blank';

    // //创建隐藏表单1
    // var input1 = document.createElement("input");
    // input1.setAttribute("name", "info");
    // input1.setAttribute("type", "hidden");
    // input1.setAttribute("value", JSON.stringify(data));
    // payForm.appendChild(input1);

    // //创建隐藏表单2
    // var input2 = document.createElement("input");
    // input2.setAttribute("name", "thirdId");
    // input2.setAttribute("type", "hidden");
    // input2.setAttribute("value", util.wbId);
    // payForm.appendChild(input2);

    // //创建隐藏表单3
    // var input3 = document.createElement("input");
    // input3.setAttribute("name", "price");
    // input3.setAttribute("type", "hidden");
    // input3.setAttribute("value", util.money[data.matchId]);
    // payForm.appendChild(input3);

    // payForm.submit();
    // document.body.removeChild(payForm);
  },
  
  // step4 在新页面 http://ai.lottery.sina.com.cn//nba/payweb/pre.htm 立即支付按钮
  payStep4: function(orderNo,memberId,matchId,chargeWay){
    var self = this;
    $.ajax({
      url:'http://ai.lottery.sina.com.cn/zc/order/dcPay.htm?orderNo='+orderNo+'&memberId='+memberId+'&matchId='+matchId+'&chargeWay='+chargeWay,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"dcPay_"+matchId,
      type:"get",
      success: function(data) {
        var code = data.code;
        // util.windowOpen("http://ai.lottery.daily.2caipiao.com/sina-payment/charge.do?gameType=z_dx&amount=29.00&clientType=4&chargeWay=4&matchId=139180&memberId=519526&sign=99db726978f67fd12d8ebcf89f12c20f&orderNo=D1605261057018327995",'_self');
        if(code && code == "200"){
          // 跳转到真正的支付页面
          util.windowOpen(data.redirectURL,'_self');
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
          return;
        } else {
          util.alert(data.msg);
        }
      }
    });
  },
  
  // step5 弹出层 我已支付成功按钮
  payStep5: function(orderNo,memberId,matchId,gameType, ismd){
    var self = this;
    var url = '';
    if(orderNo){
      // url = 'http://ai.lottery.sina.com.cn/zc/order/dcSuc.htm?orderNo='+orderNo+'&memberId='+memberId+'&matchId='+matchId+'&gameType='+gameType;
      url = 'http://odds.sports.sina.com.cn/uefa/dcSuc?format=json&orderNo='+orderNo+'&memberId='+memberId+'&matchId='+matchId+'&gameType='+gameType;
    } else {
      url = 'http://odds.sports.sina.com.cn/uefa/dcSuc?format=json&orderNo=&memberId='+util.wbId+'&matchId='+matchId+'&gameType='+gameType;
    }
    $.ajax({
      url:url,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"dcSuc_"+gameType +"_"+matchId,
      type:"get",
      success: function(data) {
        // data = {"matchId":"139180","memberId":519526,"orderNo":"D1605261057018327995","gameType":"z_dx","result":"success","code":200,"hostWinPro":5629,"awayWinPro":4370,"pinWinPro":0,"awayScore":0,"hostScore":0,"pankou":"1/1.25"}
        var code = data.result.status && data.result.status.code;
        if(code ===0){
          // 渲染数据render
          // data = {
          //   "result":  {
          //     "status":  {
          //       "code": 0,
          //       "msg": ""
          //     },
          //     "matchId":"139180",
          //     "thirdId":"1247653442",
          //     "gameType":gameType,
          //     "member_id": "519526",
          //     "data": {
          //       "hostWinPro":0.35,//'上盘概率'
          //       "awayWinPro":0.35,//'下盘概率'
          //       "pinWinPro":0.35,
          //       "awayScore":0,
          //       "hostScore":0,
          //       "pankou":"1/1.25"//'上下盘盘口'
          //     }
          //   }
          // }
          if(ismd){
            render_md_haspay(data.result);
          } else {
            render_smart(data.result);
          }
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
          return;
        } else {
          util.alert(data.result.status.msg);
        }
      }
    });
  },

  // step10 数据页面进入页面直接验证比赛id 获取相应的数据
  payStep10: function(thirdId, matchId, isArr){
    // 再次判断一次wbId getwbid
    var self = this;
    if(!thirdId){
      thirdId = self.getwbid();
      if(!thirdId){return;}
    }

    var self = this;
    for(var i=0,len=euro_gameTypeArr.length; i<len; i++){
      var gameType = euro_gameTypeArr[i];
      if(isArr[i] != 1){ continue;}
      (function(gameType){
        $.ajax({
          url:'http://odds.sports.sina.com.cn/odds/uefa/ckPro?thirdId='+thirdId+'&gameType='+gameType+'&matchId='+matchId+'&format=json',
          dataType:'jsonp',
          data: {},
          cache: true,
          jsonpCallback:"md_ckPro_step0_"+matchId+"_"+gameType,
          type:"get",
          success: function(data) {
            // data = {
            //   "result":  {
            //     "status":  {
            //       "code": 0,
            //       "msg": ""
            //     },
            //     "matchId":matchId,
            //     "thirdId":"1247653442",
            //     "gameType":gameType,
            //     "member_id": "519526",
            //     "data": {
            //       "hostWinPro":0.65,//'上盘概率'
            //       "awayWinPro":0.35,//'下盘概率'
            //       "pinWinPro":0.35,
            //       "awayScore":0,
            //       "hostScore":0,
            //       "pankou":"1/1.25",//'上下盘盘口'
            //       "forecastResult":1, //0（未给出结果），－1（错），1（准）
            //       "matchStatus":3  //1(未赛)，2（赛中），3（完赛）
            //     }
            //   }
            // }
            var rdata = data.result;
            if (rdata.status.code === 0) {
              render_md_haspay(data.result);
            }
          }
        });
      })(gameType);
    }
    
  },
  openPage: function(){
    window.newWin = window.open('http://sports.sina.com.cn/js/euro2016_lottery/pay_mid_page.html','_blank');
    util.payment.payStep2(util.wbId, euro_matchid, euro_gameType, euro_pankou);
  }
}

// 显示相应的弹层
function popupShow($layout) {
  var viewData = util.viewData();
  var layout = $layout[0];
  document.body.style.overflow = 'hidden';
  $popup_box.hide();
  $layout.show();
  layout.style.visibility = "hidden";
  var cHeight = layout.offsetHeight;
  layout.style.marginTop = (viewData.viewHeight / 2 - cHeight / 2 - 30) + 'px';
  $mask.show();
  layout.style.visibility = "visible";
};
// 隐藏弹层
function popupHide() {
  document.body.style.overflow = 'auto';
  $mask.hide();
  $popup_box.hide();
}
// 渲染预测render_smart  赛前购买后
function render_smart(data, isShow){
  //已购买成功和已开赛 已结束的比赛
  // 隐藏弹出层
  popupHide();
  var matchId = data.matchId;
  var gameType = data.gameType;
  var rdata = data.data;
  var idx = $("#m_match_list").find(".selected").data("idx");
  if(isShow || !idx){ idx = $('#smart_'+matchId).data("idx") || 0; }

  var cdata = match_data.data[idx];
  if(rdata.hostWinPro == ''){
    cdata.per1 = '';
    cdata.per2 = '';
    cdata.per3 = '';
    cdata.hscore = '';
    cdata.gscore = '';
    cdata.nodata = '智能数据正在分析中';
    html = template('smart_match_pre_'+gameType+'_haspay_tmp', {data: cdata});
    $('#smart_'+matchId)[0].innerHTML = html;
    return;
  }
  var per1 = Math.round((rdata.hostWinPro-0)*100),
      per2 = rdata.pinWinPro && Math.round((rdata.pinWinPro-0)*100),
      per3 = Math.round((rdata.awayWinPro-0)*100),
      hscore = rdata.hostScore,
      gscore = rdata.awayScore;
  
  
  cdata.per1 = per1 +'%';
  cdata.per2 = per2 +'%';
  cdata.per3 = per3 +'%';
  cdata.hscore = hscore;
  cdata.gscore = gscore;
  if(gameType == 'z_spf'){
    cdata.pw = (per2+per3)+'%';
    cdata.pw1 = per3 +'%';
  } else {
    cdata.pw = per3 +'%';
  }
  // render 显示盘口分数和比分条
  var html = template('smart_match_pre_'+gameType+'_haspay_tmp', {data: cdata});
  $('#smart_'+matchId)[0].innerHTML = html;
}
// 渲染预测render_smart_in 赛中
function render_smart_in(data, isShow){
  //赛中
  // 隐藏弹出层
  popupHide();
  var matchId = data.matchId;
  var gameType = data.gameType;
  var rdata = data.om;

  // 'upperTapePro':0.35,//'上盘概率'
  // 'lowTapePro':0.35, //'下盘概率'
  // 'ULTape':2.5, //'上下盘盘口'
  // 'DXbigPro' :0.35, //'大分概率'
  // 'DXsmallPro':0.35, //'小分概率'
  // 'DXTape' :3.5/4 '大小分盘口'
  // 'SPFwinPro' :0.35, //'胜平负胜率'
  // 'SPFdrawPro' :0.35,//'胜平负平率'
  // 'SPFlosePro' :0.35, //'胜平负负率'
  var per1,per2,per3,pankou;
  if(gameType == 'z_sx'){
    per1 = Math.round((rdata.upperTapePro-0)*100);
    per2 = '';
    per3 = Math.round((rdata.lowTapePro-0)*100);
    pankou = rdata.ULTape;
  } else if(gameType == 'z_spf'){
    per1 = Math.round((rdata.SPFwinPro-0)*100);
    per2 = Math.round((rdata.SPFdrawPro-0)*100);
    per3 = Math.round((rdata.SPFlosePro-0)*100);
    pankou = '';
  } else  if(gameType == 'z_dx'){
    per1 = Math.round((rdata.DXbigPro-0)*100),
    per2 = '',
    per3 = Math.round((rdata.DXsmallPro-0)*100),
    pankou = rdata.DXTape;
  } else {
    per1 = Math.round((rdata.upperTapePro-0)*100);
    per2 = '';
    per3 = Math.round((rdata.lowTapePro-0)*100);
    pankou = rdata.ULTape;
  }

  var idx = $("#m_match_list").find(".selected").data("idx");
  if(isShow || !idx){ idx = $('#smart_'+matchId).data("idx") || 0; }
  var cdata = match_data.data[idx];
  cdata.per1 = per1 +'%';
  cdata.per2 = per2 +'%';
  cdata.per3 = per3 +'%';
  cdata.pankou = pankou;
  if(gameType == 'z_spf'){
    cdata.pw = (per2+per3)+'%';
    cdata.pw1 = per3 +'%';
  } else {
    cdata.pw = per3 +'%';
  }
  // render 显示盘口分数和比分条
  var html = template('smart_match_in_'+gameType+'_tmp', {data: cdata});
  $('#smart_'+matchId)[0].innerHTML = html;
} 
// 渲染预测render_smart_end 赛后
function render_smart_end(data, isShow){
  //赛后
  // 隐藏弹出层
  popupHide();
  var matchId = data.matchId;
  var gameType = data.gameType;
  var rdata = data.om;

  // 'upperTapePro':0.35,//'上盘概率'
  // 'lowTapePro':0.35, //'下盘概率'
  // 'ULTape':2.5, //'上下盘盘口'
  // 'DXbigPro' :0.35, //'大分概率'
  // 'DXsmallPro':0.35, //'小分概率'
  // 'DXTape' :3.5/4 '大小分盘口'
  // 'SPFwinPro' :0.35, //'胜平负胜率'
  // 'SPFdrawPro' :0.35,//'胜平负平率'
  // 'SPFlosePro' :0.35, //'胜平负负率'
  // "ULforecastResult":1, //0（未给出结果），2（错），1（准）3(走)
  // "SPFforecastResult":2, //0（未给出结果），2（错），1（准）3(走)
  // "DXforecastResult":1, //0（未给出结果），2（错），1（准）3(走)
  // "matchStatus":3  //1(未赛)，2（赛中），3（完赛）
  var per1,per2,per3,pankou,forecast;
  var FORECASTRESULT = ['','smart_mc_win','smart_mc_lose','smart_mc_zou'];
  if(gameType == 'z_sx'){
    per1 = Math.round((rdata.upperTapePro-0)*100);
    per2 = '';
    per3 = Math.round((rdata.lowTapePro-0)*100);
    pankou = rdata.ULTape;
    forecast = FORECASTRESULT[rdata.ULforecastResult];
    // if(matchId == '139180' || matchId == '139181'){
    //   forecast = 'smart_mc_zou';
    // }
  } else if(gameType == 'z_spf'){
    per1 = Math.round((rdata.SPFwinPro-0)*100);
    per2 = Math.round((rdata.SPFdrawPro-0)*100);
    per3 = Math.round((rdata.SPFlosePro-0)*100);
    pankou = '';
    forecast = FORECASTRESULT[rdata.SPFforecastResult];
  } else  if(gameType == 'z_dx'){
    per1 = Math.round((rdata.DXbigPro-0)*100),
    per2 = '',
    per3 = Math.round((rdata.DXsmallPro-0)*100),
    pankou = rdata.DXTape;
    forecast = FORECASTRESULT[rdata.DXforecastResult];
  } else {
    per1 = Math.round((rdata.upperTapePro-0)*100);
    per2 = '';
    per3 = Math.round((rdata.lowTapePro-0)*100);
    pankou = ULTape;
    forecast = FORECASTRESULT[rdata.ULforecastResult];
  }

  var idx = $("#m_match_list").find(".selected").data("idx");
  if(isShow || !idx){ idx = $('#smart_'+matchId).data("idx") || 0; }
  var cdata = match_data.data[idx];
  cdata.per1 = per1 +'%';
  cdata.per2 = per2 +'%';
  cdata.per3 = per3 +'%';
  cdata.pankou = pankou;
  cdata.forecast = forecast;

  // render 显示盘口分数和比分条
  if(gameType == 'z_spf'){
    cdata.pw = (per2+per3)+'%';
    cdata.pw1 = per3 +'%';
  } else {
    cdata.pw = per3 +'%';
  }
  // render 显示盘口分数和比分条
  var html = template('smart_match_end_'+gameType+'_tmp', {data: cdata});
  $('#smart_'+matchId)[0].innerHTML = html;
}
// 比分条模板
function dataTmp(per1,per2,per3,gameType) {
  var _hm = "";
  if(gameType == 'z_spf'){
    _hm+='<div class="smart_spf_s"></div>';
    if(per2>0){
      var pw = Math.round(266*(per2+per3)/100);
      _hm+=('<div class="smart_spf_p">\
          <div class="smart_spf_pr"></div>\
          <div class="smart_spf_pc" style="width:'+pw+'px"></div>\
          <div class="smart_spf_pl"></div>\
        </div>');
      if(per3>0){
        var fw = Math.round(266*per3/100);
        _hm+=('<div class="smart_spf_f">\
            <div class="smart_spf_fr"></div>\
            <div class="smart_spf_fc" style="width:'+fw+'px"></div>\
            <div class="smart_spf_fl"></div>\
          </div>');
      }
    }
    _hm+=('<div class="smart_spf_info">\
        <div class="smart_spf_win"><em>'+per1+'%</em>胜</div>\
        <div class="smart_spf_draw"><em>'+per2+'%</em>平</div>\
        <div class="smart_spf_lose"><em>'+per3+'%</em>负</div>\
      </div>');
  } else {
    _hm+='<div class="smart_percent_red"></div>';
    if(per3>0){
      var pw = Math.round(266*per3/100);
      _hm+=('<div class="smart_percent_blue">\
          <div class="smart_percent_br"></div>\
          <div class="smart_percent_bc" style="width:'+pw+'px"></div>\
          <div class="smart_percent_bl"></div>\
        </div>');
    }
  }
  
  // var gp=50%;
  // if(hostPro<=0){ $percent_blue.hide();}
  // var pw = Math.round(260*gp/100);
  // $percent_bc.width(pw);
  // $toggle_next.show();
  return _hm;
}

// 转发到用户中心注册页面
function registerForm(wbId, nick, wbType) {
  var actionUrl = 'http://ai.lottery.sina.com.cn//uc/m/phoneBind_m.shtml?from=euro';
  var turnForm = document.createElement("form");
  //一定要加入到body中！！
  document.body.appendChild(turnForm);
  turnForm.method = 'post';
  turnForm.action = actionUrl;
  turnForm.id = 'jq_tmp_form';
  turnForm.target = '_blank';
  //创建隐藏表单
  var input1 = document.createElement("input");
  input1.setAttribute("name", "thirdId");
  input1.setAttribute("type", "hidden");
  input1.setAttribute("value", wbId);
  turnForm.appendChild(input1);

  //创建隐藏表单
  var input2 = document.createElement("input");
  input2.setAttribute("name", "thirdType");
  input2.setAttribute("type", "hidden");
  input2.setAttribute("value", wbType);
  turnForm.appendChild(input2);

  var input3 = document.createElement("input");
  input3.setAttribute("name", "nickName");
  input3.setAttribute("type", "hidden");
  input3.setAttribute("value", nick);
  turnForm.appendChild(input3);

  turnForm.submit();
  document.body.removeChild(turnForm);
}
