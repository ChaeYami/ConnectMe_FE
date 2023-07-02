
const logined_token = localStorage.getItem("access");
const count_per_page = 15; // 페이지당 데이터 건수
const show_page_cnt = 10; // 화면에 보일 페이지 번호 개수
let page_data = 0;


$(document).ready(function () {
    getCounsels()
})

// 페이지네이션 시작
$(function () {

    $(document).on('click', 'div.paging>div.pages>span', function () {
        if (!$(this).hasClass('active')) {
            $(this).parent().find('span.active').removeClass('active');
            $(this).addClass('active');
            let page_num = Number($(this).text())

            getCounsels(page_num);
        }
    });

    $(document).on('click', 'div.paging>i', function () {
        let totalPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);
        const id = $(this).attr('id')
        let page_num = Number($(this).text())
        let first_page_id = document.querySelector('#first_page')
        let prev_page_id = document.querySelector('#prev_page')

        first_page_id.style.display = "";
        prev_page_id.style.display = "";


        if (id == 'first_page') {
            getCounsels(1);
        } else if (id == 'prev_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const prevPage = Math.min(...arrPages) - show_page_cnt;
            getCounsels(prevPage);
        } else if (id == 'next_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const nextPage = Math.max(...arrPages) + 1;
            getCounsels(nextPage);
        } else if (id == 'last_page') {
            const lastPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);

            getCounsels(lastPage);
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
    for (const end = start + show_page_cnt; start < end && start <= totalPage; start++) {
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

// 게시글 목록 가져오기
async function getCounsels(pages = 1) {
    $('#list-section').empty()

    let consel_page = `?page=${pages}`

    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/${consel_page}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const rows = response["counsel"];
            page_data = response["total-page"];
            let foot = document.querySelector('#myFooter')

            foot.style.display = ''

            for (let i = 0; i < rows.length; i++) {
                let counsel_id = rows[i]['id']
                let counsel_title = rows[i]['title']
                let counsel_author = rows[i]['user']['nickname']
                let counsel_created_at = rows[i]['created_at']
                let likes_count = rows[i]['like'].length
                let counsel_comment_count = rows[i]['comment_count']

                let temp_html = `
                <a onclick="go_counselDetail(${counsel_id})">
                    <div class="list-box">
                        <div id="counsel-title">${counsel_title}<div id="counsel-comment-count">[${counsel_comment_count}]</div></div>
                        <div id="counsel-author"><a onclick="go_myProfile()">${counsel_author}</a></div>
                        <div id="counsel-created-at">${counsel_created_at}</div>
                        <div id="counsel-likes">${likes_count}</div>
                    </div>
                </a>
                <hr>
                `
                $('#list-section').append(temp_html)
            }
            setPaging(pages);
        },
        error: function () {
            alert(response.status);
        }

    })
}
