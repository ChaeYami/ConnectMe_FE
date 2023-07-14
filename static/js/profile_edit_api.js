const user_id = JSON.parse(payload)['user_id']

window.onload = () => {
    existingProfile(user_id)
}

const logined_account = payload_parse.account;

// 입력폼에 기존 값 넣기
async function existingProfile(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + logined_token
        },
        method: 'GET',
    })
    response_json = await response.json()

    document.getElementById('nickname').value = response_json.nickname
    document.getElementById('introduce').value = response_json.introduce
    document.getElementById('age').value = response_json.age
    document.getElementById('mbti').value = response_json.mbti
    let prefer_region = response_json.prefer_region;
    let sido_selected = '';
    let gugun_selected = '';

    if (prefer_region != '전국') {
        sido_selected = prefer_region.split(" ")[0]
        gugun_selected = prefer_region.split(" ")[1]
    } else {
        sido_selected = prefer_region
    }





    const sidoDropdown = document.getElementById('sido1');
    const gugunDropdown = document.getElementById('gugun1');

    // sidoDropdown에서 sido_selected 값을 선택된 값으로 설정하기
    for (let i = 0; i < sidoDropdown.options.length; i++) {
        if (sidoDropdown.options[i].value === sido_selected) {
            sidoDropdown.selectedIndex = i;
            break;
        }
    }

    // sidoDropdown에서 change 이벤트를 트리거하여 gugunDropdown의 옵션을 업데이트하기
    sidoDropdown.dispatchEvent(new Event('change'));

    // gugunDropdown에서 gugun_selected 값을 선택된 값으로 설정하기
    if (gugun_selected !== '전국') {
        for (let i = 0; i < gugunDropdown.options.length; i++) {
            if (gugunDropdown.options[i].value === gugun_selected) {
                gugunDropdown.selectedIndex = i;
                break;
            }
        }
    }



    // 기존에 있던 프로필 이미지 불러오기


    // 프로필 이미지 미리보기
    const profile_img = document.getElementById('profile_img');
    if (response_json.profile_img) {
        const imageUrl = `${BACKEND_BASE_URL}${response_json.profile_img}`;
        document.getElementById('profile_preview').src = imageUrl;
    } else {
        document.getElementById('profile_preview').src = "/static/image/user.png"
    }

}
function toggleFileInput() {
    const fileInput = document.getElementById("profile_img");
    if (fileInput.style.display === "none") {
        fileInput.style.display = "block";
    } else {
        fileInput.style.display = "none";
    }
}

// 이미지 미리보기
function previewImage() {
    const fileInput = document.getElementById('profile_img');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const previewImg = document.getElementById('profile_preview');
        previewImg.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
}

// 수정완료 버튼 눌렀을 때
async function updateProfile() {
    let sido1 = document.getElementById("sido1").value
    let gugun1 = document.getElementById("gugun1").value
    let prefer_region = `${sido1} ${gugun1}`
    let nickname = document.getElementById('nickname').value
    let introduce = document.getElementById('introduce').value
    let fileInput = document.getElementById('profile_img');
    let age = document.getElementById('age').value;
    let mbti = document.getElementById('mbti').value;
    let file = fileInput.files[0];
    let formData = new FormData();

    formData.append('nickname', nickname);
    formData.append('introduce', introduce);
    formData.append('age', age);
    formData.append('mbti', mbti);
    formData.append('prefer_region', prefer_region)


    if (file) {
        formData.append('profile_img', file);
    } else {

    }

    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + logined_token,
        },
        method: 'PATCH',
        body: formData
    });

    if (response.status == 200) {
        swal("수정 완료", '', "success")
            .then((value) => {
                if ($('#profile_preview')[0].src == `${FRONTEND_BASE_URL}/static/image/user.png`) {
                    delProfileImg()
                }
                window.location.replace(`/profile.html?user_id=${user_id}`)

            });
    } else if (response.status == 403) {
        swal('권한이 없습니다!', '', "error")
    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);

        if (errorArray[1][1].nickname) {
            swal(`${errorArray[1][1].nickname}`, '', 'warning')
        } else if (errorArray[0][1].age) {
            swal(`${errorArray[0][1].age}`, '', 'warning')
        } else if (errorArray[0][1].non_field_errors) {
            swal(`${errorArray[0][1].non_field_errors}`, '', 'warning')
                .then((value) => {
                    $('#profile_preview').attr('src', 'static/image/user.png');
                    $('#profile_img').val('');
                });
        }
    }
}

async function delProfileImg() {


    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + logined_token,
        },
        method: 'DELETE',
    });

}

function deleteProfileImage() {
    $('#profile_img').val('');
    $('#profile_preview').attr('src', "/static/image/user.png")
}

$('document').ready(function () {
    let area0 = ["시/도 선택", "서울특별시", "인천광역시", "대전광역시", "광주광역시", "대구광역시", "울산광역시", "부산광역시", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도", "전국"];
    let area1 = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];
    let area2 = ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"];
    let area3 = ["대덕구", "동구", "서구", "유성구", "중구"];
    let area4 = ["광산구", "남구", "동구", "북구", "서구"];
    let area5 = ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"];
    let area6 = ["남구", "동구", "북구", "중구", "울주군"];
    let area7 = ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"];
    let area8 = ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주군", "연천군"];
    let area9 = ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"];
    let area10 = ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군", "청원군"];
    let area11 = ["계룡시", "공주시", "논산시", "보령시", "서산시", "아산시", "천안시", "금산군", "당진군", "부여군", "서천군", "연기군", "예산군", "청양군", "태안군", "홍성군"];
    let area12 = ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"];
    let area13 = ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"];
    let area14 = ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"];
    let area15 = ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"];
    let area16 = ["서귀포시", "제주시", "남제주군", "북제주군"];


    // 시/도 선택 박스 초기화

    $("select[name^=sido]").each(function () {
        let $selsido = $(this);

        $.each(eval(area0), function () {
            if (this == '시/도 선택') {
                $selsido.append(`<option value='' selected disabled> ${this} </option>`);
            } else {
                $selsido.append("<option value='" + this + "'>" + this + "</option>");
            }
        });
        $("select[name^=gugun]").append("<option value='' selected disabled>구/군 선택</option>");
    });



    // 시/도 선택시 구/군 설정

    $("select[name^=sido]").change(function () {
        var area = "area" + $("option", $(this)).index($("option:selected", $(this))); // 선택지역의 구군 Array
        var $gugun = $(this).next(); // 선택영역 군구 객체
        $("option", $gugun).remove(); // 구군 초기화

        if (area == "area0") {
            $gugun.append("<option value='' selected disabled>구/군 선택</option>");
        }
        else {
            try {
                $.each(eval(area), function () {
                    $gugun.append("<option value='" + this + "'>" + this + "</option>");
                });
                $('#gugun1').attr('style', '')
            } catch (e) {
                $('#gugun1').attr('style', 'display:none;')
            }
        }
    });
});