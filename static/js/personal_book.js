const logined_token = localStorage.getItem("access");
const user_id = new URLSearchParams(window.location.search).get('id');

window.onload = () => {
    placeBookList(user_id)
}

// 장소 북마크 가져오기
async function placeBookList(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${user_id}/book/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    const response_json = await response.json();

    response_json.forEach((e, i) => {

        let place_id = e.id;
        let address = e.address;
        let category = e.category;
        let sort = e.sort;
        let image = e.image.url;
        let title = e.title;
        let score = e.score;
        let cards = document.querySelector('#hotplace-book-cards');


        let sort_html = ``
        if (sort) {
            if (sort.includes('카페/주점')) {
                if (sort.includes('-주점')) {
                    sort_html = '/주점';
                } else { }
            } else {
                sort_html = `/${sort}`;
            }
        }

        cards.innerHTML += `
        <div class="hotplace-card">
            <div class="hotplace-image">
                <img src="${image}">
                <a>
                    <img id="hotplace-img${place_id}" src="static/image/bookmark (1).png" onclick="placeBook(${place_id})">
                </a>
            </div>
            <div class="hotplace-content">
                <div class="hotplace-title">
                    <h2>${title}</h2>
                </div>
                <div class="hotplace-score">
                    <h2>${score}</h2>
                </div>
                <div>
                    ${address}
                </div>
                <div>
                    ${category}${sort_html}
                </div>
            </div>
        </div>
        `
    });
}


// 장소 북마크
async function placeBook(place_id) {
    const book = document.querySelector(`#hotplace-img${place_id}`)

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
        go_placeBook();
    }
}