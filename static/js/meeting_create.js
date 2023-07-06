let token = localStorage.getItem("access")

window.onload = function () {
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    let todayString = year + "-";
    if (month < 10) {
        todayString += "0";
    }
    todayString += month + "-";
    if (day < 10) {
        todayString += "0";
    }
    todayString += day;
    let date_time_input_html = `
<input id="meeting_date" type="date" min=${todayString}>
`
    $("#date_time_input").prepend(date_time_input_html)
    $("#meeting_time").timepicker('setTime', new Date());
    document.getElementById('meeting_date').valueAsDate = new Date();
    let dining_info = localStorage.getItem("dining")
    if (dining_info) {
        let dining = JSON.parse(dining_info)
        createMeetingFromPlace(dining)
    }
}

async function createMeetingFromPlace(place_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
        method: "GET",
    });

    const response_json = await response.json();
    let address_data = response_json['place'].address
    let images_data = response_json['place'].image
    let title_data = response_json['place'].title

    for (let i = 0; i < 3; i++) {
        $('#image_container').append(`<img class="show_img" src=${images_data[i].url} style="filter: grayscale(80%)">`);
    }

    let sido_selected = address_data.split(" ")[0];
    let gugun_selected = address_data.split(" ")[1];

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

    for (let i = 0; i < gugunDropdown.options.length; i++) {
        if (gugunDropdown.options[i].value === gugun_selected) {
            gugunDropdown.selectedIndex = i;
            break;
        }
    }

    $('#sido1').prop('disabled', true);
    $('#gugun1').prop('disabled', true);
    $('#meeting_image').hide();
    $('#place_title').val(title_data)
    $('#place_address').val(address_data)
    $('#title-label').remove();
    $('#place_title').prop('disabled', true);
    $('#place_title').css({
        'color': '#838383',
        'background-color': '#f1f1f1',
        'opacity': '0.5',
    });
    $('#address-label').remove();
    $('#place_address').prop('disabled', true);
    $('#place_address').css({
        'color': '#838383',
        'background-color': '#f1f1f1',
        'opacity': '0.5',
    });
    $('#meeting-btn').removeAttr('onclick');
    $('#meeting-btn').on('click', function () {
        createMeeting(place_id);
    });

    localStorage.removeItem('dining');
}


//모임 게시글 작성 시작
async function createMeeting(place_id = -1) {
    let meeting_title = document.getElementById("meeting_title").value
    let meeting_content = document.getElementById("meeting_content").value
    let meeting_image = document.getElementById("meeting_image").files
    let sido1 = document.getElementById("sido1").value
    let gugun1 = document.getElementById("gugun1").value
    let meeting_city = `${sido1} ${gugun1}`
    let meeting_date = document.getElementById("meeting_date").value
    let meeting_time = document.getElementById("meeting_time").value
    let meeting_at = `${meeting_date} ${meeting_time}`
    let num_person_meeting = document.getElementById("num_person_meeting").value
    let place_title = document.getElementById("place_title").value
    let place_address = document.getElementById("place_address").value

    let formData = new FormData();
    formData.append("title", meeting_title);
    formData.append("content", meeting_content);
    formData.append("meeting_city", meeting_city);
    formData.append("meeting_at", meeting_at);
    formData.append("num_person_meeting", num_person_meeting);
    formData.append("place_title", place_title);
    formData.append("place_address", place_address);

    for (let i = 0; i < meeting_image.length; i++) {
        let image = meeting_image[i];
        formData.append('image', image);
    }

    if (place_id > 0) {
        formData.append("place", place_id);
        const imageContainer = document.querySelector('#image_container');
        const imageElements = imageContainer.querySelectorAll('img');

        imageElements.forEach((img) => {
            let img_url = decodeURIComponent(img.src);
            formData.append('image', img_url);
        });
    }

    await fetch(`${BACKEND_BASE_URL}/meeting/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
        .then((response) => {
            response.json().then((data) => {
                let meeting_id = data.id
                if (data.id) {
                    alert("작성 되었습니다.")
                    location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
                } else {
                    if (data.meeting_city) {
                        alert("모임 지역을 선택해주세요")
                    }
                    else if (data.num_person_meeting) {
                        alert("모집 인원수를 본인 포함 두 명 이상으로 입력 해주세요.")
                    }
                    else if (data.place_title) {
                        alert("모임 장소 이름을 입력해주세요")
                    }
                    else if (data.place_address) {
                        alert("모임 주소를 입력해주세요")
                    }
                    else if (data.title) {
                        alert("제목을 입력해주세요")
                    }
                    else if(data.content){
                        alert("내용을 입력해주세요")
                    }
                }
            }
            );
        });
        
}
function setThumbnail(event) {
    var container = document.querySelector("#image_container");
    container.innerHTML = '';
    for (var image of event.target.files) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = document.createElement("img");
            img.className = 'show_img';
            img.setAttribute("src", event.target.result);
            document.querySelector("div#image_container").appendChild(img);
        };
        reader.readAsDataURL(image);
    }
}
//모임 게시글 작성 끝

$('document').ready(function () {
    var area0 = ["시/도", "서울", "인천", "대전", "광주", "대구", "울산", "부산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
    var area1 = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];
    var area2 = ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"];
    var area3 = ["대덕구", "동구", "서구", "유성구", "중구"];
    var area4 = ["광산구", "남구", "동구", "북구", "서구"];
    var area5 = ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"];
    var area6 = ["남구", "동구", "북구", "중구", "울주군"];
    var area7 = ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"];
    var area8 = ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주군", "연천군"];
    var area9 = ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"];
    var area10 = ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군", "청원군"];
    var area11 = ["계룡시", "공주시", "논산시", "보령시", "서산시", "아산시", "천안시", "금산군", "당진군", "부여군", "서천군", "연기군", "예산군", "청양군", "태안군", "홍성군"];
    var area12 = ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"];
    var area13 = ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"];
    var area14 = ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"];
    var area15 = ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"];
    var area16 = ["서귀포시", "제주시", "남제주군", "북제주군"];

    // 시/도 선택 박스 초기화
    $("select[name^=sido]").each(function () {
        let $selsido = $(this);

        $.each(eval(area0), function () {
            if (this == '시/도') {
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