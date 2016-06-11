// 购买小炮预测
module.exports = function () {
  var $mask = $("#mask"),
    $popup = $("#popup"),
    popup = $("#popup")[0];

  function popupShow() {
    var viewData = util.viewData();
    document.body.style.overflow = 'hidden';
    $popup.show();
    popup.style.visibility = "hidden";
    var cHeight = popup.offsetHeight;
    popup.style.marginTop = (viewData.viewHeight / 2 - cHeight / 2 - 30) + 'px';
    $mask.show();
    popup.style.visibility = "visible";
  };

  function popupHide() {
    document.body.style.overflow = 'auto';
    $mask.hide();
    $popup.hide();
  }

  var $match, $toggle_pre, $toggle_next, $percent_blue, $percent_bc;
  $("#d_header").on("click", ".btn_purchase", function () {
    $match = $(this).parents(".d_h_checkInfoBox");
    $toggle_pre = $match.find(".smart_toggle_pre");
    $toggle_next = $match.find(".smart_toggle_next");
    $percent_blue = $match.find(".smart_percent_blue");
    $percent_bc = $match.find(".smart_percent_bc");
    // 显示弹出层
    popupShow();
  });
  $(".popup_btn_close").on("click", function () {
    // 隐藏弹出层
    popupHide();
  });
  $(".popup_pay").on("click", function () {
    popupHide();
    $toggle_pre.hide();
    var hp = 50,
      gp = 50;
    if (gp <= 0) {
      $percent_blue.hide();
    }
    var pw = Math.ceil(260 * gp / 100);
    $percent_bc.width(pw);
    $toggle_next.show();
  });
}