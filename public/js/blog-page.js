
const blogArticleBody = document.getElementById("blog-article-body");
const articleRule = document.getElementById("article-rule");
const blogDiv = document.querySelector("#blog-main");
const bgImg = blogDiv.getAttribute("bg-img");

blogDiv.style.backgroundImage = bgImg;

document.getElementById("blog-main").addEventListener("mouseenter", () => {
  blogArticleBody.classList.add("show-shii");
  articleRule.classList.add("dont-show-shii")
});
document.getElementById("blog-main").addEventListener("mouseleave", () => {
  if (blogArticleBody.classList.contains("show-shii")) {
    blogArticleBody.classList.remove("show-shii");
  }
  if(articleRule.classList.contains("dont-show-shii")){
    articleRule.classList.remove("dont-show-shii")
  }

});
