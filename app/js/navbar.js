var navbar = $('nav')
var div = '<div></div>'

navbar.addClass('navbar navbar-default')
navbar.append(div)

/* all elements and classes : start */

//inside navbar
$('div').addClass('container-fluid')

//inside navbar -> container-fluid
$('.container-fluid').append(div).append(div)

$('.container-fluid div:eq(0)').addClass('navbar-header');
$('.container-fluid div:eq(1)').addClass('collapse navbar-collapse')

//inside container-fluid -> navbar-header
$('.navbar-header').append('<button></button>').append('<a>Brand</a>')
$('.navbar-header button').addClass('navbar-toggle collapsed')
$('.navbar-header a').addClass('navbar-brand')

//inside navbar-header -> button
for (var i = 0; i < 4; i++) {
    $('button').append('<span></span>')
    if (i > 0) {
        $('button span:last').addClass('icon-bar')
    }
}
$('button span:eq(0)').addClass('sr-only').append('Toggle navigation')

//inside navbar -> container-fluid
$('.container-fluid div:eq(1)')
    .append('<ul></ul>')
    .append('<form></form>')
    .append('<ul></ul>')

$('.container-fluid ul:first').addClass("nav navbar-nav")
$('.container-fluid form').addClass("navbar-form navbar-left")
$('.container-fluid ul:last').addClass("nav nabar-nav navbar-right")

$()











/* all elements and classes : end */
