const blogArticleBody=document.getElementById("blog-article-body"),articleRule=document.getElementById("article-rule"),blogDiv=document.querySelector("#blog-main");blogDiv&&(document.getElementById("blog-main").addEventListener("mouseenter",()=>{blogArticleBody.classList.add("show-shii"),articleRule.classList.add("dont-show-shii")}),document.getElementById("blog-main").addEventListener("mouseleave",()=>{blogArticleBody.classList.contains("show-shii")&&blogArticleBody.classList.remove("show-shii"),articleRule.classList.contains("dont-show-shii")&&articleRule.classList.remove("dont-show-shii")}));
var x = document.getElementsByClassName("blog__article--body");
var i;
for (i = 0; i < x.length; i++) {
  x[i].innerHTML = x[i].innerText.substring(0,100) + '...';
}
