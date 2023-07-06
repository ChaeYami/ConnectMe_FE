const logined_token = localStorage.getItem("access")
let count_per_page = 30; // 페이지당 데이터 건수
let show_page_cnt = 10; // 화면에 보일 페이지 번호 개수
let page_data = 0;
let func_selected = '';
let urlParams = new URLSearchParams(window.location.search).get("id");


window.onload = function () {
    if (urlParams) {
        func_selected = 'placeDetailView'
        placeDetailView(urlParams);
    } else {
        func_selected = 'placeView';
        placeView()
    }
};

// 카테고리 함수
$(document).ready(function () {
    $('#category-box').mouseenter(function () {
        hoverCategory(true);
    });

    $('.select').on('click', 'li', function () {
        $('#opened').prop('checked', false);
        var $t = $(this),
            $f = $('.field'),
            text = $t.clone().children().remove().end().text().trim(),
            icon = $t.find('i').attr('class');
        $f.find('label').text(text);
        $f.find('i').attr('class', icon);
        $('#category-select').css('z-index', '');
        $('#category-select').css('display', '');
        placeView($f.find('label').text(text)[0].innerText)
    });

    $('.field').click(function (e) {
        e.stopPropagation();
        $('#opened').prop('checked', !$('#opened').prop('checked'));
    });

    $(document).click(function () {
        $('#opened').prop('checked', false);
        $('#category-select').css('z-index', '-1');
        $('#category-select').css('display', 'none');
    });
});

function hoverCategory(input) {
    let select = document.querySelector('#category-select');

    if (input) {
        select.style.zIndex = '2';
        select.style.display = '';
    } else {
        select.style.zIndex = '-1';
        select.style.display = 'none';

    }
}


// 페이지네이션 시작
$(function () {

    $(document).on('click', 'div.paging>div.pages>span', function () {
        if (!$(this).hasClass('active')) {
            $(this).parent().find('span.active').removeClass('active');
            $(this).addClass('active');
            let category = document.querySelector('.seltext').innerText
            let page_num = Number($(this).text())

            if (func_selected == 'placeView') {
                placeView(category, page_num);
            } else if (func_selected == 'placeDetailView') {
                placeDetailView(urlParams, page_num);
            }

        }
    });

    $(document).on('click', 'div.paging>i', function () {
        let totalPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);
        const id = $(this).attr('id')
        let category = document.querySelector('.seltext').innerText
        let page_num = Number($(this).text())
        let first_page_id = document.querySelector('#first_page')
        let prev_page_id = document.querySelector('#prev_page')

        first_page_id.style.display = "";
        prev_page_id.style.display = "";


        if (id == 'first_page') {
            if (func_selected == 'placeView') {
                placeView(category, 1);
            } else if (func_selected == 'placeDetailView') {
                placeDetailView(urlParams, 1);
            }
        } else if (id == 'prev_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const prevPage = Math.min(...arrPages) - show_page_cnt;

            if (func_selected == 'placeView') {
                placeView(category, prevPage);
            } else if (func_selected == 'placeDetailView') {
                placeDetailView(urlParams, prevPage);
            }
        } else if (id == 'next_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const nextPage = Math.max(...arrPages) + 1;

            if (func_selected == 'placeView') {
                placeView(category, nextPage);
            } else if (func_selected == 'placeDetailView') {
                placeDetailView(urlParams, nextPage);
            }
        } else if (id == 'last_page') {
            const lastPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);

            if (func_selected == 'placeView') {
                placeView(category, lastPage);
            } else if (func_selected == 'placeDetailView') {
                placeDetailView(urlParams, lastPage);
            }
        }
    });
})

function setPaging(pageNum) {
    const currentPage = pageNum;
    const totalPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);

    showAllIcon();

    if (currentPage <= show_page_cnt) {
        $('#first_page').hide();
        $('#prev_page').hide();
    }
    if (
        totalPage <= show_page_cnt ||
        Math.floor((currentPage - 1) / show_page_cnt) * show_page_cnt + show_page_cnt + 1 > totalPage
    ) {
        $('#next_page').hide();
        $('#last_page').hide();
    }

    let start = Math.floor((currentPage - 1) / show_page_cnt) * show_page_cnt + 1;

    let sPagesHtml = '';
    for (let end = start + show_page_cnt; start < end && start <= totalPage; start++) {
        sPagesHtml += '<span class="' + (start == currentPage ? 'active' : '') + '">' + start + '</span>';
    }
    $('div.paging>div.pages').html(sPagesHtml);
}

