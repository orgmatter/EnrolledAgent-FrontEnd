$(document).ready(function () {
  const $navbar = $("#myNav");

  const stickyNavbar = (() => {
    $navbar.sticky({ topSpacing: 0 });
  })();
});
