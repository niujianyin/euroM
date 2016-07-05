__inline('./lib/template.js');

var util = {};
util.debug = false;
util.log = function() {
  if (util.debug) {
    console.log.apply(console, arguments);
  }
}

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
    }
    ;
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
  util.INTERFACE_USER = 'http://euro.sina.cn/lottery/yp.html';
  util.INTERFACE_HOME = 'http://euro.sina.cn/lottery/';

  $(".js-login").attr("href", "http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r=http%3A%2F%2Feuro.sina.cn%2Flottery%2Fyp.html&amp;revalid=1");
  $(".loginout").attr("href", "http://passport.sina.cn/sso/logout?entry=wapsso&vt=4&r=http%3A%2F%2Feuro.sina.cn%2Flottery%2F");
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
  var url = "http://passport.sina.cn/signin/signin?entry=wapsso&vt=4&r=http%3A%2F%2Feuro.sina.cn%2Flottery%2Fyp.html&amp;revalid=1";
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
    if(ypObj && ypObj.getHasPurchase){
      ypObj.getHasPurchase();
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
        if(ypObj && ypObj.getHasPurchase){
          ypObj.getHasPurchase();
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

/**
 *支付模块
 */
// 3种玩法 玩法类型:z_sx(上下盘) z_spf(胜平负) z_dx(大小球)  默认z_sx
function registerForm(wbId, nick, wbType) {
  var actionUrl = 'http://ai.lottery.sina.com.cn//uc/m/phoneBind_m.shtml';
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
// 用户id nba_-param_sm
var euro_memberid = '';
var euro_memberid = '';
// 订单id nba_-param_so
var euro_orderid= '';
// 当前购买套餐内容
var euro_edata = {};
// 微博id
// var euro_wbId = '2007294495';
var euro_wbId = '';
util.payduing={};
util.money = {};
util.yppay = {
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
  // step1 点击购买小炮预测验证比赛id  获取相应的数据
  payStep1: function(){
    var self = this;
    self.checkwbid();
    var thirdId = euro_wbId;
    edata = euro_edata;
    var gameType = edata.gameType;
    var packType = edata.packType;
    var teamId = edata.id || '';

    $.ajax({
      url:'http://ai.lottery.sina.com.cn/zc/order/batch.htm?thirdId='+thirdId+'&gameType='+gameType+'&season=2015&packType='+packType+'&teamId='+teamId,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"batch_"+thirdId + '_' + gameType + '_' + packType,
      type:"get",
      success: function(data) { 
        // 200:有订单记录
        // 201:无订单记录
        // 300:未绑定手机号码
        util.log(data);
        var code = data.code;
        euro_orderid = '';
        if (code == 200) {
          euro_memberid = data.memberId;
          euro_orderid = data.orderLogNo;
          // 显示弹出层
          $(".popup_money").html('¥'+edata.price+"元");
          popupShow($popup);
          
        } else if(code == 201){
          euro_memberid = data.memberId;
          // 显示弹出层
          $(".popup_money").html('¥'+edata.price+"元");
          popupShow($popup);
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
        } else {
          util.alert(data.msg);
        }
      }
    });
  },
  
  // step2 点击弹出层立即支付按钮
  payStep2: function(){
    var self = this;
    self.checkwbid();
    var memberId = euro_memberid;
    var edata = euro_edata;
    var gameType = edata.gameType;
    var packType = edata.packType;
    var teamId = edata.id || '';
    var price = edata.price;
    if(euro_orderid){
      // 已存在订单号  1.打开新开页面paypre.html  2.显示弹出层 我已支付成功
      self.payStepToPaypre();
      popupShow($popup_canpay);
      return;
    }

    $.ajax({
      url:'http://ai.lottery.sina.com.cn/zc/order/batchToPay.htm?memberId='+memberId+'&gameType='+gameType+'&season=2015&packType='+packType+'&teamId='+teamId+'&price='+price,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"batchToPay_"+memberId+"_"+gameType+"_"+packType,
      type:"get",
      success: function(data) {
        var code = data.code;
        if(code && code == "200"){
          euro_orderid = data.orderLogNo;
          self.payStepToPaypre();
          popupShow($popup_canpay);
        }else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
        } else {
          util.alert(data.msg);
        }
      }
    });
  },
  // 打开页面 ./payperpack.htm
  payStepToPaypre: function(){
    var self = this;
    var self = this;
    euro_edata.memberId = euro_memberid;
    euro_edata.wbId = euro_wbId;
    euro_edata.orderLogNo = euro_orderid;
    var info = JSON.stringify(euro_edata);

    var thirdId = euro_wbId;
    var price = euro_edata.price;

    var actionUrl = 'http://odds.sports.sina.com.cn/uefa/prePayPack?info='+info+'&thirdId='+thirdId + '&price='+price;
    window.newWin.location.href = actionUrl;
    
    // var actionUrl = 'http://odds.sports.sina.com.cn/uefa/prePayPack';
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
    // euro_edata.memberId = euro_memberid;
    // euro_edata.wbId = euro_wbId;
    // euro_edata.orderLogNo = euro_orderid;
    // input1.setAttribute("value", JSON.stringify(euro_edata));
    // payForm.appendChild(input1);

    // //创建隐藏表单2
    // var input2 = document.createElement("input");
    // input2.setAttribute("name", "thirdId");
    // input2.setAttribute("type", "hidden");
    // input2.setAttribute("value", euro_wbId);
    // payForm.appendChild(input2);

    // //创建隐藏表单3
    // var input3 = document.createElement("input");
    // input3.setAttribute("name", "price");
    // input3.setAttribute("type", "hidden");
    // input3.setAttribute("value", euro_edata.price);
    // payForm.appendChild(input3);

    // payForm.submit();
    // document.body.removeChild(payForm);
  },

  // step4 在新页面 http://ai.lottery.sina.com.cn//nba/payweb/pre.htm 立即支付按钮
  payStep4: function(orderNo,memberId,chargeWay){
    var self = this;
    self.checkwbid();
    $.ajax({
      url:'http://ai.lottery.sina.com.cn/zc/order/batchPay.htm?memberId='+memberId+'&orderNo='+orderNo+'&chargeWay='+chargeWay,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"dcPay_"+orderNo+"_"+memberId+"_"+chargeWay,
      type:"get",
      success: function(data) {
        var code = data.code;
        // util.windowOpen("http://ai.lottery.daily.2caipiao.com/sina-payment/charge.do?gameType=z_dx&amount=29.00&clientType=4&chargeWay=4&matchId=139180&memberId=519526&sign=99db726978f67fd12d8ebcf89f12c20f&orderNo=D1605261057018327995",'_self');
        if(code && code == "200"){
          // 跳转到真正的支付页面
          util.windowOpen(data.redirectURL,'_self');
        }else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
        } else {
          util.alert(data.msg);
        }
      }
    });
  },

  // step5 弹出层 我已支付成功按钮
  payStep5: function(){
    var self = this;
    self.checkwbid();
    var url = '';
    var teamId = euro_edata.id || '';
    if(euro_orderid){
      url = 'http://ai.lottery.sina.com.cn/zc/order/batchSuc.htm?memberId='+euro_memberid+'&orderNo='+euro_orderid+'&gameType='+euro_edata.gameType+'&season=2015&packType='+euro_edata.packType+'&teamId='+teamId;
    } else {
      url = 'http://ai.lottery.sina.com.cn/zc/order/batchSuc.htm?memberId='+euro_memberid+'&orderNo=&gameType='+euro_edata.gameType+'&season=2015&packType='+euro_edata.packType+'&teamId='+teamId;
    }
    $.ajax({
      url:url,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"dcSuc_"+euro_edata.gameType+"_"+euro_edata.packType,
      type:"get",
      success: function(data) {
        var code = data.code;
        if(code == 200){
          location.reload(true);
        } else if (code == 300) { //未关联注册  
          var nickName = getSinaWbCookieVal('SINA_WB_LOCAL_NICKNAME');
          registerForm(thirdId, nickName, 1); //转发到用户中心注册页面
        } else {
          util.alert(data.msg);
        }
      }
    });
  },

  openPage: function(){
    window.newWin = window.open('http://sports.sina.com.cn/js/euro2016_lottery/pay_mid_page.html','_blank');
    util.yppay.payStep2();
  }
}

util.alert = function(msg){
  $('#popup_msg').html(msg);
  popupShow($popup_msg);
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



var ypObj = {
  getHasPurchase: function(){
    // 已经购买
    var self = this;
    if(!util.yppay.getwbid()){ return;}
    $.ajax({
      url:'http://ai.lottery.sina.com.cn/zc/psn/ckPack.htm?thirdId='+euro_wbId+'&season=2015',
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"ckPack",
      type:"get",
      success: function(data) {
        // data = {
        //   "result":"success",
        //   "code":200,
        //   "all":["z_dx"],
        //   "group":["z_dx","z_sx"],
        //   "out":["z_dx"],
        //   "team_934":["z_dx"],
        //   "team_933":[],
        //   "team_944":[],
        //   "team_922":[],
        //   "team_926":[],
        //   "team_924":[],
        //   "team_939":[],
        //   "team_821":["z_dx"],
        //   "memberId":519526
        // }
        if(data.code == 200){
          // 全赛事礼包 all
          if(data.all && data.all.length > 0){
            self.hasPurchase(__euro.yp_01, data.all);
          }
          
          // 小组赛礼包 group
          if(data.group && data.group.length > 0){
            self.hasPurchase(__euro.yp_02, data.group);
          }
          // 淘汰赛礼包 out
          if(data.out && data.out.length > 0){
            self.hasPurchase(__euro.yp_03, data.out);
          }
          // 真爱礼包 team
          // 德国 934
          if(data["team_934"] && data["team_934"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_934"], '934');
          }
          // 法国 933
          if(data["team_933"] && data["team_933"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_933"], '933');
          }
          // 西班牙 944
          if(data["team_944"] && data["team_944"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_944"], '944');
          }
          // 英格兰 922
          if(data["team_922"] && data["team_922"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_922"], '922');
          }
          // 意大利 926
          if(data["team_926"] && data["team_926"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_926"], '926');
          }
          // 比利时 924
          if(data["team_924"] && data["team_924"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_924"], '924');
          }
          // 葡萄牙 939
          if(data["team_939"] && data["team_939"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_939"], '939');
          }
          // 瑞典 821
          if(data["team_821"] && data["team_821"].length > 0){
            self.hasPurchaseTeam(__euro.yp_04, data["team_821"], '821');
          }
        }
        self.render();
      }
    });
  },
  hasPurchase: function(ypdata, yparr){
    for(var i=0,len=yparr.length; i<len; i++){
      if(yparr[i] == 'z_sx'){
        ypdata[0].status = '3';
      } else if(yparr[i] == 'z_spf'){
        ypdata[1].status = '3';
      } else if(yparr[i] == 'z_dx'){
        ypdata[2].status = '3';
      } else {
        ypdata[0].status = '3';
      }
    }
  },
  hasPurchaseTeam: function(ypdata, yparr, tid){
    for(var i=0,len=ypdata.length; i<len; i++){
      if(tid == ypdata[i].id){
        var ypdatacur = ypdata[i];
        for(var j=0,l=yparr.length; j<l; j++){
          if(yparr[j] == 'z_sx'){
            ypdatacur["z_sx"] = '3';
          } else if(yparr[j] == 'z_spf'){
            ypdatacur["z_spf"] = '3';
          } else if(yparr[j] == 'z_dx'){
            ypdatacur["z_dx"] = '3';
          } else {
            ypdatacur["z_sx"] = '3';
          }
        }
      }
    }
  },
  render: function(data){
    var self = this;
    template.helper("getMsg", function(data){
      return data.msg[data.status];  
    });
    template.helper("getPay", function(status){
      return status == '1'? 'yp_pay':'';  
    });
    var data_00 = __euro.yp_00;
    var html = template('yp_00_tmp', {data: data_00});
    $("#yp_00")[0].innerHTML = html;
    var data_01 = __euro.yp_01;
    var html = template('yp_01_tmp', {data: data_01});
    $("#yp_01")[0].innerHTML = html;
    var data_02 = __euro.yp_02;
    var html = template('yp_02_tmp', {data: data_02});
    $("#yp_02")[0].innerHTML = html;
    var data_03 = __euro.yp_03;
    var html = template('yp_03_tmp', {data: data_03});
    $("#yp_03")[0].innerHTML = html;

    template.helper("getTeamLi", function(status){
      return status == 3? 'yp_team_li_has':'yp_team_li';  
    });
    template.helper("getTeamBtn", function(status){
      return status == 1? 'yp_pay yp_team_pay_01':('yp_team_pay_0'+status);  
    });

    var data_04 = __euro.yp_04;
    var html = template('yp_04_tmp', {data: data_04});
    $("#yp_04")[0].innerHTML = html;
    $("#yp_04").find(".yp_team").each(function(index, el) {
      $(this).find(".yp_team_li").eq(0).addClass("selected");
    });
  },
  // 开幕礼包
  render05: function(){
    var curdate = __curdate || '2016-06-11';
    $.ajax({  
      url:'http://platform.sina.com.cn/sports_all/client_api?app_key=3207392928&_sport_t_=livecast&_sport_a_=dateMatches&LeagueType=9&begin='+curdate+'&end='+curdate,
      dataType:'jsonp',
      data: {},
      cache: true,
      jsonpCallback:"livecast",
      type:"get",
      success: function(data) {
        var result = data.result;
        var status = result && result.status;
        if(status && status.code == "0"){
          // console.log(result.data);
          template.helper("flag", function(flag){
            return 'http://n.sinaimg.cn/sports/0d703a2a/20160513/'+flag+'.png';  
          });
          template.helper("yp05Btn", function(idx){
            return 'yp_05_link0' + __euro.yp_05[idx].status;  
          });
          var html = template('yp_05_tmp', {data: result.data});
          $("#yp_05_main")[0].innerHTML = html;
        } else {
          util.log(result.status && result.status.msg);
        }
      }
    });
  },
  bindEvent: function(){
    $(document).on("click",".yp_pay", function(){
      var $box = $(this).closest('.ypbox');
      var obj = $box.data("box");
      var idx = $(this).data("idx");
      euro_edata = __euro[obj][idx];
      if(obj == 'yp_04'){
        euro_edata.gameType = $(this).closest('.yp_team').find('.selected').data("game");
      }
      //判断登录状态      
      var isLogin = window.checkLogin();
      if(!isLogin){
        middleLogin();
      }else{
        util.yppay.payStep1();
      }
    });

    // team
    $("#yp_04").on("click",".yp_team_li",function(){
      $(this).addClass("selected").siblings(".yp_team_li").removeClass("selected");
      // var gameType = $(this).data("game");
      // console.log(gameType);
    });

    window.$mask = $("#mask"); 
    // 所有弹出层容器
    window.$popup_box = $(".popup_box");
    // 支付容器
    window.$popup = $("#popup_layout_pay");
    // 支付应该成功容器
    window.$popup_canpay = $("#popup_layout_canpay");
    // 未支付容器
    window.$popup_nopay = $("#popup_layout_nopay");
    // 没有预测数据的提示容器
    window.$popup_msg = $("#popup_layout_msg");

    // 弹层层隐藏按钮
    $(".popup_btn_close").on("click", function(){
      // 隐藏弹出层
      popupHide();
    });

    //弹出层 支付按钮
    // $(".popup_btn_pay").click(function() {
    //   // 先验证是否存在订单号
    //   util.yppay.payStep2();
    // });

    //提示信息按钮:知道了  取消
    $(".popup_btn_know").on('click', function(event) {
      // 隐藏弹出层
      popupHide();
    });
    $(".popup_btn_cancel").on('click', function(event) {
      // 隐藏弹出层
      popupHide();
    });

    //支付成功确认
    $(".popup_btn_canpay").on('click',function() {
      // 隐藏弹出层
      popupHide();
      // 支付是否成功验证
      util.yppay.payStep5();
    });
  },
  init: function(){
    var self = this;
    if(util.yppay.getwbid()){
      self.getHasPurchase();
    } else {
      self.render();
    }
    self.bindEvent();
    self.render05();
  }
};
ypObj.init();