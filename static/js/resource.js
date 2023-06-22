$(document).ready(function () {
    $('.select').on('click', 'li', function () {
        $('#opened').prop('checked', false);
        var $t = $(this),
            $f = $('.field'),
            text = $t.clone().children().remove().end().text().trim(),
            icon = $t.find('i').attr('class');
        $f.find('label').text(text);
        $f.find('i').attr('class', icon);
    });

    $('.field').click(function (e) {
        e.stopPropagation();
        $('#opened').prop('checked', !$('#opened').prop('checked'));
    });

    $(document).click(function () {
        $('#opened').prop('checked', false);
    });
});

// ##############이미지 미리보기 시작#################
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
// ##############이미지 미리보기 끝#################

// ##############이미지 슬라이더 시작#################
let pages = 0;//현재 인덱스 번호
let positionValue = 0;//images 위치값
const IMAGE_WIDTH = 250;//한번 이동 시 IMAGE_WIDTH만큼 이동한다.
//DOM
const backBtn = document.querySelector(".back")
const nextBtn = document.querySelector(".next")
const images = document.querySelector(".images")

function next() {
    if (pages < 3) {
        backBtn.removeAttribute('disabled')//뒤로 이동해 더이상 disabled가 아니여서 속성을 삭제한다.
        positionValue -= IMAGE_WIDTH;//IMAGE_WIDTH의 증감을 positionValue에 저장한다.
        images.style.transform = `translateX(${positionValue}px)`;
        //x축으로 positionValue만큼의 px을 이동한다.
        pages += 1; //다음 페이지로 이동해서 pages를 1증가 시킨다.
    }
    if (pages === 3) { //
        nextBtn.setAttribute('disabled', 'true')//마지막 장일 때 next버튼이 disabled된다.
    }
}

function back() {
    if (pages > 0) {
        nextBtn.removeAttribute('disabled')
        positionValue += IMAGE_WIDTH;
        images.style.transform = `translateX(${positionValue}px)`;
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

// ##############이미지 슬라이더 끝#################