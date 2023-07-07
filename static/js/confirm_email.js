window.onload = function () {
  swal("이메일 인증이 완료되었습니다. 홈페이지로 돌아가서 로그인해주세요.", '', 'success')
    .then((value) => {
      window.close();
    });
};

