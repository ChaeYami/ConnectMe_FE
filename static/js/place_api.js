const PLACE = document.querySelector('#place')

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2NzQ1NzExLCJpYXQiOjE2ODY2NTkzMTEsImp0aSI6Ijc5YzUyNTNkNTM4ZTRmODdhOTFiZGI4NmE4YjE2ZDJjIiwidXNlcl9pZCI6MiwiZW1haWwiOiJhQGEuY29tIiwiYWNjb3VudCI6ImFhYWEiLCJwaG9uZSI6IjAwMDAwMDAwMDAiLCJuaWNrbmFtZSI6IiJ9.EZ_TR4UIfgUhUpIS0i7pUrXwwB7wqma2nRVjB1amJRg'


window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search).get("id");
    if (urlParams) {
        PlaceDetailView(urlParams);
    } else {
        PlaceView()
    }

};

// 장소추천 게시글 생성
async function CreatePlace() {
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
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "POST",
        body: formdata,
    });

    const response_json = await response.json();

    if (response.status == 200) {
        alert("추천 장소가 등록되었습니다.");
        window.location.replace(`${FRONTEND_BASE_URL}/place_view.html`);
    } else if (response.status == 400) {
        alert(response_json["message"]);
    } else if (
        name == "" ||
        category == "" ||
        content == "" ||
        address == "" ||
        images == "" ||
        score == "" ||
        price == "" ||
        hour == "" ||
        holiday == ""
    ) {
        alert("빈칸을 입력해 주세요.");
    }
}

