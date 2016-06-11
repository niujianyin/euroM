var headData = (function() {
  var pri = {};
  var pub = {};
  if(util.debug){
    util.watchdataUrl = './watchData.html?m_id=';
    util.asiaUrl = './asiaData.html?m_id=';
    util.euroUrl = './europeData.html?m_id=';
    util.modelUrl = './index_m.html?m_id=';
  } else {
    util.watchdataUrl = '//odds.sports.sina.com.cn/uefa/base/?m_id=';
    util.asiaUrl = '//odds.sports.sina.com.cn/uefa/asia/?m_id=';
    util.euroUrl = '//odds.sports.sina.com.cn/uefa/europe/?m_id=';
    util.modelUrl = '//odds.sports.sina.com.cn/uefa/mtop/?m_id=';
  }
  pub.set = function(matchId, callback) {
    var matchId = matchId || '3190838';

    // watchdata : odds.sports.sina.com.cn/uefa/base/?m_id=3190734
    // asia : odds.sports.sina.com.cn/uefa/asia/?m_id=3190734
    // euro :  odds.sports.sina.com.cn/uefa/europe/?m_id=3190734
    // model:odds.sports.sina.com.cn/uefa/mtop/?m_id=3190734 这个m_id为livecast_id
    var writeTab = '<li ><a href="'+util.watchdataUrl+ matchId + '">数据分析</a></li>' +
      '<li><a href="'+util.euroUrl+ matchId + '">欧洲赔率</a></li>' +
      '<li><a href="'+util.asiaUrl+ matchId + '">亚洲盘口</a></li>';
    $(".d_h_tabBox ul").html(writeTab);

    var dataUrl = 'http://odds.sports.sina.com.cn/liveodds/getMatchInfo?m_id=' + matchId + '&format=json';
    $.ajax({
      url: dataUrl,
      dataType: 'jsonp',
      data: {},
      type: "get"
    }).done(function(data) {
      // console.log(data);
      var result = data.result;
      var status = result && result.status;
      if (status && status.code == "0") {
        //测试数据
        //      result.data.distance_2_cur = '13000';
        //      result.data.status = '2';

        var dom_d_h_tabBox = $(".d_h_tabBox");
        if ($("#i_watchData")[0]) {
          dom_d_h_tabBox.find('li').eq(0).addClass('d_h_tabCurrent').siblings('li').removeClass('d_h_tabCurrent');
        } else if ($('#i_europeData')[0]) {
          dom_d_h_tabBox.find('li').eq(1).addClass('d_h_tabCurrent').siblings('li').removeClass('d_h_tabCurrent');
        } else if ($('#i_asiaData')[0]) {
          dom_d_h_tabBox.find('li').eq(2).addClass('d_h_tabCurrent').siblings('li').removeClass('d_h_tabCurrent');
        }
        template.helper("distance", function() {
          var distance_2_cur = result.data.distance_2_cur;
          var status = result.data.status;
          if (status == "3" || status == "2") {
            return '<em>' + result.data.Score1 + '</em><span>vs</span> <em>' + result.data.Score2 + ' </em>';
            // } else if (status == "2") {
            //   return '比赛进行中';
          } else if (status == "1") {
            if (distance_2_cur <= 1440 && distance_2_cur > 60) {
              var dH = (distance_2_cur - 0) / 60;
              return '距离比赛还有<span>' + parseInt(dH) + '</span> 小时';
            } else if (distance_2_cur > 1440) {
              var dD = (distance_2_cur - 0) / 1440;
              return '距离比赛还有<span>' + parseInt(dD) + '</span> 天';
            } else if (distance_2_cur < 60) {
              return '距离比赛还有<span>' + distance_2_cur + '</span> 分钟';
            }
          }
        });
        var html = template('temp_header', result.data);
        $("#d_header")[0].innerHTML = html;
        $("#pd_btn").attr("href", util.modelUrl+data.result.data.livecast_id+'&curdate='+result.data.MatchDate);
        callback(result.data);
      } else {
        util.log("服务器请求失败!");
      }
    })
  };
  return pub;
})();