function showAllIcon() {
    $('#first_page').show();
    $('#prev_page').show();
    $('#next_page').show();
    $('#last_page').show();
}
// 페이지네이션 끝
// 장소추천 게시글 생성
async function createPlace() {
    let name = document.querySelector('#name')
    let category = document.querySelector('#category')
    let content = document.querySelector('#content')
    let address = document.querySelector('#address')
    let images = document.querySelector('#images')
    let score = document.querySelector('#score')
    let price = document.querySelector('#price')
    let hour = document.querySelector('#hour')
    let holiday = document.querySelector('#holiday')



    const formdata = new FormData();
    formdata.append("title", name.value);
    formdata.append("category", category.value);
    formdata.append("content", content.value);
    formdata.append("address", address.value);
    formdata.append("score", score.value);
    formdata.append("price", price.value);
    formdata.append("hour", hour.value);
    formdata.append("holiday", holiday.value);

    for (let i = 0; i < images.files.length; i++) {
        formdata.append("image", images.files[i]);
    }


    const response = await fetch(`${BACKEND_BASE_URL}/place/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
        body: formdata,
    });

    const response_json = await response.json();


    if (response.status == 200) {
        alert("추천 장소가 등록되었습니다.");
        window.location.replace(`${FRONTEND_BASE_URL}/place_view.html`);
    } else if (response.status == 400) {
        for (let key in response_json) {
            alert(`${response_json[key]}`);
            break
        }
    }
}

// 장소추천 전체보기 (카테고리)
async function placeView(category_select = '카테고리', pages = 1) {
    let container = document.querySelector('#place')
    let place_create = document.querySelector('#place_create')
    let foot = document.querySelector('#myFooter')
    count_per_page = 30
    show_page_cnt = 10
    func_selected = 'placeView'

    foot.style.display = ''

    container.innerHTML = ``
    place_create.innerHTML = ``

    let place_category_input = `?`

    if (category_select === '식사' || category_select === '주점' || category_select === '카페') {
        place_category_input = `?search=${category_select}&`
    }

    if (typeof (pages) === 'number') {
        place_category_input += `page=${pages}`
    }

    const response = await fetch(`${BACKEND_BASE_URL}/place/category/${place_category_input}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    let response_json = await response.json();
    page_data = response_json["count"]

    if (JSON.parse(payload)['is_staff']) {
        place_create.innerHTML += `
        <a href="place_create.html">
            <img src="static/image/add.png" style="width:20px">
        </a>
        `
    }

    response_json['results'].forEach((e, i) => {
        let place_id = e.id
        let name = e.title
        let category = e.category
        let content = e.content
        let address = e.address
        let image = e.image
        let score = e.score
        let bookmark = e.bookmark
        let book_count = e.bookmark_count
        let comment_count = e.comment_count
        let like_count = e.like_count

        container.innerHTML += `
        <div id="place${place_id}" class="place-container"></div>`

        let place = document.querySelector(`#place${place_id}`)
        // 북마크 시작
        let place_book = ``

        if (bookmark.includes(logined_user_id)) {

            place_book = `
            <a title="북마크"> 
                <img id="book${place_id}" src="static/image/bookmark (1).png" alt="북마크" onclick="placeBook($${place_id})">
            </a>`
        } else {
            place_book = `
            <a title="북마크">
                <img id="book${place_id}" src="static/image/bookmark.png" alt="북마크" onclick="placeBook(${place_id})">
            </a>`
        }
        // 북마크 끝

        // 이미지 시작
        if (image) {
            place.innerHTML += `
            <div class="hotplace-image-div">
                <a href="place_view.html?id=${place_id}">
                    <img class="place-container-img" src="${image['url']}" onclick="placePreUpdateView()">
                </a>
                ${place_book}
            </div>
            `
        } else {
            place.innerHTML += `
            <div class="hotplace-image-div">
                <a href="place_view.html?id=${place_id}">
                    <img class="place-container-img" style="object-fit: contain;" src="static/image/ConnectME - 하늘고래.png">
                </a>
                ${place_book}
            </div>`
        }
        // 이미지 끝
        // 모임생성 시작
        let place_meeting = `
        <a title="이 장소로 모임 생성하기"> 
            <img id="book${place_id}" src="static/image/people (1).png" style="margin-top:10px; width: 50px;" alt="모임생성" onclick="go_createMeeting(${place_id})">
        </a>
        `
        // 모임생성 끝
        // edit 버튼 시작
        let place_edit = ``

        if (JSON.parse(payload)['is_staff']) {
            place_edit = `
            <a>
                <img src="static/image/edit.png" style="margin-top:10px; width:20px;"
                    onclick="placePreUpdateView(${place_id})">
            </a>
            `
        }
        // edit 버튼 끝
        // container html 시작
        place.innerHTML += `
        <div class="place-container-text">
            <div class="place-container-main">
                <div class="place-container-title">
                    <div class="place-container-title0">
                        <h2>${((pages - 1) * count_per_page) + i + 1}.</h2>
                    </div>
                    <div class="place-container-title1">
                        <h2><a class="place-container-title-a" href="place_view.html?id=${place_id}">${name}</a></h2>
                    </div>
                    <div class="place-container-title2">
                        <div class="place-container-score">
                            <h2>${score}</h2>
                        </div>
                    </div>
                    <div id="place_edit">
                    ${place_edit}
                    </div>
                </div>
                <div class="place-container-book" id="place-container-book">
                ${place_meeting}
                </div>
            </div>
            <div class="place-container-address">${address}</div>
            <div class="place-container-content">${content}</div>
            <div class="place-container-count">
                <div id="place-container-count-comment${place_id}" class="place-container-count-img">
                    <img src="static/image/chat.png">
                    ${comment_count}
                </div>
                <div id="place-container-count-like${place_id}" class="place-container-count-img">
                    <img src="static/image/heart (2).png">
                    ${like_count}
                </div>
                <div id="place-container-count-book${place_id}" class="place-container-count-img">
                    <img src="static/image/bookmark (2).png">
                    ${book_count}
                </div>
            </div>
            <div id="map"></div>
            
        </div>
        <div class="place-container-hr">
            <hr>
        </div>
        `
        // container html 끝
    })
    setPaging(pages);
}

// 장소추천 검색하기
async function placeSearchView(event) {

    let container = document.querySelector('#place')
    let place_create = document.querySelector('#place_create')
    let foot = document.querySelector('#myFooter')

    foot.style.display = 'none';

    container.innerHTML = ``
    place_create.innerHTML = ``

    let place_category_input = ``


    // Select box
    let selectBox = document.querySelector('.select-box__current');
    let selectedValue = selectBox.querySelector('.select-box__input:checked').value;

    switch (parseInt(selectedValue)) {
        case 1:
            place_category_input = `?`
            break;

        case 2:
            place_category_input = `?`
            break;

        case 3:
            place_category_input = `?ordering=-comment_count&`
            break;

        case 4:
            place_category_input = `?ordering=-likes_count&`
            break;

        case 5:
            place_category_input = `?ordering=-books_count&`
            break;
    }


    // 검색 input
    let searchInput = document.querySelector('#place-search-input');
    let searchValue = searchInput.value;

    place_category_input += `search=${searchValue}`


    // 카테고리
    let selectedCategory = document.querySelector('.seltext').textContent.trim();

    if (selectedCategory === '식사' || selectedCategory === '주점' || selectedCategory === '카페') {
        let categoryValue = encodeURIComponent(selectedCategory);
        place_category_input += `&category=${categoryValue}`
    }

    const response = await fetch(`${BACKEND_BASE_URL}/place/search/${place_category_input}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    let response_json = await response.json();

    if (JSON.parse(payload)['is_staff']) {
        place_create.innerHTML += `
        <a href="place_create.html">
            <img src="static/image/add.png" style="width:20px">
        </a>
        `
    }

    if (response_json['results'] == '') {
        container.innerHTML += `<div style="margin-top: 100px; text-align:center;"><h2>일치하는 검색결과가 없습니다.</h2></div>`
    }

    response_json['results'].forEach((e, i) => {
        let place_id = e.id
        let name = e.title
        let category = e.category
        let content = e.content
        let address = e.address
        let image = e.image
        let score = e.score
        let bookmark = e.bookmark
        let book_count = e.bookmark_count
        let comment_count = e.comment_count
        let like_count = e.like_count

        container.innerHTML += `
        <div id="place${place_id}" class="place-container"></div>`

        let place = document.querySelector(`#place${place_id}`)

        // 이미지 시작
        if (image) {
            place.innerHTML += `
            <div>
                <a href="place_view.html?id=${place_id}">
                    <img class="place-container-img" src="${image['url']}" onclick="placePreUpdateView()">
                </a>
            </div>
            `
        } else {
            place.innerHTML += `
            <div style="width:230px; height:230px;">
            </div>`
        }
        // 이미지 끝
        // 북마크 시작
        let place_book = ``

        if (bookmark.includes(logined_user_id)) {

            place_book = `
            <a title="북마크">
                <img id="book${place_id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 40px;" alt="북마크" onclick="placeBook(${place_id})">
            </a>`
        } else {
            place_book = `
            <a title="북마크">
                <img id="book${place_id}" src="static/image/bookmark.png" style="margin-top:10px; width: 40px;" alt="북마크" onclick="placeBook(${place_id})">
            </a>`
        }
        // 북마크 끝
        // edit 버튼 시작
        let place_edit = ``

        if (JSON.parse(payload)['is_staff']) {
            place_edit = `
            <a>
                <img src="static/image/edit.png" style="margin-top:10px; width:20px;"
                    onclick="placePreUpdateView(${place_id})">
            </a>
            `
        }
        // edit 버튼 끝
        // container html 시작
        place.innerHTML += `
        <div class="place-container-text">
            <div class="place-container-main">
                <div class="place-container-title">
                    <div class="place-container-title0">
                        <h2>${i + 1}.</h2>
                    </div>
                    <div class="place-container-title1">
                        <h2><a class="place-container-title-a" href="place_view.html?id=${place_id}">${name}</a></h2>
                    </div>
                    <div class="place-container-title2">
                        <div class="place-container-score">
                            <h2>${score}</h2>
                        </div>
                    </div>
                    <div id="place_edit">
                    ${place_edit}
                    </div>
                </div>
                <div class="place-container-book" id="place-container-book">
                ${place_book}
                </div>
            </div>
            <div class="place-container-address">${address}</div>
            <div class="place-container-content">${content}</div>
            <div class="place-container-count">
                <div id="place-container-count-comment${place_id}" class="place-container-count-img">
                    <img src="static/image/chat.png">
                    ${comment_count}
                </div>
                <div id="place-container-count-like${place_id}" class="place-container-count-img">
                    <img src="static/image/heart (2).png">
                    ${like_count}
                </div>
                <div id="place-container-count-book${place_id}" class="place-container-count-img">
                    <img src="static/image/bookmark (2).png">
                    ${book_count}
                </div>
            </div>
            <div id="map"></div>
            
        </div>
        <div class="place-container-hr">
            <hr>
        </div>
        `
        // container html 끝
    })
}

let searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', placeSearchView);

let searchInput = document.querySelector('#place-search-input');
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        placeSearchView(event);
    }
});

// 지도 보여주기
async function placeShowMap(name, address) {
    let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 5 // 지도의 확대 레벨
        };

    // 지도를 생성합니다    
    let map = new kakao.maps.Map(mapContainer, mapOption);

    // 주소-좌표 변환 객체를 생성합니다
    let geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, function (result, status) {

        // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {

            let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            let marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            let infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:6px 0;">${name}</div>`
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        }
    });
}

// 소셜 공유하기
function sendSNS(sns) {
    let current_url = document.location.href;
    let title = document.querySelector('.place-detail-title').innerText.substring(5)
    let content = document.querySelector('.place-detail-font-content').innerText.substring(5)
    // let image = document.querySelector('.slider-img-size')

    if (sns == 'naver') {
        var url = "http://www.band.us/plugin/share?body=" + encodeURIComponent(title) + "&route=" + encodeURIComponent(current_url);
        window.open(url, "shareBand", "width=400, height=500, resizable=yes");
    } else if (sns == 'facebook') {
        let url = "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(current_url);
        window.open(url, "", "width=486, height=286");
    } else if (sns == 'twitter') {
        var url = "http://twitter.com/share?url=" + encodeURIComponent(title) + "&text=" + encodeURIComponent(current_url);
        window.open(url, "tweetPop", "width=486, height=286,scrollbars=yes");
    } else if (sns == 'kakao') {
        Kakao.init(KAKAO_JAVASCRIPT_API);
        Kakao.Link.createDefaultButton({
            container: '#kakao_sns', // HTML에서 작성한 ID값
            objectType: 'feed',
            content: {
                title: title,
                description: content,
                imageUrl: current_url,
                link: {
                    mobileWebUrl: current_url,
                    webUrl: current_url
                }
            }
        });
    }

}

