function createlogin(n, i, e) {
  var t = window.sinalogin = window.SINA_OUTLOGIN_LAYER;
  t.set("sso", {
      entry: "wapsso"
    }).set("mask", {
      enable: !0,
      opacity: .5,
      background: "#000",
      zIndex: 1e5
    }).init(), t.islogin = function() {
      return this.getSinaUserData() ? !0 : !1
    }, window.ssoControl = window.SSOController ? function() {
      var n = new SSOController;
      return n
    }() : !1, ssoControl.init(),
    function() {
      this.name = "ssoControl", this.entry = "wapsso", this.domain = "guba.sina.cn", this.customLoginCallBack = function() {}, this.customLogoutCallBack = function() {}
    }.apply(ssoControl), ! function() {
      "undefined" == typeof window.$WeiboJsApi && (window.$WeiboJsApi = {}), $WeiboJsApi._ajax = function(n) {
        n = n[0] || {}, this.url = n.url || "", this.param = n.param || null, this.callback = n.callback || function() {}, this.timeout = n.timeout || 15e3, this.ontimeout = n.ontimeout || function() {}, this.timeoutflag = !0, "undefined" == typeof window._$WeiboJsApi_callback && (window._$WeiboJsApi_callback = {}), this._setJSONRequest()
      }, $WeiboJsApi._ajax.prototype = {
        _setJSONRequest: function() {
          var n = document.getElementsByTagName("head")[0],
            i = document.createElement("script"),
            e = this._setRandomFun(),
            t = this,
            o = "";
          for (var a in this.param) "" == o ? o = a + "=" + this.param[a] : o += "&" + a + "=" + this.param[a];
          i.type = "text/javascript", i.charset = "utf-8", n ? n.appendChild(i) : document.body.appendChild(i), window._$WeiboJsApi_callback[e.id] = function(n) {
            t.callback(n), t.timeoutflag = !1, setTimeout(function() {
              delete window._$WeiboJsApi_callback[e.id], i.parentNode.removeChild(i)
            }, 100)
          }, i.src = this.url + "&callback=" + e.name + "&" + o, setTimeout(function() {
            t.timeoutflag && (t.ontimeout(), setTimeout(function() {
              delete window._$WeiboJsApi_callback[e.id], i.parentNode.removeChild(i)
            }, 100))
          }, t.timeout)
        },
        _setRandomFun: function() {
          var n = "";
          do n = "$WeiboJsApi" + Math.floor(1e4 * Math.random()); while (window._$WeiboJsApi_callback[n]);
          return {
            id: n,
            name: "window._$WeiboJsApi_callback." + n
          }
        }
      }, window.$WeiboJsApi.ajax = function() {
        return new $WeiboJsApi._ajax(arguments)
      }, window.$WeiboJsApi.getWeiboInfo = function(n) {
        return new $WeiboJsApi.ajax({
          url: "http://127.0.0.1:9527/query?appid=com.sina.weibo",
          callback: n
        })
      }, window.$WeiboJsApi.getAppInfo = function(n, i) {
        return new $WeiboJsApi.ajax({
          url: "http://127.0.0.1:9527/query?appid=" + n,
          callback: i
        })
      }, window.$WeiboJsApi.startWeibo = function(n) {
        return new $WeiboJsApi.ajax({
          url: "http://127.0.0.1:9527/si?cmp=com.sina.weibo_com.sina.weibo.SplashActivity&act=android.intent.action.VIEW",
          callback: n
        })
      }, window.$WeiboJsApi.startApp = function(n, i, e) {
        return new $WeiboJsApi.ajax({
          url: "http://127.0.0.1:9527/si?act=android.intent.action.VIEW&cmp=" + n + "_" + i,
          callback: e
        })
      }, window.$WeiboJsApi.startScheme = function(n, i) {
        return new $WeiboJsApi.ajax({
          url: "http://127.0.0.1:9527/si?act=android.intent.action.VIEW&data=" + n,
          callback: i
        })
      }, window.$WeiboJsApi.getUserInfo = function(n) {
        return new $WeiboJsApi.ajax({
          url: "http://127.0.0.1:9527/login?",
          callback: n.onsuccess,
          ontimeout: n.ontimeout,
          timeout: n.timeout
        })
      }
    }(),
    function(n, i) {
      function o(i) {
        var e, t = [],
          o = /%20/g;
        for (var a in i) e = i[a].toString(), t.push(n.encodeURIComponent(a).replace(o, "+") + "=" + n.encodeURIComponent(e).replace(o, "+"));
        return t.join("&")
      }

      function a(n) {
        return "[object Function]" === r.call(n)
      }

      function s(n) {
        var i = (new Date).getTime() + Math.floor(1e5 * Math.random());
        return n ? n + "" + i : i
      }

      function c(n, e) {
        var t = i.createElement("script");
        return t.src = n, e && (t.charset = e), t.async = !0, d(t), u ? l.insertBefore(t, u) : l.appendChild(t), t
      }
      var r = Object.prototype.toString,
        l = i.getElementsByTagName("head")[0] || i.documentElement,
        u = l.getElementsByTagName("base")[0],
        p = /^(?:loaded|complete|undefined)/,
        d = function(n) {
          n.onload = n.onreadystatechange = function() {
            p.test(n.readyState) && (n.onload = n.onreadystatechange = null, l.removeChild(n), n = null)
          }
        },
        g = function(n) {
          var i = n.jsonp || "callback",
            e = s("jsonpcallback"),
            t = i + "=" + e,
            r = window.setTimeout(function() {
              a(n.ontimeout) && n.ontimeout()
            }, 5e3);
          window[e] = function(i) {
            window.clearTimeout(r), a(n.onsuccess) && n.onsuccess(i)
          };
          var l = n.url.indexOf("?") > 0 ? "&" : "?";
          n.data ? c(n.url + l + o(n.data) + "&" + t, n.charset) : c(n.url + l + t, n.charset)
        },
        m = {
          setCookie: function(n, e, t, o, a, s) {
            var c = [];
            if (c.push(n + "=" + escape(e)), t) {
              var r = new Date,
                l = r.getTime() + 36e5 * t;
              r.setTime(l), c.push("expires=" + r.toGMTString())
            }
            o && c.push("path=" + o), a && c.push("domain=" + a), s && c.push(s), i.cookie = c.join(";")
          },
          getCookie: function(n) {
            n = n.replace(/([\.\[\]\$])/g, "\\$1");
            var e = new RegExp(n + "=([^;]*)?;", "i"),
              t = i.cookie + ";",
              o = t.match(e);
            return o ? o[1] || "" : ""
          },
          deleteCookie: function(n) {
            i.cookie = n + "=;expires=Fri, 31 Dec 1999 23:59:59 GMT;"
          }
        },
        f = {},
        w = !1;
      f.loginBox = loginBox, g({
        url: "http://passport.sina.cn/sso/islogin",
        data: {
          entry: "wapsso"
        },
        charset: "utf-8",
        onsuccess: function(n) {
          if (2e7 === n.retcode) t || t.islogin() || n.data ? function() {
            t.getSinaUserData();
            $(".js-login img")[0] && ($(".js-login img")[0].src = n.data.portrait_url)
          }() : function() {
            $(".js-login img")[0].src = "http://n.sinaimg.cn/finance/stockbar/images/face-default.png"
            
          }();
          else if (50011039 === n.retcode) {
            var i = m.getCookie("needapp");
            if ("" === i) w = !0;
            else {
              var o = (new Date).getTime() / 1e3,
                a = (o - i) / 3600;
              a > 24 && (w = !0)
            }
            if (ssoControl.getSinaCookie() && ssoControl.isCheckLoginState) {
              var s = ssoControl.getSinaCookie();
              f.loginBox.innerHTML = e.replace(/%uid%/g, s.uid).replace(/%imgurl%/g, "http://n.sinaimg.cn/finance/stockbar/images/face-default.png").replace(/%name%/g, s.nick)
            } else t ? function() {
              $(".js-login img")[0].src = "http://n.sinaimg.cn/finance/stockbar/images/face-default.png"
              
            }() : !1
          }
        }
      })
    }(window, document)
}
var no_login_str = '<a href="javascript:;" class="login-img" external></a><span class="tip">请先登录，再填写投诉信息。</span><div class="login-fr"><span class="exit js-login userts-exit">登陆</span></div>',
  login_str = '<a href="javascript:;" class="login-img" data-uid="%uid%" external><img src="%imgurl%" alt=""></a><span class="name">%name%</span><div class="login-fr"><a href="javascript:;" external>我的投诉</a><span class="exit js-exit">退出</span></div>',
  loginBox = window.loginBox = document.getElementById("jrt-loginBox");
createlogin(loginBox, no_login_str, login_str);