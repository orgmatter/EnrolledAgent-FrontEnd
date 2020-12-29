$(document).ready(function () {
  const pages = document.querySelector('meta[name="pages"]').getAttribute("content");
  const page = document.querySelector('meta[name="page"]').getAttribute("content");
  const data = document.querySelector('meta[name="data"]').getAttribute("content");
  const resNum = document.getElementById("resNumber");
  const url = location.href;
  const checkUrl = url.split("?");

  const handlePageLength = (() => {
    if (pages === 1) {
      resNum.textContent = `1 - ${data.length}`;
    } else if (pages > 1) {
      const multiplier = (+page - 1) * 10;
      const startNum = 1 + multiplier;
      const endNum = +data.length;
      resNum.textContent = `${startNum} - ${endNum}`;
      console.log("start", startNum);
      console.log("end", endNum);
      console.log(">>>", data.length);
    }
  })();

  const addSuffix = () => {
    const search = window.location.search || "?page-1";
    const splitSearch = search.split("&");
    let newSplitSearch = splitSearch[0].substring(1, 6);
    // console.log("search", search);
    // console.log("split", splitSearch);
    // console.log("newSplit", newSplitSearch);
    // if (newSplitSearch === "limit") {
    //   const suffix = `&${splitSearch[0].substring(1)}`;
    //   return suffix;
    // } else {
    //   const suffix = splitSearch[1] ? `&${splitSearch[1]}` : "";
    //   return suffix;
    // }
  };

  const addPrefix = () => {
    if (checkUrl.length > 1) {
      let newSplitSearch = checkUrl[1].substring(0, 4);
      const secondUrl = checkUrl[1].split("&");
      if (newSplitSearch === "page") {
        return "?page=";
      } else {
        if (secondUrl.length > 1) {
          return `?${secondUrl[0]}&page=`;
        } else {
          return `?${checkUrl[1]}&page=`;
        }
      }
    } else {
      return "?page=";
    }
  };

  $("#pagination").pagination({
    items: pages,
    prevText: "<",
    nextText: ">",
    hrefTextPrefix: addPrefix(),
    // hrefTextSuffix: addSuffix(),
    onInit: function () {
      if (pages === undefined || pages === null || pages <= 1) {
        $("#pagination").attr("style", "display:none");
      }
    },
  });

  function checkFragment() {
    const search = window.location.search || "?page=1";
    const splitSearch = search.split("&");
    console.log("search", search);
    console.log("searchsplit", splitSearch);
    console.log(">>>", search.substring(1, 5));
    if (splitSearch[1]) {
      $("#pagination").pagination("selectPage", parseInt(splitSearch[1].split("=")[1]));
    } else if (search.substring(1, 5) === "page") {
      $("#pagination").pagination("selectPage", parseInt(search.split("=")[1]));
    } else {
      $("#pagination").pagination("selectPage", 1);
    }
  }

  $(window).bind("popstate", checkFragment);
  checkFragment();
});
