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
    document.querySelector("#image_container").innerHTML = ``

    for (var image of event.target.files) {
        var reader = new FileReader();

        reader.onload = function (event) {
            var img = document.createElement("img");
            img.setAttribute("src", event.target.result);
            document.querySelector("#image_container").appendChild(img);
        };

        reader.readAsDataURL(image);
    }
}