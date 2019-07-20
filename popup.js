var popup = document.querySelector('.popup');
document.addEventListener('click', function (e) {
    var classList = e.target.classList;
    if (classList.contains('item')) {
        var rect = e.target.getBoundingClientRect();
        popup.style.left = e.x + 'px';
        popup.style.top = e.y + 'px';
        setTimeout(function () {
            document.body.classList.add('opened');
            setTimeout(function () {
                popup.classList.add('opened');
            }, 10);
        }, 10);
    } else if (classList.contains('paranja')) {
        popup.classList.remove('opened');
        setTimeout(function () {
            document.body.classList.remove('opened');
        }, 1000);
    }
});