// 공유하기 닫기
function closePopup() {
    $('html, body').css({
        'overflow': 'auto'
    });
    $("#popup").fadeOut(200);
}

// 공유하기 열기
function placeShare(place_id) {
    const share = document.querySelector('#modal_opne_btn')
    const place_modal = document.querySelector('#place_modal')
    const link_id = document.querySelector('#link_id')

    link_id.value = document.location.href;

    $('#popup').fadeIn(200);
    $('.popup').scrollTop(0);
}

// url 복사하기 버튼
function copyButton() {
    let inputTag = document.querySelector('#link_id')
    navigator.clipboard.writeText(inputTag.value)
}

// 장소추천 상세보기
async function placeDetailView(place_id, page = 1) {
    count_per_page = 5;
    show_page_cnt = 5;
    func_selected = 'placeDetailView'

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    const response_json = await response.json();

    // 검색, select 숨기기 시작
    let place_category = document.querySelector('#place-category')
    place_category.style.display = 'none';
    // 검색, select 숨기기 끝

    let comments = response_json['comment'];
    let name = response_json['place'].title;
    let category = response_json['place'].category;
    let sort = response_json['place'].sort;
    let content = response_json['place'].content;
    let address = response_json['place'].address;
    let image = response_json['place'].image;
    let score = response_json['place'].score;
    let price = response_json['place'].price;
    let hour = response_json['place'].hour;
    let holiday = response_json['place'].holiday;
    let place_hide = document.querySelector('#place');
    let like = response_json['place'].like;
    let bookmark = response_json['place'].bookmark;
    let comment_count = response_json['place'].comment_count;
    let like_count = response_json['place'].like_count;
    let book_count = response_json['place'].bookmark_count;
    let meeting = response_json['place'].meeting;
    let slide_container = document.querySelector('#place-image-slide');
    let slide = document.querySelector('#place-detail-slide-images');
    let place_show = document.querySelector('#place-container-div');
    let place = document.querySelector('#place-div');
    let meeting_div = document.querySelector('#place-meeting-list');
    const footer = document.getElementById('myFooter');
    page_data = meeting.length;
    meeting_div.innerHTML = ''

    if (footer) {
        footer.remove();
    }

    slide_container.style.display = ""
    place_show.style.display = ""

    // 이미지 슬라이더 시작
    let images = ``

    if (image) {
        for (let i = 0; i < image.length; i++) {
            images += `
            <div class="slider-img-size">
                <img src="${image[i]['url']}">
            </div>
            `
        }
    }

    slide.innerHTML = images
    // 이미지 슬라이더 끝

    // 미팅 리스트 시작
    meeting_div.innerHTML += `
    <div>
        <h3>이 장소의 만남 리스트</h3>
    </div>
    `
    meeting.slice(count_per_page * (page - 1), count_per_page * page).forEach((e) => {
        if (e.meeting_status == '모집중') {
            status_and_title =
                `<span style="color:green;"><${e.meeting_status}></span>`
        }
        else if (e.meeting_status == '자리없음') {
            status_and_title =
                `<span style="color:orange;"><${e.meeting_status}></span>`
        }
        else if (e.meeting_status == '모집종료') {
            status_and_title =
                `<span style="color:red;"><${e.meeting_status}></span>`
        }

        meeting_div.innerHTML += `
        <a onclick="go_meetingDetail(${e.id})">
            <div class="meeting-data">
                <div class="meeting-title-section">
                    <div class="meeting-status">${status_and_title}</div>
                    <div class="meeting-title">${e.title}</div>
                </div>
                <div class="meeting-info">모집인원 ${e.join_meeting}/${e.num_person_meeting}</div>
            </div>
        </a>
        `
    })



    // 미팅 리스트 끝

    // ================================ 상세보기 댓글 시작 ================================

    let comment = ``


    for (let i = 0; i < comments.length; i++) {
        // 시간 form 수정 시작
        let createdAt = comments[i]['created_at'];
        let date = new Date(createdAt);
        var formattedDate = date.toLocaleDateString('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }).split('/').reverse().join('/');

        var formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        var formattedDateTime = `${formattedDate}, ${formattedTime}`;
        // 시간 form 수정 끝



        // 댓글 추가하기 시작
        if (comments[i]['content'] == '삭제된 댓글입니다.') {
            comment += `
                        <div id="comment${comments[i]['id']}">
                            <div class="comment-text">[${comments[i]['user_name']}] ${comments[i]['content']}
                            </div>
                            <p><small>${formattedDateTime}</small></p>
                        </div>
                        <div style="display:none;" id="edit_comment${comments[i]['id']}"></div>
                        <hr>
                        `
        } else if ((JSON.parse(payload)['user_id'] == comments[i]['user'])) {
            comment += `
            <div id="comment${comments[i]['id']}">
                <div class="comment-text">[${comments[i]['user_name']}] ${comments[i]['content']}
                    <div>
                        <a>
                            <img src="static/image/comment_edit.png" class="comment_edit_icon" onclick="commentPreUpdate(${place_id}, ${comments[i]['id']})">
                        </a>
                        <a>
                            <img id="delete-image${comments[i]['id']}" src="static/image/comment_delete.png" class="comment_delete_icon" onmouseover="changeDeleteImage(${comments[i]['id']})" onmouseout="restoreDeleteImage(${comments[i]['id']})" onclick="commentDelete(${place_id}, ${comments[i]['id']})">
                        </a>
                    </div>
                </div>
                <p><small>${formattedDateTime}</small></p>
            </div>
            <div style="display:none;" id="edit_comment${comments[i]['id']}"></div>
            <small>
                <div id="reply${comments[i]['id']}" class="comment_btns">
                    <button class="commentbtn" onclick="replyPreWrite(${place_id}, ${comments[i]['id']})"">답글 작성하기</button>
                </div>
                <div style="display:none;" id="reply_edit${comments[i]['id']}"></div>
            </small>
            <hr>
            `
        } else {
            comment += `
            <div id="comment${comments[i]['id']}">
                <div class="comment-text">[${comments[i]['user_name']}] ${comments[i]['content']}
                </div>
                <p><small>${formattedDateTime}</small></p>
            </div>
            <small>
                <div id="reply${comments[i]['id']}" class="comment_btns">
                    <button class="commentbtn" onclick="replyPreWrite(${place_id}, ${comments[i]['id']})">답글 작성하기</button>
                </div>
                <div style="display:none;" id="reply_edit${comments[i]['id']}"></div>
            </small>
            <hr>
            `
        }

        // 댓글에 reply가 있을 때
        if (comments[i]['reply'].length > 0) {
            for (let j = 0; j < comments[i]['reply'].length; j++) {
                // 시간 form 수정 시작
                let createdAt = comments[i]['reply'][j]['created_at'];
                let date = new Date(createdAt);
                var formattedDate = date.toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit'
                }).split('/').reverse().join('/');

                var formattedTime = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                var formattedDateTime = `${formattedDate}, ${formattedTime}`;
                // 시간 form 수정 끝

                if ((JSON.parse(payload)['user_id'] == comments[i]['reply'][j]['user'])) {
                    comment +=
                        `
                        <div id="comment${comments[i]['reply'][j]['id']}" style="margin-left: 50px;">
                            <div class="comment-text">[${comments[i]['reply'][j]['user_name']}] ${comments[i]['reply'][j]['content']}
                                <div>
                                    <a>
                                        <img src="static/image/comment_edit.png" class="comment_edit_icon" onclick="commentPreUpdate(${place_id}, ${comments[i]['reply'][j]['id']})">
                                    </a>
                                    <a>
                                        <img id="delete-image${comments[i]['reply'][j]['id']}" src="static/image/comment_delete.png" class="comment_delete_icon" onmouseover="changeDeleteImage(${comments[i]['reply'][j]['id']})" onmouseout="restoreDeleteImage(${comments[i]['reply'][j]['id']})" onclick="commentDelete(${place_id}, ${comments[i]['reply'][j]['id']})">
                                    </a>
                                </div>
                            </div>
                            <p><small>${formattedDateTime}</small></p>
                        </div>
                        <div style="display:none;" id="edit_comment${comments[i]['reply'][j]['id']}"></div>
                        <hr>
                        `
                } else {
                    comment +=
                        `
                        <div id="comment${comments[i]['reply'][j]['id']}" style="margin-left: 50px;">
                            <div class="comment-text">[${comments[i]['reply'][j]['user_name']}] ${comments[i]['reply'][j]['content']}
                            </div>
                            <p><small>${formattedDateTime}</small></p>
                        </div>
                        <hr>
                        `
                }
            }
        }
        // 댓글 추가하기 끝
    }


    // ================================ 상세보기 댓글 끝 ================================
    // ================================ 북마크, 좋아요 및 권한설정 시작 ================================

    let book_html = ``
    let like_html = ``
    let auth_html = ``

    if (bookmark.includes(logined_user_id)) {
        book_html = `
        <a title="북마크">
            <img id="book${place_id}" src="static/image/bookmark (1).png" class="place-detail-book" alt="북마크" onclick="placeBook(${place_id},${book_count})">
        </a>`
    } else {
        book_html = `
        <a title="북마크">
            <img id="book${place_id}" src="static/image/bookmark.png" class="place-detail-book" alt="북마크" onclick="placeBook(${place_id})">
        </a>`
    }

    if (like.includes(logined_user_id)) {
        like_html = `
        <a title="좋아요">
            <img id="like${place_id}" src="static/image/heart (1).png" class="place-detail-like" alt="좋아요" onclick="placeLike(${place_id})">
        </a>`
    } else {
        like_html = `
        <a title="좋아요">
            <img id="like${place_id}" src="static/image/heart.png" class="place-detail-like" alt="좋아요" onclick="placeLike(${place_id})">
        </a>`
    }

    if (JSON.parse(payload)['is_staff']) {
        auth_html = `
        <a>
            <img src="static/image/edit.png" class="place-detail-edit" style="margin-left:20px;" onclick="placePreUpdateView(${place_id})">
        </a>
        <a>
            <img src="static/image/delete.png" class="place-detail-delete" onclick="placeDelete(${place_id})">
        </a>`
    }

    // ================================ 북마크, 좋아요 및 권한설정 끝 ================================

    let detail_category = ``

    if (sort) {
        if (sort.includes('카페/주점')) {
            if (sort.includes('-주점')) {
                detail_category = '/주점';
            } else { }
        } else {
            detail_category = `/${sort}`;
        }
    }

    place.innerHTML = `
    <div class="place-detail-container">
            <div class="place-detail-text">
                <div class="place-detail-top">
                    <div class="place-detail-title">
                        <h2>${name}</h2>
                    </div>
                    <div class="place-detail-score">
                        <h2>${score}</h2>
                    </div>
                    <div id="place-detail-auth">
                        ${auth_html}
                    </div>
                </div>
                <div class="place-detail-feed">
                    <a title="이 장소로 모임 생성하기">
                        <img id="in_place_create_meeting" src="static/image/people (1).png" class="place-detail-share" alt="모임생성하기"
                            onclick="go_createMeeting(${place_id})">모임생성
                    </a>
                </div>
            </div>
            <div class="place-container-bottom">
                <div class="place-container-count" style="justify-content: start; align-items: end; margin-bottom: 20px;">
                    <div class="place-detail-category">
                        <div>${category}${detail_category}</div>
                    </div>
                    <div id="place-container-count-comment${place_id}" class="place-container-count-img" style="margin-left:0px; margin-right:12px; ">
                        <img src="static/image/chat.png">
                        ${comment_count}
                    </div>
                    <div id="place-container-count-like${place_id}" class="place-container-count-img" style="margin-left:0px; margin-right:12px; ">
                        <img src="static/image/heart (2).png">
                        ${like_count}
                    </div>
                    <div id="place-container-count-book${place_id}" class="place-container-count-img" style="margin-left:0px; margin-right:12px; ">
                        <img src="static/image/bookmark (2).png">
                        ${book_count}
                    </div>
                </div>
                <div class="place-empathy">
                    ${book_html}
                    ${like_html}
                    <a title="공유하기">
                        <img id="modal_opne_btn" src="static/image/share.png" class="place-detail-share" alt="공유하기"
                            onclick="placeShare(${place_id})">
                    </a>
                </div>
            </div>
            <hr>
            <div class="place-detail-content">
                <div class="place-detail-content-grid">
                    <div class="place-detail-content-grid-1" >
                        <div class="place-detail-font-gray">주소</div>
                        <div class="place-detail-font-gray">카테고리</div>
                        <div class="place-detail-font-gray">가격대</div>
                        <div class="place-detail-font-gray">영업시간</div>
                        <div class="place-detail-font-gray">휴일</div>
                        <div class="place-detail-font-gray" style="margin-top: 20px;">내용</div>
                    </div>
                    <div class = "place-detail-content-grid-2">
                        <div style="margin-bottom:10px">${address}</div>
                        <div style="margin-bottom:10px">${category}${detail_category}</div>
                        <div style="margin-bottom:10px">${price}</div>
                        <div style="margin-bottom:10px">${hour}</div>
                        <div style="margin-bottom:10px">${holiday}</div>
                        <div class="place-detail-font-content">${content}</div>
                    </div>
                    <div class="place-detail-map" id="map">
                    </div>
                </div>
            </div>
            <hr>
            <div class="place-comment-section">
            <div class="create_comment_box">
                <div>
                    <textarea name="" id="comments" class="textareaCommentclass" placeholder="댓글을 입력해주세요" cols="110" rows="4"></textarea>
                </div>
                <button class="commentbtn" onclick="commentWrite(${place_id})">작성완료</button>
            </div>
            <div class="comment_card_class">
            <h4>댓글</h4>
            <hr>
            ${comment}
            </div>
            </div>
        </div>
    
    `
    placeShowMap(name, address)
    setPaging(page)
    imageSlider()

}

