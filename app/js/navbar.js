/* author: Battulga Myagmarjav */
var navbar = $('.navbar');
var openButton = $('.open-button');
var closeButton = $('.close-button');
var fixedTop = 'navbar-fixed-top';
var staticTop = 'navbar-static-top';

$(window).ready(function(){
    menuToggle();
    showMenuOnClick();
    hideMenuOnClick();
});

$(window).resize(function(){
    menuToggle();
});

$(window).scroll(function() {
    var distance = $(document).scrollTop();
    if ($(window).width() > 768) {
        if (distance > 104) {
            $(".category-nav").css("display", "none").slideUp("slow");
        } else {
            $(".category-nav").css("display", "block").slideDown("slow");
        }
    }
})

function menuToggle() {
    if ($(window).width() <= 768) {
        openButton.show();
        togglePositionProperty(fixedTop, staticTop);
    } else {
        openButton.hide();
        togglePositionProperty(staticTop, fixedTop);
        if ($('body').hasClass('show-menu')) {
            $('body').removeClass('show-menu');
        }
    }
}

function togglePositionProperty(class1, class2) {
    if (navbar.hasClass(class1)) {
        navbar.removeClass(class1);
    }
    navbar.addClass(class2);
}

function showMenuOnClick() {
    $('.open-button').click(function() {
        $('body').addClass('show-menu');
        closeButton.show(400);
        openButton.hide();
    });
}

function hideMenuOnClick() {
    $('.close-button').click(function() {
        hideMenuHelper();
    });
    $('.icon-list a span').click(function() {
        hideMenuHelper();
    });
}

function hideMenuHelper() {
    $('body').removeClass('show-menu');
    closeButton.hide();
    openButton.show(400);
}
