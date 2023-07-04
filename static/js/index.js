if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
    let code = new URLSearchParams(window.location.search).get("code");
    let state = new URLSearchParams(window.location.search).get("state");
    let hashParams = new URLSearchParams(window.location.hash.substring(1));
    let google_token = hashParams.get("access_token");

    if (code) {
        if (state) {
            getNaverToken(code, state);
        } else {
            getKakaoToken(code);
        }
    } else if (google_token) {
        getGoogleToken(google_token);
    }

} else {
    go_login()
}

const logined_token = localStorage.getItem("access");

$(document).ready(function () {
    recommend('all');
    counselList();
    meetingList()


    const params = new URLSearchParams(window.location.search).get('showAPI');
    if (params) {
        if (confirm("위치권한에 동의하시겠습니까?")) {
            navigator.geolocation.getCurrentPosition(SuccessLocation, null);
        } else {
            navigator.geolocation.getCurrentPosition(null, onGeoError);
        }
    }
});



function setLocalStorage(response) {
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );
        localStorage.setItem("payload", jsonPayload);
        go_api()
    } else {
        alert(response_json.error);
        window.location.replace('login.html')
    }
}


async function getKakaoToken(kakao_code) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/kakao/`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            code: kakao_code
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getGoogleToken(google_token) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/google/`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            access_token: google_token
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/naver/`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            naver_code: naver_code,
            state: state
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}


// 추천 유저목록
async function recommend(filter) {
    $('#list-section').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/recommend/${filter}/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response;

            for (let i = 0; i < rows.length; i++) {
                let user_pk = rows[i]['id']
                let user_nickname = rows[i]['nickname']
                let user_region = rows[i]['prefer_region']
                let user_profile_img = rows[i]['profile_img']
                if (user_profile_img == null) {
                    user_profile_img = 'static/image/user.png'
                } else {
                    user_profile_img = `${BACKEND_BASE_URL}${user_profile_img}`
                }


                let temp_html = `<a onclick="go_profile(${user_pk})"><div class="card">
                    <div class="image_box">
                        <img class="image" src="${user_profile_img}"alt="">
                    </div>
                    <div class="user_info">
                        <div class="user_nickname">
                            ${user_nickname}
                        </div>
                        <div class="ect">
                            ${user_region}
                        </div>

                    </div>
                </div></a>`

                $('#list-section').append(temp_html)
            }


        }, error: function () {
            alert(response.status);
        }
    })

}


// 만남의 광장
async function meetingList(){
    $('#meeting-list-section').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/meeting/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response["meeting"];
            console.log(rows)
            for (let i = 0; i < 4; i++) {
                let id = rows[i]['id'];
                let title = rows[i]['title'];
                let user = rows[i]['user'];
                let comment_count = rows[i]['comment_count'];
                let meeting_city = rows[i]['meeting_city'];
                let num_person_meeting = rows[i]['num_person_meeting'];
                let meeting_status = rows[i]['meeting_status'];
                let join_meeting_count = rows[i]['join_meeting_count'];
                let status= '';

                if (meeting_status == '모집중') {
                    status=
                        `<span style="color:green;"><${meeting_status}></span>`
                }
                else if (meeting_status == '자리없음') {
                    status=
                        `<span style="color:orange;"><${meeting_status}></span>`
                }
                else if (meeting_status == '모집종료') {
                    status=
                        `<span style="color:red;"><${meeting_status}></span>`
                }
                if(rows[i].meeting_image[0]){
                    let meeting_image = rows[i]['meeting_image'][0]["image"];
                    if (meeting_image.includes('http')) {
                        if (meeting_image.includes('www')) {
                            image = meeting_image.slice(16);
                            let decodedURL = decodeURIComponent(image);
                            img_urls = `http://${decodedURL}`
                        } else {
                            image = meeting_image.slice(15);
                            let decodedURL = decodeURIComponent(image);
                            img_urls = `http://${decodedURL}`
                        }
                    } else {
                        img_urls = `${BACKEND_BASE_URL}${meeting_image}`
                    }
                }else{
                    img_urls = `static/image/—Pngtree—two little kittens_852610.png" alt="" style = "opacity:0.7; filter : grayscale(30%)`
                }

                let temp_html = `
                <div class="card">
                    <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;">
                        <div class = "meeting-title-section">
                            <div class="meeting-status">${status}</div>
                            <div class="meeting-title">${title}</div>
                            
                        </div>
                        <div class="meeting-img"><img class="meeting_list_image" src="${img_urls}" alt=""></div>
                        <div class="meeting-info">
                            <div>${meeting_city}</div>
                            <div>${join_meeting_count} / ${num_person_meeting}</div>
                        </div>
                    </div>
                </div>
                `

                $('#meeting-list-section').append(temp_html)
            }


        }, error: function () {
            alert(response.status);
        }


    })
        
    
}


