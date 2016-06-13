(function(){
  window.__curdate = util.getQueryString("curdate") || __curdate;

  // 轮播
  var swiper = new Swiper('.swiper-container', {
    loop: true,
  });
  // 导航展示
  $("#toggleNav").click(function () {
    var dom_nav = $(".mainNav2");
    var ulStatue = dom_nav.css('display');
    if (ulStatue != "none") {
      dom_nav.hide();
      this.style.transform = 'rotate(0)';
    } else {
      dom_nav[0].style.display = 'inline-flex';
      this.style.transform = 'rotate(180deg)';
    }
  });
  //  新闻显示条数
  for (var i = 0; i < defaultNum; i++) {
    $('.newsBlock').eq(i).css('display','block');
  }
  $('.news_checkMoreBox').click(function () {
    $('.newsBlock').css('display','block');
    $(this).hide();
  });
  //  新闻tab
  $('.tabTit').find('li').click(function () {
    $(this).addClass('tabTit_current').siblings('li').removeClass('tabTit_current');
    var numI = $(this).index();
    $('.tabContainer').hide().eq(numI).show();
  });
})();

(function(){
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

  //提示信息按钮:知道了  取消
  $(".popup_btn_know").on('click', function(event) {
    // 隐藏弹出层
    popupHide();
  });
  $(".popup_btn_cancel").on('click', function(event) {
    // 隐藏弹出层
    popupHide();
  });

  window.teamRecentMatches0 = function(){};
  window.teamRecentMatches_host0 = function(){};
  window.teamRecentMatches_guest0 = function(){};
  window.getMatchHighSpeed_0 = function(){};
  window.teamRecentMatches1 = function(){};
  window.teamRecentMatches_host1 = function(){};
  window.teamRecentMatches_guest1 = function(){};
  window.getMatchHighSpeed_1 = function(){};
  window.teamRecentMatches2 = function(){};
  window.teamRecentMatches_host2 = function(){};
  window.teamRecentMatches_guest2 = function(){};
  window.getMatchHighSpeed_2 = function(){};
  window.teamRecentMatches3 = function(){};
  window.teamRecentMatches_host3 = function(){};
  window.teamRecentMatches_guest3 = function(){};
  window.getMatchHighSpeed_3 = function(){};


  window.getMatchHighSpeed_z_sx_0 = function(){};
  window.getMatchHighSpeed_z_sx_1 = function(){};
  window.getMatchHighSpeed_z_sx_2 = function(){};
  window.getMatchHighSpeed_z_sx_3 = function(){};

  window.getMatchHighSpeed_z_spf_0 = function(){};
  window.getMatchHighSpeed_z_spf_1 = function(){};
  window.getMatchHighSpeed_z_spf_2 = function(){};
  window.getMatchHighSpeed_z_spf_3 = function(){};

  window.getMatchHighSpeed_z_dx_0 = function(){};
  window.getMatchHighSpeed_z_dx_1 = function(){};
  window.getMatchHighSpeed_z_dx_2 = function(){};
  window.getMatchHighSpeed_z_dx_3 = function(){};
  
  var curdate = __curdate || util.dateFormatFmt( new Date(), "yyyy-MM-dd");
  window.match_num=0;
  window.match_data={
    a1:{},
    a2:{},
    a3:{},
    a4:{},
    a5:{}
  };
  // 存储到localStorage
  var expire = 10*60*1000;
  var euro = {
    get: function(name){
      if(!util.storage){
        return '';
      }
      var euro = JSON.parse(util.storage.getItem('euro_'+curdate)||'{}');
      return euro[name];
    },
    set: function(name, data){
      if(!util.storage){
        return '';
      }
      var self=this;
      var euro = JSON.parse(util.storage.getItem('euro_'+curdate)||'{}');
      euro[name] = data;
      util.storage.setItem('euro_'+curdate, JSON.stringify(euro));
    },
    remove: function(name){
      if(!util.storage){
        return '';
      }
      return util.storage.removeItem('euro');
    }
  }

  var smart = {
    // 小炮预计
    /**
     *http://odds.sports.sina.com.cn/odds/matchodds/asiaIni?id=3175335&format=json  亚盘 odds_id
     *http://odds.sports.sina.com.cn/odds/matchodds/euroIni?id=3175335&format=json  胜平负 odds_id
     *http://odds.sports.sina.com.cn/odds/matchodds/dxballIni?lc_id=3175335&format=json  大小球 livecast_id
     */
    smart_match: function(idx){
      var self = this;
      var cdata = match_data.data[idx];
      cdata.idx = idx;
      cdata.curdate = __curdate;
      // 默认是亚盘
      // var odds_id = '3175335'||cdata.odds_id;
      var odds_id = cdata.odds_id;
      $.ajax({
        url:'http://odds.sports.sina.com.cn/odds/matchodds/asiaIni?id='+odds_id+'&format=json',
        dataType:'jsonp',
        data: {},
        cache: true,
        jsonpCallback:"matchodds_"+idx,
        type:"get",
        success: function(data) {
          var result = data.result;
          var status = result && result.status;
          if(status && status.code == "0"){
            cdata.odds = result.data;
            if(!cdata.odds || cdata.odds.length == 0 ){
              // 没有开盘信息  直接置灰
              cdata.odds = {};
              cdata.ULswitch = 0;
            } else {
              cdata.ULswitch = 1;
            }
            // render
            var $container = $("#smart_box_0"+idx).find(".smart_match");
            var html = template('smart_match_tmp', {data: cdata});
            $container[0].innerHTML = html;
            // 比赛状态
            self.smart_match_status(idx);
          } else {
            util.log(result.status && result.status.msg);
            // 容错
            cdata.odds = {};
            cdata.ULswitch = 0;
            // render
            var $container = $("#smart_box_0"+idx).find(".smart_match");
            var html = template('smart_match_tmp', {data: cdata});
            $container[0].innerHTML = html;
            // 比赛状态
            self.smart_match_status(idx);
          }
        }
      });
    },
    // 比赛状态
    smart_match_status: function(idx){
      var self = this;
      var cdata = match_data.data && match_data.data[idx];
      if(!cdata || !cdata.livecast_id){
        return;
      }
      var matchId = cdata.livecast_id;
      var $container = $("#smart_"+matchId);
      var gameType = 'z_sx';
      $.ajax({  
        url:'http://platform.sina.com.cn/sports_all/client_api?app_key=3207392928&_sport_t_=football&_sport_s_=opta&_sport_a_=getMatchHighSpeed&id='+matchId,
        dataType:'jsonp',
        data: {},
        cache: true,
        jsonpCallback:"getMatchHighSpeed_"+gameType+"_"+idx,
        type:"get",
        success: function(data) {
          var result = data.result;
          var status = result && result.status;
          if(status && status.code === 0){
            var rdata = result.data;
            util.log(rdata);
            // "status": 3 比赛标准状态：1.未赛、2.赛中、3.结束，详见中文名
            if(rdata.status == 1){
              var noswitch = '';
              if(gameType == 'z_sx'){
                noswitch = cdata.ULswitch == 1?'':'_no';
              } else if(gameType == 'z_spf'){
                noswitch = cdata.SPFswitch == 1?'':'_no';
              } else if(gameType == 'z_dx'){
                noswitch = cdata.DXswitch == 1?'':'_no';
              } else {
                noswitch = cdata.ULswitch == 1?'':'_no';
              }
              // render
              var html = template('smart_match_pre_'+gameType+noswitch+'_tmp', {data: cdata});
              $container[0].innerHTML = html;
              // console.log(util.payment.getwbid() +'---'+noswitch);
              if(util.payment.getwbid() && noswitch != '_no'){
                // console.log('payStep0');
                util.payment.payStep0(euro_wbId, matchId, gameType, true);
              }
            } else if(rdata.status == 2){
              // 赛中 60s持续刷新显示
              // http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=101711880 按比赛ID获取已开放预测结果
              if(!cdata.om){
                $.ajax({
                  url:'http://odds.sports.sina.com.cn/odds/uefa/getOpenedMatchForecast?matchId='+matchId+'&format=json',
                  dataType:'jsonp',
                  data: {},
                  cache: true,
                  jsonpCallback:"getOpenedMatchForecast_"+matchId,
                  type:"get",
                  success: function(data) {
                    // data = {
                    //     "result":  {
                    //       "status":  {
                    //         "code": 0,
                    //         "msg": ""
                    //       },
                    //       "data": {
                    //         'betId':123423,
                    //         'upperTapePro':0.35,//'上盘概率'
                    //         'lowTapePro':0.35, //'下盘概率'
                    //         'ULTape':2.5, //'上下盘盘口'
                    //         'DXbigPro' :0.35, //'大分概率'
                    //         'DXsmallPro':0.35, //'小分概率'
                    //         'DXTape' :3.5/4,// '大小分盘口'
                    //         'SPFwinPro' :0.35, //'胜平负胜率'
                    //         'SPFdrawPro' :0.35,//'胜平负平率'
                    //         'SPFlosePro' :0.35, //'胜平负负率'
                    //       }
                    //     }
                    //   }
                    cdata.om = data.result.data;
                    cdata.matchId = matchId;
                    cdata.gameType = gameType;
                    cdata.hscore = rdata.Score1;
                    cdata.gscore = rdata.Score2;
                    // render_smart_in
                    render_smart_in(cdata,true);
                    setTimeout(function(){
                      smart.smart_match_status(idx);
                    }, 60000);
                  }
                });
              } else {
                cdata.matchId = matchId;
                cdata.gameType = gameType;
                cdata.hscore = rdata.Score1;
                cdata.gscore = rdata.Score2;
                // render_smart_in
                render_smart_in(cdata,true);
                setTimeout(function(){
                  // console.log(gameType+";"+idx);
                  smart.smart_match_status(idx);
                }, 60000);
              }
              
            } else {
              // 赛后  获取分析数据   不需要登录  得到准输背景
              // http://wiki.intra.sina.com.cn/pages/viewpage.action?pageId=101711880 按比赛ID获取已开放预测结果
              $.ajax({
                url:'http://odds.sports.sina.com.cn/odds/uefa/getOpenedMatchForecast?matchId='+matchId+'&format=json',
                dataType:'jsonp',
                data: {},
                cache: true,
                jsonpCallback:"getOpenedMatchForecast_"+matchId,
                type:"get",
                success: function(data) {
                  // data = {
                  //     "result":  {
                  //       "status":  {
                  //         "code": 0,
                  //         "msg": ""
                  //       },
                  //       "data": {
                  //         'betId':123423,
                  //         'upperTapePro':0.25,//'上盘概率'
                  //         'lowTapePro':0.75, //'下盘概率'
                  //         'ULTape':2.5, //'上下盘盘口'
                  //         'DXbigPro' :0.35, //'大分概率'
                  //         'DXsmallPro':0.35, //'小分概率'
                  //         'DXTape' :3.5/4,// '大小分盘口'
                  //         'SPFwinPro' :0.35, //'胜平负胜率'
                  //         'SPFdrawPro' :0.35,//'胜平负平率'
                  //         'SPFlosePro' :0.35, //'胜平负负率'
                  //         "ULforecastResult":1, //0（未给出结果），－1（错），1（准）
                  //         "SPFforecastResult":1, //0（未给出结果），－1（错），1（准）
                  //         "DXforecastResult":1, //0（未给出结果），－1（错），1（准）
                  //         "matchStatus":3  //1(未赛)，2（赛中），3（完赛）
                  //       }
                  //     }
                  //   }
                  cdata.om = data.result.data;
                  cdata.matchId = matchId;
                  cdata.gameType = gameType;
                  cdata.hscore = rdata.Score1;
                  cdata.gscore = rdata.Score2;
                  // render_smart_in
                  render_smart_end(cdata);
                }
              });
            }
          } else {
            util.log(result.status && result.status.msg);
          }
        }
      });
    },
    controller: function(idx){
      var self = this;
      self.smart_match(idx);
    }
  }

  window.gsmart = smart;
  // 切换玩法的方法
  window.switchGame = smart.smart_switchGame;
  var app = {
    getData: function(){
      var self = this;
      // 获取过期时间
      var expiretime = euro.get("expire") || 0;
      var currenttime = (new Date()).getTime();
      var data;
      if(currenttime - expiretime < expire){
        // data = euro.get("data");
        // match_num = data.length;
        // match_data.data = data;
        // self.render();
        // return;
      }
      $.ajax({  
        // url:'http://platform.sina.com.cn/sports_all/client_api?app_key=3207392928&_sport_t_=livecast&_sport_a_=dateMatches&LeagueType=9&begin='+curdate+'&end='+curdate,
        url:'http://odds.sports.sina.com.cn/fbmatch/dayMapMatches?date='+curdate+'&timespan=0&format=json',
        dataType:'jsonp',
        data: {},
        cache: true,
        jsonpCallback:"dayMapMatches",
        type:"get",
        success: function(data) {
          var result = data.result;
          var status = result && result.status;
          if(status && status.code == "0"){
            // util.log(result.data);
            data = result.data;
            match_num = data.length;
            match_data.data = data;
            self.render();
            euro.set("expire",currenttime);
            euro.set("data",data);
          } else {
            util.log(result.status && result.status.msg);
          }
        }
      });
    },
    render: function(){
      var self = this;
      for(var i=0; i<match_num; i++){
        $("#smart_box_0"+i).show();
        smart.controller(i);
      }

      self.bindEvent();
    },
    bindEvent: function(){
      // $(".smart_match").on("click", function(){
      //   var idx = $(this).find('selector')
      // });
    },
    controller: function(){
      var self = this;
      self.getData();
    }
  }
  app.controller();

})();
