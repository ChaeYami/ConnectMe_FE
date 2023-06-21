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

//이미지 미리보기
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