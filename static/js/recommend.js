$(document).ready(function () {
    isFriend()
    recommend('all')
    $('#recommend-select').change(function () {
        let recommend_value = $(this).val();
        recommend(recommend_value);
    });
});


const friend_id_list = [];

async function isFriend() {

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/friend/list/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {

            const rows = response;
            for (let i = 0; i < rows.length; i++) {
                let friend_id = ''
                if (logined_user_id == rows[i]['from_user']) {
                    friend_id = rows[i]['to_user']
                } else {
                    friend_id = rows[i]['from_user']
                }

                friend_id_list.push(friend_id);
            }
        }
    })
}


// 추천 유저목록
async function recommend(filter_) {
    $('#list-section').empty()
    $('.condition').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/recommend/${filter_}/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response;
            if (rows[0] == undefined) {
                if (filter_ == 'age_range') {
                    filter_ = '나이가'
                } else if (filter_ == 'mbti') {
                    filter_ = 'MBTI가'
                } else if (filter_ == 'prefer_region') {
                    filter_ = '지역이'
                }
                let temp_html = `해당 조건에 맞는 유저가 존재하지 않거나 프로필에 설정된 ${filter_} 없습니다.`
                $('#list-section').append(temp_html)

            } else {
                let filter__ = ''
                if (filter_ == 'age_range') {
                    filter__ = '나이'
                } else if (filter_ == 'mbti') {
                    filter__ = 'MBTI'
                } else if (filter_ == 'prefer_region') {
                    filter__ = '지역'
                } else if (filter_ == 'all') {
                    filter__ = '전체'
                }
                if (rows[0][filter_]) {
                    let condition = `${filter__} : ${rows[0][filter_]}`
                    $('.condition').append(condition)
                }

                for (let i = 0; i < rows.length; i++) {
                    let user_pk = rows[i]['id']
                    let user_nickname = rows[i]['nickname']
                    let user_region = rows[i]['prefer_region']
                    let user_age_range = rows[i]['age_range']
                    let user_mbti = rows[i]['mbti']

                    let user_introduce = rows[i]['introduce']
                    if (user_introduce) {
                        user_introduce = rows[i]['introduce']
                    } else {
                        user_introduce = '<span class="no_intro">등록된 소개가 없습니다.</span>'
                    }


                    let user_profile_img = rows[i]['profile_img']
                    if (user_profile_img == null) {
                        user_profile_img = 'static/image/user.png'
                    } else {
                        user_profile_img = `${BACKEND_BASE_URL}${user_profile_img}`
                    }

                    display = ''
                    if (friend_id_list.includes(user_pk)) {
                        display = 'none'
                    } else {
                        display = 'inline'
                    }

                    let temp_html = `<a onclick="go_profile(${user_pk})"><div class="card">
                    <div class="image_box">
                        <img class="image" src="${user_profile_img}" alt="">
                    </div>
                    </a>
                    <div class="user_info">
                        <div class="user_nickname">
                        <a onclick="go_profile(${user_pk})">${user_nickname}</a>
                        
                            <button id="addFriend" onclick="addFriend(${user_pk})" style="display:${display}"> 친구신청 </button>
                        </div>
                        <div class="ect">
                            지역 : ${user_region} | 
                            나이대 : ${user_age_range} | 
                            MBTI : ${user_mbti}
                        </div>
                        <div class = "intro">
                            ${user_introduce}
                        </div>
                    </div>
                </div>`

                    $('#list-section').append(temp_html)
                }
            }

        }, error: function () {
            alert(response.status);
        }
    })

}


// 친구신청 버튼 눌렀을 때
async function addFriend(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/friend/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + logined_token
        },
        method: "POST",
    });

    if (response.status == 201) {
        swal("친구신청을 보냈습니다.", '', 'success')
    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
    }
}