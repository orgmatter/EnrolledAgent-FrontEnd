$(document).ready(function () {
  const $document_body = $(document.body);
  const funfact = (() => {
    const $animate_number = $(".animate-number");
    if ($animate_number.length > 0) {
      $animate_number.appear();
      $document_body.on("appear", ".animate-number", function () {
        $animate_number.each(function () {
          let current_item = $(this);
          if (!current_item.hasClass("appeared")) {
            current_item
              .animateNumbers(
                current_item.attr("data-value"),
                true,
                parseInt(current_item.attr("data-animation-duration"), 10)
              )
              .addClass("appeared");
          }
        });
      });
    }
  })();

  const odometer = (() => {
    const $animate_number = $(".odometer-animate-number");
    if ($animate_number.length > 0) {
      $animate_number.appear();
      $document_body.on("appear", ".odometer-animate-number", function () {
        $animate_number.each(function () {
          let current_item = $(this);
          let v = current_item.data("value");
          let o = new Odometer({
            el: this,
            value: 1,
            theme:
              current_item.data("theme") === undefined ? "minimal" : current_item.data("theme"),
          });
          o.render();
          setTimeout(function () {
            o.update(v);
          }, 500);
        });
      });
    }
  })();
});