function changeDeleteImage(id) {
    document.querySelector(`#delete-image${id}`).src = 'static/image/comment_delete (1).png'

}

function restoreDeleteImage(id) {
    document.querySelector(`#delete-image${id}`).src = 'static/image/comment_delete.png'

}

// 장소 북마크
async function placeBook(place_id) {
    const book = document.querySelector(`#book${place_id}`)

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (response_json["message"] == "북마크") {
        book['src'] = "static/image/bookmark (1).png"
        alert("북마크가 추가되었습니다.");
    } else {
        book['src'] = "static/image/bookmark.png"
        alert("북마크가 취소되었습니다.");
    }

    const bookCountElements = document.querySelector(`#place-container-count-book${place_id}`);
    const book_count = response_json["book_count"]
    bookCountElements.innerHTML = `<img src="static/image/bookmark (2).png">${book_count}`;
}

// 장소 좋아요
async function placeLike(place_id) {
    const like_id = document.querySelector(`#like${place_id}`)

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/like/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();


    if (response_json["message"] == "좋아요") {
        like_id['src'] = "static/image/heart (1).png"
        alert("좋아요.");
    } else {
        like_id['src'] = "static/image/heart.png"
        alert("좋아요 취소!");
    }

    const likeCountElements = document.querySelector(`#place-container-count-like${place_id}`);
    const like_count = response_json["like_count"]
    likeCountElements.innerHTML = `<img src="static/image/heart (2).png">${like_count}`;
}

