const blogArticleBody = document.getElementById("blog-article-body");
const articleRule = document.getElementById("article-rule");
const blogDiv = document.querySelector("#blog-main");

if(blogDiv){
  blogDiv.addEventListener("mouseenter", () => {
    blogArticleBody.classList.add("show-shii");
    articleRule.classList.add("dont-show-shii")
  });
  blogDiv.addEventListener("mouseleave", () => {
  if (blogArticleBody.classList.contains("show-shii")) {
    blogArticleBody.classList.remove("show-shii");
  }
  if(articleRule.classList.contains("dont-show-shii")){
    articleRule.classList.remove("dont-show-shii")
  }

});
}

