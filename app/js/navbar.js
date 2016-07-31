/* author: Battulga Myagmarjav */
var navbar = $('.navbar');
var menuButton = $('.menu-button');
var fixedTop = 'navbar-fixed-top';
var staticTop = 'navbar-static-top';
var categoryNav = $(".category-nav");

$(window).ready(function(){
    menuToggle();
    toggleSideMenu();
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
        menuButton.css("display", "block");
        categoryNav.css("display", "none");
        togglePositionProperty(fixedTop, staticTop);
    } else {
        menuButton.css("display", "none");
        categoryNav.css("display", "block");
        togglePositionProperty(staticTop, fixedTop);
    }
}

function togglePositionProperty(class1, class2) {
    if (navbar.hasClass(class1)) {
        navbar.removeClass(class1);
    }
    navbar.addClass(class2);
}

function toggleSideMenu() {
    menuButton.click(function() {
        var isActive = $('#nav-menu-toggle').hasClass('active');
        if (isActive) {
            $('body').css("overflow", "hidden");
            $('.menu-wrap').css("width", $(window).width());
            $('body').addClass('show-menu');
        } else {
            $('body').css("overflow", "visible");
            $('body').removeClass('show-menu');
        }
    });
}

/* nav menu button toggler */
$("#nav-menu-toggle").click(function() {
    $(this).toggleClass("active");
});
