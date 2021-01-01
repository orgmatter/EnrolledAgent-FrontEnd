$(document).ready(function () {
  const pages = document.querySelector('meta[name="pages"]').getAttribute("content");
  const page = document.querySelector('meta[name="page"]').getAttribute("content");
  const data = document.querySelector('meta[name="data"]').getAttribute("content");
  const resNum = document.getElementById("resNumber");
  const url = location.href;
  const checkUrl = url.split("?");
  let perPage = 10;
  let search = window.location.search

  function getParameterByName(name, url = window.location.href) {
    if (!name) return

    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  //function to remove query params from a URL
function removeURLParameter(url, parameter) {
  //better to use l.search if you have a location/link object
  var urlparts= url.split('?');   
  if (urlparts.length>=2) {

      var prefix= encodeURIComponent(parameter)+'=';
      var pars= urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i= pars.length; i-- > 0;) {    
          //idiom for string.startsWith
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
              pars.splice(i, 1);
          }
      }

      url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
      return url;
  } else {
      return url;
  }
}


  function setParameter(key, value) { 

    if (history.pushState) {
      // var newurl = window.location.protocol + "//" + window.location.host + search.pathname + '?myNewUrlQuery=1';
      var currentUrlWithOutHash = window.location.origin + window.location.pathname + window.location.search;
      var hash = window.location.hash
      //remove any param for the same key
      var currentUrlWithOutHash = removeURLParameter(currentUrlWithOutHash, key);

      //figure out if we need to add the param with a ? or a &
      var queryStart;
      if(currentUrlWithOutHash.indexOf('?') !== -1){
          queryStart = '&';
      } else {
          queryStart = '?';
      }

      var newurl = currentUrlWithOutHash + queryStart + key + '=' + value + hash
      window.history.pushState({path: newurl},'', newurl);
  }
  }

  // perPage = Number(getParameterByName('perpage')) || 10

  // if(document.getElementById('perpage'))
  // document.getElementById('perpage').value = perPage || 10
  // parent.location.hash = "hello";
  // window.location.pathname('hello');
 

  // $('#perpage').on('input', function () {
  //   console.log(perPage, this.value)
  //   setParameter('perpage', this.value)
  //   setParameter('page', 1)
  //   // window.location.search = search
  // });


  // $('#city-input').on('input', function () {
  //   console.log(perPage, this.value)
  //   setParameter('perpage', this.value)
  //   setParameter('page', 1)
  //   // window.location.search = search
  // });

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
