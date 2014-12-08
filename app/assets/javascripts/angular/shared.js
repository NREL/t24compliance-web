$(function() {
  $('.chevron-toggleable').click(function () {
    console.log('Clicked!');
    $(this).find('.glyphicon').toggleClass('glyphicon-chevron-down glyphicon-chevron-right');
  });
});