// 장소추천 전체보기
async function PlaceView() {
    const response = await fetch(`${BACKEND_BASE_URL}/place/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "GET",
    });

    const response_json = await response.json();

    response_json.forEach((e, i) => {
        let place_id = e.id
        let name = e.title
        let category = e.category
        let content = e.content
        let address = e.address
        let image = e.image
        let score = e.score
        let price = e.price
        let hour = e.hour
        let holiday = e.holiday


        img = ``

        if (image) {
            img = `
            이미지 : ${img}
            <a href="place_view.html?id=${place_id}">
                <img src="${image['url']}"></img>
            </a>
            `
        } else {
            img = ''
        }


        PLACE.innerHTML += `
        <div>제목 : <a href="place_view.html?id=${place_id}">${name}</a></div>
        <div>카테고리 : ${category}</div>
        <div>내용 : ${content}</div>
        <div>주소 : ${address}</div>
        <div>${img}</div>
        <div>별점 : ${score}</div>
        <div>가격 : ${price}</div>
        <div>영업시간 : ${hour}</div>
        <div>휴일 : ${holiday}</div>
        <hr>
        `
    })
}

// 장소추천 상세보기
async function PlaceDetailView(place_id) {


    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "GET",
    });

    const response_json = await response.json();

    let comments = response_json['comment']
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

    let images = ``

    if (image) {
        for (let i = 0; i < image.length; i++) {
            images += `
            <img src="${image[i]['url']}">
            `
        }
    }

    let comment = ``

    for (let i = 0; i < comments.length; i++) {
        if (comments[i]['reply'].length > 0) {
            comment +=
                `<div id='comment${comments[i]['id']}'> ${comments[i]['user_name']} : ${comments[i]['content']} 
                <button onclick="CommentPreUpdate(${place_id}, ${comments[i]['id']})">✔️</button> 
                <button onclick="CommentDelete(${place_id}, ${comments[i]['id']})">❌</button>
                <div id="reply${comments[i]['id']}"><a href="javascript:ReplyPreWrite(${place_id}, ${comments[i]['id']})">답글</a></div>`
            for (let j = 0; j < comments[i]['reply'].length; j++) {
                comment +=
                    `
                        <div id='comment${comments[i]['reply'][j]['id']}' style="margin-left:20px;">
                            ${comments[i]['reply'][j]['user_name']} : ${comments[i]['reply'][j]['content']} 
                            <button onclick="CommentPreUpdate(${place_id}, ${comments[i]['reply'][j]['id']})">✔️</button> 
                            <button onclick="CommentDelete(${place_id}, ${comments[i]['reply'][j]['id']})">❌</button>
                        </div>
                        `
            }
            comment +=
                `</div>`
        } else {
            comment +=
                `<div id='comment${comments[i]['id']}'>
                    ${comments[i]['user_name']} : ${comments[i]['content']} 
                    <button onclick="CommentPreUpdate(${place_id}, ${comments[i]['id']})">✔️</button> 
                    <button onclick="CommentDelete(${place_id}, ${comments[i]['id']})">❌</button>
                    <div id="reply${comments[i]['id']}"><a href="javascript:ReplyPreWrite(${place_id}, ${comments[i]['id']})">답글</a></div>
                </div>
                `
        }

    }

    place.innerHTML = `
    <button onclick="PlacePreUpdateView(${place_id})">수정하기</button>
    <button onclick="PlaceDelete(${place_id})">삭제하기</button>
    <div>
        <img id="book${place_id}" src="static/image/bookmark-white.png" style="width: 20px;" alt="북마크" onclick="PlaceBook(${place_id})">
        <img id="like${place_id}" src="static/image/heart.png" style="width: 20px;" alt="좋아요" onclick="PlaceLike(${place_id})">
    </div>
    <div>제목 : ${name}</div>
    <div>카테고리 : ${category}</div>
    <div>내용 : ${content}</div>
    <div>주소 : ${address}</div>
    <div>이미지 : ${images}</div>
    <div>별점 : ${score}</div>
    <div>가격 : ${price}</div>
    <div>영업시간 : ${hour}</div>
    <div>휴일 : ${holiday}</div>
    <hr>
    <div>
        댓글 : <input id="comments"/> <button type="button" onclick="CommentWrite(${place_id})">등록하기</button>
    </div>
    
    ${comment}
    <hr>
    <br>
    `

}

// 장소 북마크
async function PlaceBook(place_id) {
    const book = document.querySelector(`#book${place_id}`)

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "POST",
    });

    const response_json = await response.json();

    if (response_json["message"] == "북마크") {
        book['src'] = "static/image/bookmark.png"
        alert("북마크가 추가되었습니다.");
    } else {
        book['src'] = "static/image/bookmark-white.png"
        alert("북마크가 취소되었습니다.");
    }
}

// 장소 좋아요
async function PlaceLike(place_id) {
    const like = document.querySelector(`#like${place_id}`)

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/like/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "POST",
    });

    const response_json = await response.json();

    if (response_json["message"] == "좋아요") {
        like['src'] = "static/image/heart (2).png"
        alert("좋아요.");
    } else {
        like['src'] = "static/image/heart.png"
        alert("좋아요 취소!");
    }

}

// 장소추천 수정전 html 띄워주기
async function PlacePreUpdateView(place_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "GET",
    });

    const response_json = await response.json();

    let name = response_json['place'].title
    let category = response_json['place'].category
    let content = response_json['place'].content
    let address = response_json['place'].address
    let image = response_json['place'].image
    let score = response_json['place'].score
    let price = response_json['place'].price
    let hour = response_json['place'].hour
    let holiday = response_json['place'].holiday

    let images = ``

    if (image) {
        for (let i = 0; i < image.length; i++) {
            images += `
            <img src="${image[i]['url']}">
            <button onclick="ImageDelete(${place_id}, ${image[i]['id']})">❌</button>
            `
        }
    }


    PLACE.innerHTML = `
    <form>
        <div>제목 : <input id='name' value="${name}"/></div>
        <div>카테고리 : <input id='category' value="${category}"/></div>
        <div>내용 : <input id='content' value="${content}"/></div>
        <div>주소 : <input id='address' value="${address}"/></div>
        <div>별점 : <input id='score' value="${score}"/></div>
        <div>가격 : <input id='price' value="${price}"/></div>
        <div>영업시간 : <input id='hour' value="${hour}"/></div>
        <div>휴일 : <input id='holiday' value="${holiday}"/></div>
        
        <div>이미지 : ${images}</div>

        <br />
        <div>
            <input type="file" id="images" multiple>
            <button type="button" onclick="ImageAdd(${place_id}, 1)">추가하기</button>
        </div>
        <br />
        <button type="button" onclick="PlaceUpdate(${place_id})">확인</button>
    </form>
    `

}

