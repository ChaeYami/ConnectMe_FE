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