// 장소추천 수정전 html 띄워주기
async function placePreUpdateView(place_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    const response_json = await response.json();

    let foot = document.querySelector('#myFooter')

    if (foot) {
        foot.style.display = 'none';
    }


    let name = response_json['place'].title
    let category = response_json['place'].category
    let content = response_json['place'].content
    let address = response_json['place'].address
    let image = response_json['place'].image
    let score = response_json['place'].score
    let price = response_json['place'].price
    let hour = response_json['place'].hour
    let holiday = response_json['place'].holiday

    let place = document.querySelector('#place')
    let place_div = document.querySelector('#place-container-div')
    let slide = document.querySelector('#place-image-slide')
    slide.style.display = "none";

    place_div.innerHTML = ''
    let images = ``

    if (image) {
        for (let i = 0; i < image.length; i++) {
            images += `
            <div class="img_container" id="img_container${image[i]['id']}">
                <div class="image-wrapper">
                    <img id="image${image[i]['id']}" class="image_preview" src="${image[i]['url']}"></img>
                    <a>
                        <img id="delete-image${image[i]['id']}" src="static/image/comment_delete.png" class="image-button" onmouseover="changeDeleteImage(${image[i]['id']})" onmouseout="restoreDeleteImage(${image[i]['id']})" onclick="imageDelete(${place_id}, ${image[i]['id']})">
                    </a>
                </div>
            </div>
            `
        }
    }

    place.innerHTML = `
    <div class="wrapper">
        <h1 class="create_h1">Place Eidt</h1>
        <h5 class="create_h5">추천할 맛집을 수정합니다.</h5>
        <form class="create_form">
            <div class="group">
                <input id="name" class="create_input" type="text" required="required" value="${name}"/><span
                    class="highlight"></span><span class="bar"></span>
                <label class="create_label">제목</label>
            </div>
            <div class="group">
                <select id="category" class="create_input" type="text" required="required">
                    <option value="${category}">수정안함</option>
                    <option value="밥">밥</option>
                    <option value="술">술</option>
                    <option value="카페">카페</option>
                </select><span class="highlight"></span><span class="bar"></span>
                <label class="create_label">카테고리</label>
            </div>
            <div class="group">
                <textarea id="content" class="create_input" type="textarea" rows="10"
                    required="required" >${content}</textarea><span class="highlight"></span><span class="bar"></span>
                <label class="create_label">내용</label>
            </div>
            <div class="group">
                <input id="address" class="create_input" type="text" required="required" value="${address}"/><span
                    class="highlight"></span><span class="bar"></span>
                <label class="create_label">주소</label>
            </div>
            <div class="group">
                <input id="score" class="create_input" type="number" step="0.1" required="required" value="${score}"/><span
                    class="highlight"></span><span class="bar"></span>
                <label class="create_label">별점</label>
            </div>
            <div class="group">
                <input id="price" class="create_input" type="text" required="required" value="${price}"/><span
                    class="highlight"></span><span class="bar"></span>
                <label class="create_label">가격</label>
            </div>
            <div class="group">
                <input id="hour" class="create_input" type="text" required="required" value="${hour}"/><span
                    class="highlight"></span><span class="bar"></span>
                <label class="create_label">영업시간</label>
            </div>
            <div class="group">
                <input id="holiday" class="create_input" type="text" required="required" value="${holiday}"/><span
                    class="highlight"></span><span class="bar"></span>
                <label class="create_label">휴일</label>
            </div>
            <div class="row">
                <div id="get_image_container" class="image_container">
                ${images}
                </div>
            </div>
            <div class="file_class">
                <input id="images" type="file" class="file_input" onchange="setThumbnail(event);" multiple /><span
                    class="highlight"></span><span class="bar_input"></span>
                <label class="create_label">업로드 된 파일</label>
                <button class="btn btn-add" type="button" onclick="imageAdd(${place_id}, 1)">추가하기</button>
            </div>
        </form>
    </div>
    <div class="row">
        <div id="image_container" class="image_container">
        </div>
    </div>
    <div class="btn-box">
        <button class="btn btn-submit" type="button" onclick="placeUpdate(${place_id})">submit</button>
        <button class="btn btn-cancel" type="button" onclick="go_placeDetailView(${place_id})">cancel</button>
    </div>
    `

}