// 장소추천 수정하기
async function PlaceUpdate(place_id) {
    let name = document.querySelector('#name')
    let category = document.querySelector('#category')
    let content = document.querySelector('#content')
    let address = document.querySelector('#address')
    let score = document.querySelector('#score')
    let price = document.querySelector('#price')
    let hour = document.querySelector('#hour')
    let holiday = document.querySelector('#holiday')


    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
            "content-type": "application/json",
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
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
        .then((response) => response.json());
        // .then((data) => console.log(data));

    window.location.href = `place_view.html?id=${place_id}`;
}

// 장소추천 삭제하기
async function PlaceDelete(place_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "DELETE",
    });

    if (response.status == 200) {
        alert("삭제가 완료되었습니다.");
    }

    window.location.replace(`${FRONTEND_BASE_URL}/place_view.html`);
}

// 이미지 추가하기
async function ImageAdd(place_id, place_image_id) {
    let images = document.querySelector('#images')

    const formdata = new FormData();

    for (let i = 0; i < images.files.length; i++) {
        formdata.append("image", images.files[i]);
    }

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/image/${place_image_id}/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
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
async function ImageDelete(place_id, place_image_id) {

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/image/${place_image_id}/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "DELETE",
    })

    window.location.href = `place_view.html?id=${place_id}`;

}

// 댓글 작성하기
async function CommentWrite(place_id) {

    const comment = document.querySelector('#comments')

    const formdata = new FormData();
    formdata.append("content", comment.value)


    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
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

// 대댓글 수정 폼 띄우기
async function ReplyPreWrite(place_id, place_comment_id) {

    let reply = document.querySelector(`#reply${place_comment_id}`)

    reply.innerHTML = `<input id="reply_write${place_comment_id}"/> <button type="button" onclick="ReplyWrite(${place_id}, ${place_comment_id})">등록하기</button>`
}

// 대댓글 작성하기
async function ReplyWrite(place_id, place_comment_id) {

    let reply = document.querySelector(`#reply_write${place_comment_id}`)

    const formdata = new FormData();
    formdata.append('content', reply.value);

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "POST",
        body: formdata,
    });

    window.location.href = `place_view.html?id=${place_id}`;
}

// 댓글 수정 폼 띄우기
async function CommentPreUpdate(place_id, place_comment_id) {
    const comment = document.querySelector(`#comment${place_comment_id}`);

    comment.innerHTML = `
    <input id='comment_update'/>
    <button type="button" onclick="CommentUpdate(${place_id}, ${place_comment_id})">수정하기</button>`

}

// 댓글 수정하기
async function CommentUpdate(place_id, place_comment_id) {

    const comment_update = document.querySelector('#comment_update')

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
            "content-type": "application/json",
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "PUT",
        body: JSON.stringify({
            content: comment_update.value,
        })
    });
    window.location.href = `place_view.html?id=${place_id}`;

}

// 댓글 삭제하기
async function CommentDelete(place_id, place_comment_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}/comment/${place_comment_id}/`, {
        headers: {
            Authorization: "Bearer " + TOKEN,
        },
        // headers: {
        //     Authorization: "Bearer " + localStorage.getItem("access"),
        // },
        method: "DELETE",
    });
    window.location.href = `place_view.html?id=${place_id}`;
}

