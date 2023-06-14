
const logined_token = localStorage.getItem("access");
$(document).ready(function () {
    recommend('all')
});

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
            if (rows[0] == undefined) {
                console.log('없음')
                if (filter == 'age'){
                    filter = '나이가'
                }else if (filter == 'mbti'){
                    filter = 'MBTI가'
                }else if (filter == 'region'){
                    filter = '지역이'
                }
                let temp_html = `해당 조건에 맞는 유저가 존재하지 않거나 프로필에 설정된 ${filter} 없습니다.`
                $('#list-section').append(temp_html)

            } else {
                console.log(rows[0])
                for (let i = 0; i < rows.length; i++) {
                    let user_nickname = rows[i]['nickname']
                    let user_region = rows[i]['prefer_region']
                    let user_age = rows[i]['age']
                    let user_mbti = rows[i]['mbti']
                    let user_introduce = rows[i]['introduce']
                    let user_profile_img=rows[i]['profile_img']

                    let temp_html = `<div class="card">
                    <div class="image_box">
                        <img class="image" src="${BACKEND_BASE_URL}${user_profile_img}" style = "width : 200px;"alt="">
                    </div>
                    <div class="user_info">
                        <div class="user_nickname">
                            ${user_nickname}
                        </div>
                        <div class="ect">
                            ${user_region}
                            ${user_age}
                            ${user_mbti}
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