// 장소추천 수정하기
async function placeUpdate(place_id) {
    let name = document.querySelector('#name')
    let category = document.querySelector('#category')
    let content = document.querySelector('#content')
    let address = document.querySelector('#address')
    let score = document.querySelector('#score')
    let price = document.querySelector('#price')
    let hour = document.querySelector('#hour')
    let holiday = document.querySelector('#holiday')


    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id} `, {
        headers: {
            Authorization: "Bearer " + logined_token,
            "content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
            title: name.value,
            category: category.value,
            content: content.value,
            address: address.value,
            score: score.value,
            price: price.value,
            hour: hour.value,
            holiday: holiday.value,
        })
    })

    window.location.href = `place_view.html?id=${place_id} `;

}

// 장소추천 삭제하기
async function placeDelete(place_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "DELETE",
    });

    if (response.status == 200) {
        alert("삭제가 완료되었습니다.");
    }

    window.location.replace(`${FRONTEND_BASE_URL}/place_view.html`);
}

// 이미지 추가하기
async function imageAdd(place_id, place_image_id) {
    let images = document.querySelector('#images')

    const formdata = new FormData();

    for (let i = 0; i < images.files.length; i++) {
        formdata.append("image", images.files[i]);
    }

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/image/${place_image_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
        body: formdata,
    });
    if (response.status == 200) {
        alert("이미지가 추가되었습니다.");
        window.location.href = `place_view.html?id=${place_id}`;
    } else {
        alert(response_json["message"]);
    }
}

// 이미지 삭제하기
async function imageDelete(place_id, place_image_id) {

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/image/${place_image_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
            'content-type': 'application/json'
        },
        method: "DELETE",

    })
    $(`#img_container${place_image_id}`).hide()
    // window.location.href = `place_view.html?id=${place_id}`;
}

// 댓글 작성하기
async function commentWrite(place_id) {

    const comment = document.querySelector('#comments')

    const formdata = new FormData();
    formdata.append("content", comment.value)


    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
        body: formdata,
    });

    const response_json = await response.json();

    if (response.status == 200) {
        alert("댓글이 등록되었습니다.");
    } else if (response.status == 400) {
        alert(response_json["message"]);
    } else if (
        comment == ""
    ) {
        alert("빈칸을 입력해 주세요.");
    }

    window.location.href = `place_view.html?id=${place_id}`;
}

