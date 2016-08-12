$( document ).ready(function() {

  function animateLoading() {
    $('.loading-image > img').animate({'margin-left' : '-50px'}, 'slow', null, animateLoading);
    $('.loading-image > img').animate({'margin-left' : '50px'}, 'slow', null, animateLoading);
  }

  function changeToLoginPage() {
    $('.loading-icon').hide('slow');
    $('.login-box').show('slow');
  }

  function bindClickEvent() {
    $('#naver_login_btn').click(function() {
      location.href = "/auth/naver";
    });

    $('#kakao_login_btn').click(function() {
      location.href = "/auth/kakao";
    });
  }

  animateLoading();
  bindClickEvent();
  // 2초 뒤 로그인 페이지로 변경
  setTimeout(function() {
    changeToLoginPage();
  }, 2000);
});