// 고민상담
async function counselList() {
    $('#counsel-list-section').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response["counsel"];
            for (let i = 0; i < 3; i++) {
                let counsel_id = rows[i]['id']
                let counsel_title = rows[i]['title']
                let counsel_comment_count = rows[i]['comment_count']

                let temp_html = `

                <div class="content" onclick="go_counselDetail(${counsel_id})" style="cursor:pointer;">
                    <div id="home-counsel-title">${counsel_title}</div>
                    <div id="home-counsel-comment" class="comment-count">[${counsel_comment_count}]</div>
                </div>
                `

                $('#counsel-list-section').append(temp_html)
            }


        }, error: function () {
            alert(response.status);
        }
    })

}

// 스크롤 이벤트 리스너 등록
window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    let viewportHeight = window.innerHeight;
    let documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition + viewportHeight >= documentHeight) {
      document.querySelector('.bot-nav').style.marginBottom = '250px'; 
    } else {
      document.querySelector('.bot-nav').style.marginBottom = '0px'; 
    }
  });


// // 추천 핫플레이스
// async function recommendHotPlace() {
//     let container = document.querySelector('#place-section')

//     container.innerHTML = ``

//     let place_category_input = `?search=`

//     const response = await fetch(`${BACKEND_BASE_URL}/place/category/${place_category_input}`, {
//         headers: {
//             Authorization: "Bearer " + logined_token,
//         },
//         method: "GET",
//     });

//     let response_json = await response.json();

//     response_json['results'].forEach((e, i) => {
//         let place_id = e.id
//         let name = e.title
//         let category = e.category
//         let content = e.content
//         let address = e.address
//         let image = e.image
//         let score = e.score
//         let bookmark = e.bookmark
//         let book_count = e.bookmark_count
//         let comment_count = e.comment_count
//         let like_count = e.like_count

//         container.innerHTML += `
//         <div id="place${place_id}" class="place-container"></div>`

//         let place = document.querySelector(`#place${place_id}`)

//         // 이미지 시작
//         if (image) {
//             place.innerHTML += `
//             <div>
//                 <a href="place_view.html?id=${place_id}">
//                     <img class="place-container-img" src="${image['url']}" onclick="placePreUpdateView()">
//                 </a>
//             </div>
//             `
//         } else {
//             place.innerHTML += `
//             <div style="width:230px; height:230px;">
//             </div>`
//         }
//         // 이미지 끝
//         // 북마크 시작
//         let place_book = ``

//         if (bookmark.includes(logined_user_id)) {

//             place_book = `
//             <a>
//                 <img id="book${place_id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 40px;" alt="북마크" onclick="placeBook(${place_id})">
//             </a>`
//         } else {
//             place_book = `
//             <a>
//                 <img id="book${place_id}" src="static/image/bookmark.png" style="margin-top:10px; width: 40px;" alt="북마크" onclick="placeBook(${place_id})">
//             </a>`
//         }
//         // 북마크 끝
//         // edit 버튼 시작
//         let place_edit = ``

//         if (JSON.parse(payload)['is_staff']) {
//             place_edit = `
//             <a>
//                 <img src="static/image/edit.png" style="margin-top:10px; width:20px;"
//                     onclick="placePreUpdateView(${place_id})">
//             </a>
//             `
//         }
//         // edit 버튼 끝
//         // container html 시작
//         place.innerHTML += `
//         <div class="place-container-text">
//             <div class="place-container-main">
//                 <div class="place-container-title">
//                     <div class="place-container-title0">
//                         <h2>${i + 1}.</h2>
//                     </div>
//                     <div class="place-container-title1">
//                         <h2><a class="place-container-title-a" href="place_view.html?id=${place_id}">${name}</a></h2>
//                     </div>
//                     <div class="place-container-title2">
//                         <div class="place-container-score">
//                             <h2>${score}</h2>
//                         </div>
//                     </div>
//                     <div id="place_edit">
//                     ${place_edit}
//                     </div>
//                 </div>
//                 <div class="place-container-book" id="place-container-book">
//                 ${place_book}
//                 </div>
//             </div>
//             <div class="place-container-address">${address}</div>
//             <div class="place-container-content">${content}</div>
//             <div class="place-container-count">
//                 <div class="place-container-count-img">
//                     <img src="static/image/chat.png">
//                     ${comment_count}
//                 </div>
//                 <div class="place-container-count-img">
//                     <img src="static/image/heart (2).png">
//                     ${like_count}
//                 </div>
//                 <div class="place-container-count-img">
//                     <img src="static/image/bookmark (2).png">
//                     ${book_count}
//                 </div>
//             </div>
//             <div id="map"></div>
            
//         </div>
//         <div class="place-container-hr">
//             <hr>
//         </div>
//         `
//         // container html 끝
//     })
// }