// 대댓글 작성하기
async function replyWrite(place_id, place_comment_id) {

    let reply = document.querySelector(`#reply_write${place_comment_id}`)

    const formdata = new FormData();
    formdata.append('content', reply.value);

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
        body: formdata,
    });

    window.location.href = `place_view.html?id=${place_id}`;
}

// 대댓글 작성 폼 띄우기
async function replyPreWrite(place_id, place_comment_id) {

    let reply = document.querySelector(`#reply${place_comment_id}`)
    let reply_edit = document.querySelector(`#reply_edit${place_comment_id}`)

    reply.style.display = 'none';
    reply_edit.style.display = '';

    reply_edit.innerHTML = `
    <input id="reply_write${place_comment_id}" class="reply-input" type="text"/>
    <button type="button" class="button-blue" style="margin-right:5px" onclick="replyWrite(${place_id}, ${place_comment_id})">완료</button>
    <button type="button" class="button-white" onclick="replyCancel(${place_id}, ${place_comment_id})">취소하기</button>
    `
}

// 대댓글 작성 취소
async function replyCancel(place_id, place_comment_id) {
    let reply = document.querySelector(`#reply${place_comment_id}`);
    let reply_edit = document.querySelector(`#reply_edit${place_comment_id}`);

    reply.style.display = '';
    reply_edit.style.display = 'none';
}


// 댓글 수정 폼 띄우기
async function commentPreUpdate(place_id, place_comment_id) {
    let comment = document.querySelector(`#comment${place_comment_id}`);
    let edit = document.querySelector(`#edit_comment${place_comment_id}`);

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    const response_json = await response.json();

    comment.style.display = 'none';
    edit.style.display = '';

    edit.innerHTML = `
    <input id='comment_update' class="reply-input" value="${response_json["content"]}"/>
    <button type="button" class="button-blue" onclick="commentUpdate(${place_id}, ${place_comment_id})">수정하기</button>
    <button type="button" class="button-white" onclick="commentCancel(${place_id}, ${place_comment_id})">취소하기</button>
    `
}

// 댓글 수정하기 취소
function commentCancel(place_id, place_comment_id) {
    let comment = document.querySelector(`#comment${place_comment_id}`);
    let edit = document.querySelector(`#edit_comment${place_comment_id}`);

    comment.style.display = '';
    edit.style.display = 'none';
}

// 댓글 수정하기
async function commentUpdate(place_id, place_comment_id) {

    const comment_update = document.querySelector('#comment_update')

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
            content: comment_update.value,
        })
    });
    window.location.href = `place_view.html?id=${place_id}`;

}

// 댓글 삭제하기
async function commentDelete(place_id, place_comment_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "DELETE",
    });
    alert('댓글이 삭제되었습니다.')

    window.location.href = `place_view.html?id=${place_id}`;
}

// 이미지 슬라이더 시작
function imageSlider() {
    let pages = 0;//현재 인덱스 번호
    let positionValue = 0;//images 위치값
    const IMAGE_WIDTH = 260;//한번 이동 시 IMAGE_WIDTH만큼 이동한다.
    //DOM
    const backBtn = document.querySelector(".back")
    const nextBtn = document.querySelector(".next")
    let image_container = document.querySelector('#place-image-slide');
    let images_tag = image_container.getElementsByTagName('img');
    let image_count = images_tag.length - 4
    let detail_images = document.querySelector('#place-detail-slide-images')

    if (image_count <= 0) {
        nextBtn.setAttribute('disabled', 'true')
    }

    function next() {
        if (pages < image_count) {
            backBtn.removeAttribute('disabled')//뒤로 이동해 더이상 disabled가 아니여서 속성을 삭제한다.
            positionValue -= IMAGE_WIDTH;//IMAGE_WIDTH의 증감을 positionValue에 저장한다.
            detail_images.style.transform = `translateX(${positionValue}px)`;
            //x축으로 positionValue만큼의 px을 이동한다.
            pages += 1; //다음 페이지로 이동해서 pages를 1증가 시킨다.
        }
        if (pages === image_count) { //
            nextBtn.setAttribute('disabled', 'true')//마지막 장일 때 next버튼이 disabled된다.
        }
    }

    function back() {
        if (pages > 0) {
            nextBtn.removeAttribute('disabled')
            positionValue += IMAGE_WIDTH;
            detail_images.style.transform = `translateX(${positionValue}px)`;
            pages -= 1; //이전 페이지로 이동해서 pages를 1감소 시킨다.
        }
        if (pages === 0) {
            backBtn.setAttribute('disabled', 'true')//마지막 장일 때 back버튼이 disabled된다.
        }
    }

    function init() {  //초기 화면 상태
        backBtn.setAttribute('disabled', 'true'); //속성이 disabled가 된다.
        backBtn.addEventListener("click", back); //클릭시 다음으로 이동한다.
        nextBtn.addEventListener("click", next);//클릭시 이전으로 이동한다.
    }

    init();

}

// 이미지 미리보기
function setThumbnail(event) {
    var container = document.querySelector("#image_container");
    container.innerHTML = '';

    var images = event.target.files;

    for (var i = 0; i < images.length; i++) {
        var reader = new FileReader();
        var image = images[i];

        reader.onload = (function (file) {
            return function (event) {
                var img = document.createElement("img");
                img.setAttribute("src", event.target.result);
                img.setAttribute("class", "img_preview");

                var imgContainer = document.createElement("div");
                imgContainer.setAttribute("class", "img_container");
                imgContainer.appendChild(img);

                container.appendChild(imgContainer);
            };
        })(image);

        reader.readAsDataURL(image);
    }
}