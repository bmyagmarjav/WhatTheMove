/* author: Battulga Myagmarjav */
var navbar = $('.navbar');
var openButton = $('.open-button');
var closeButton = $('.close-button');
var fixedTop = 'navbar-fixed-top';
var staticTop = 'navbar-static-top';
var categoryNav = $(".category-nav");

$(window).ready(function(){
    menuToggle();
    showMenuOnClick();
    hideMenuOnClick();
});

$(window).resize(function(){
    // console.log($(window).width());
    menuToggle();
});

/* hide/show shadow and 2nd navbar when scrolling*/
$(window).scroll(function() {
    var distance = $(document).scrollTop();
    if ($(window).width() > 768) {
        if (distance > 104) {
            categoryNav.slideUp("fast");
            $("#prime").css("box-shadow", "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)");
        } else {
            categoryNav.slideDown("fast");
            $("#prime").css("box-shadow", "none");
        }
    } else {
        categoryNav.css("display", "none");
    }
})

function menuToggle() {
    if ($(window).width() <= 768) {
        $('.menu-wrap').css("width", $(window).width());
        openButton.css("display", "block");
        categoryNav.css("display", "none");
        togglePositionProperty(fixedTop, staticTop);
    } else {
        openButton.css("display", "none");
        categoryNav.css("display", "block");
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
        $('body').css("overflow", "hidden");
        $('.menu-wrap').css("width", $(window).width());
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
    $('body').css("overflow", "visible");
}
