
const logined_token = localStorage.getItem("access");


$(document).ready(function () {
    getCounsels()
})


// 게시글 목록 가져오기
async function getCounsels() {
    $('#list-section').empty()


    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const rows = response;
            for (let i = 0; i < rows.length; i++) {
                let counsel_id = rows[i]['id']
                let counsel_title = rows[i]['title']
                let counsel_author = rows[i]['user']
                let counsel_created_at = rows[i]['created_at']
                let likes_count = rows[i]['like'].length

                let temp_html = `
                <a onclick="go_counselDetail(${counsel_id})">
                    <div class="list-box">
                        <div id="counsel-title">${counsel_title}</div>
                        <div id="counsel-author">${counsel_author}</div>
                        <div id="counsel-created-at">${counsel_created_at}</div>
                        <div id="counsel-likes">${likes_count}</div>
                    </div>
                </a>
                <hr>
                `
                $('#list-section').append(temp_html)
            }
        },
        error: function () {
            alert(response.status);
        }
        
    })
}


function go_counselDetail(counsel_id){
    location.href = `counsel_detail.html?counsel_id=${counsel_id}`
}