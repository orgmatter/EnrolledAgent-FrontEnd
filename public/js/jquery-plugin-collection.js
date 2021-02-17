/* Necessary jQuery Collection */

/**
 * Table of Contents:
 *  jquery.scrollTo
 *  jquery.localScroll
 *  jQuery appear plugin
 *  scrollToFixed
 *  Sticky
 *  Menuzord - Responsive Megamenu
 *  odometer 
* ===============================================
*/


/*
 *  jquery.scrollTo
 * -----------------------------------------------
*/
/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});

/*
 *  jquery.localScroll
 * -----------------------------------------------
*/
/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 1.4.0
 */
;(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){var g=location.href.replace(/#.*/,'');var h=$.localScroll=function(a){$('body').localScroll(a)};h.defaults={duration:1000,axis:'y',event:'click',stop:true,target:window};$.fn.localScroll=function(a){a=$.extend({},h.defaults,a);if(a.hash&&location.hash){if(a.target)window.scrollTo(0,0);scroll(0,location,a)}return a.lazy?this.on(a.event,'a,area',function(e){if(filter.call(this)){scroll(e,this,a)}}):this.find('a,area').filter(filter).bind(a.event,function(e){scroll(e,this,a)}).end().end();function filter(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')===g&&(!a.filter||$(this).is(a.filter))}};h.hash=function(){};function scroll(e,a,b){var c=a.hash.slice(1),elem=document.getElementById(c)||document.getElementsByName(c)[0];if(!elem)return;if(e)e.preventDefault();var d=$(b.target);if(b.lock&&d.is(':animated')||b.onBefore&&b.onBefore(e,elem,d)===false)return;if(b.stop){d.stop(true)}if(b.hash){var f=elem.id===c?'id':'name',$a=$('<a> </a>').attr(f,c).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});elem[f]='';$('body').prepend($a);location.hash=a.hash;$a.remove();elem[f]=c}d.scrollTo(elem,b).trigger('notify.serialScroll',[elem])}return h}));

/*
 *  scrollToFixed
 *	https://github.com/bigspotteddog/ScrollToFixed
 * -----------------------------------------------
*/
(function(a){a.isScrollToFixed=function(b){return !!a(b).data("ScrollToFixed")};a.ScrollToFixed=function(d,i){var m=this;m.$el=a(d);m.el=d;m.$el.data("ScrollToFixed",m);var c=false;var H=m.$el;var I;var F;var k;var e;var z;var E=0;var r=0;var j=-1;var f=-1;var u=null;var A;var g;function v(){H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");f=-1;E=H.offset().top;r=H.offset().left;if(m.options.offsets){r+=(H.offset().left-H.position().left)}if(j==-1){j=r}I=H.css("position");c=true;if(m.options.bottom!=-1){H.trigger("preFixed.ScrollToFixed");x();H.trigger("fixed.ScrollToFixed")}}function o(){var J=m.options.limit;if(!J){return 0}if(typeof(J)==="function"){return J.apply(H)}return J}function q(){return I==="fixed"}function y(){return I==="absolute"}function h(){return !(q()||y())}function x(){if(!q()){var J=H[0].getBoundingClientRect();u.css({display:H.css("display"),width:J.width,height:J.height,"float":H.css("float")});cssOptions={"z-index":m.options.zIndex,position:"fixed",top:m.options.bottom==-1?t():"",bottom:m.options.bottom==-1?"":m.options.bottom,"margin-left":"0px"};if(!m.options.dontSetWidth){cssOptions.width=H.css("width")}H.css(cssOptions);H.addClass(m.options.baseClassName);if(m.options.className){H.addClass(m.options.className)}I="fixed"}}function b(){var K=o();var J=r;if(m.options.removeOffsets){J="";K=K-E}cssOptions={position:"absolute",top:K,left:J,"margin-left":"0px",bottom:""};if(!m.options.dontSetWidth){cssOptions.width=H.css("width")}H.css(cssOptions);I="absolute"}function l(){if(!h()){f=-1;u.css("display","none");H.css({"z-index":z,width:"",position:F,left:"",top:e,"margin-left":""});H.removeClass("scroll-to-fixed-fixed");if(m.options.className){H.removeClass(m.options.className)}I=null}}function w(J){if(J!=f){H.css("left",r-J);f=J}}function t(){var J=m.options.marginTop;if(!J){return 0}if(typeof(J)==="function"){return J.apply(H)}return J}function B(){if(!a.isScrollToFixed(H)||H.is(":hidden")){return}var M=c;var L=h();if(!c){v()}else{if(h()){E=H.offset().top;r=H.offset().left}}var J=a(window).scrollLeft();var N=a(window).scrollTop();var K=o();if(m.options.minWidth&&a(window).width()<m.options.minWidth){if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}else{if(m.options.maxWidth&&a(window).width()>m.options.maxWidth){if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}else{if(m.options.bottom==-1){if(K>0&&N>=K-t()){if(!L&&(!y()||!M)){p();H.trigger("preAbsolute.ScrollToFixed");b();H.trigger("unfixed.ScrollToFixed")}}else{if(N>=E-t()){if(!q()||!M){p();H.trigger("preFixed.ScrollToFixed");x();f=-1;H.trigger("fixed.ScrollToFixed")}w(J)}else{if(!h()||!M){p();H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed")}}}}else{if(K>0){if(N+a(window).height()-H.outerHeight(true)>=K-(t()||-n())){if(q()){p();H.trigger("preUnfixed.ScrollToFixed");if(F==="absolute"){b()}else{l()}H.trigger("unfixed.ScrollToFixed")}}else{if(!q()){p();H.trigger("preFixed.ScrollToFixed");x()}w(J);H.trigger("fixed.ScrollToFixed")}}else{w(J)}}}}}function n(){if(!m.options.bottom){return 0}return m.options.bottom}function p(){var J=H.css("position");if(J=="absolute"){H.trigger("postAbsolute.ScrollToFixed")}else{if(J=="fixed"){H.trigger("postFixed.ScrollToFixed")}else{H.trigger("postUnfixed.ScrollToFixed")}}}var D=function(J){if(H.is(":visible")){c=false;B()}};var G=function(J){(!!window.requestAnimationFrame)?requestAnimationFrame(B):B()};var C=function(){var K=document.body;if(document.createElement&&K&&K.appendChild&&K.removeChild){var M=document.createElement("div");if(!M.getBoundingClientRect){return null}M.innerHTML="x";M.style.cssText="position:fixed;top:100px;";K.appendChild(M);var N=K.style.height,O=K.scrollTop;K.style.height="3000px";K.scrollTop=500;var J=M.getBoundingClientRect().top;K.style.height=N;var L=(J===100);K.removeChild(M);K.scrollTop=O;return L}return null};var s=function(J){J=J||window.event;if(J.preventDefault){J.preventDefault()}J.returnValue=false};m.init=function(){m.options=a.extend({},a.ScrollToFixed.defaultOptions,i);z=H.css("z-index");m.$el.css("z-index",m.options.zIndex);u=a("<div />");I=H.css("position");F=H.css("position");k=H.css("float");e=H.css("top");if(h()){m.$el.after(u)}a(window).bind("resize.ScrollToFixed",D);a(window).bind("scroll.ScrollToFixed",G);if("ontouchmove" in window){a(window).bind("touchmove.ScrollToFixed",B)}if(m.options.preFixed){H.bind("preFixed.ScrollToFixed",m.options.preFixed)}if(m.options.postFixed){H.bind("postFixed.ScrollToFixed",m.options.postFixed)}if(m.options.preUnfixed){H.bind("preUnfixed.ScrollToFixed",m.options.preUnfixed)}if(m.options.postUnfixed){H.bind("postUnfixed.ScrollToFixed",m.options.postUnfixed)}if(m.options.preAbsolute){H.bind("preAbsolute.ScrollToFixed",m.options.preAbsolute)}if(m.options.postAbsolute){H.bind("postAbsolute.ScrollToFixed",m.options.postAbsolute)}if(m.options.fixed){H.bind("fixed.ScrollToFixed",m.options.fixed)}if(m.options.unfixed){H.bind("unfixed.ScrollToFixed",m.options.unfixed)}if(m.options.spacerClass){u.addClass(m.options.spacerClass)}H.bind("resize.ScrollToFixed",function(){u.height(H.height())});H.bind("scroll.ScrollToFixed",function(){H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");B()});H.bind("detach.ScrollToFixed",function(J){s(J);H.trigger("preUnfixed.ScrollToFixed");l();H.trigger("unfixed.ScrollToFixed");a(window).unbind("resize.ScrollToFixed",D);a(window).unbind("scroll.ScrollToFixed",G);H.unbind(".ScrollToFixed");u.remove();m.$el.removeData("ScrollToFixed")});D()};m.init()};a.ScrollToFixed.defaultOptions={marginTop:0,limit:0,bottom:-1,zIndex:1000,baseClassName:"scroll-to-fixed-fixed"};a.fn.scrollToFixed=function(b){return this.each(function(){(new a.ScrollToFixed(this,b))})}})(jQuery);


/*
 *  Sticky Plugin v1.0.4 for jQuery
 *	https://github.com/garand/sticky
 * -----------------------------------------------
*/
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=Array.prototype.slice,i=Array.prototype.splice,n={topSpacing:0,bottomSpacing:0,className:"is-sticky",wrapperClassName:"sticky-wrapper",center:!1,getWidthFrom:"",widthFromWrapper:!0,responsiveWidth:!1,zIndex:"inherit"},r=t(window),s=t(document),o=[],c=r.height(),a=function(){for(var e=r.scrollTop(),i=s.height(),n=i-c,a=e>n?n-e:0,p=0,d=o.length;p<d;p++){var l=o[p],h=l.stickyWrapper.offset().top-l.topSpacing-a;if(l.stickyWrapper.css("height",l.stickyElement.outerHeight()),e<=h)null!==l.currentTop&&(l.stickyElement.css({width:"",position:"",top:"","z-index":""}),l.stickyElement.parent().removeClass(l.className),l.stickyElement.trigger("sticky-end",[l]),l.currentTop=null);else{var u=i-l.stickyElement.outerHeight()-l.topSpacing-l.bottomSpacing-e-a;if(u<0?u+=l.topSpacing:u=l.topSpacing,l.currentTop!==u){var g;l.getWidthFrom?(padding=l.stickyElement.innerWidth()-l.stickyElement.width(),g=t(l.getWidthFrom).width()-padding||null):l.widthFromWrapper&&(g=l.stickyWrapper.width()),null==g&&(g=l.stickyElement.width()),l.stickyElement.css("width",g).css("position","fixed").css("top",u).css("z-index",l.zIndex),l.stickyElement.parent().addClass(l.className),null===l.currentTop?l.stickyElement.trigger("sticky-start",[l]):l.stickyElement.trigger("sticky-update",[l]),l.currentTop===l.topSpacing&&l.currentTop>u||null===l.currentTop&&u<l.topSpacing?l.stickyElement.trigger("sticky-bottom-reached",[l]):null!==l.currentTop&&u===l.topSpacing&&l.currentTop<u&&l.stickyElement.trigger("sticky-bottom-unreached",[l]),l.currentTop=u}var m=l.stickyWrapper.parent();l.stickyElement.offset().top+l.stickyElement.outerHeight()>=m.offset().top+m.outerHeight()&&l.stickyElement.offset().top<=l.topSpacing?l.stickyElement.css("position","absolute").css("top","").css("bottom",0).css("z-index",""):l.stickyElement.css("position","fixed").css("top",u).css("bottom","").css("z-index",l.zIndex)}}},p=function(){c=r.height();for(var e=0,i=o.length;e<i;e++){var n=o[e],s=null;n.getWidthFrom?n.responsiveWidth&&(s=t(n.getWidthFrom).width()):n.widthFromWrapper&&(s=n.stickyWrapper.width()),null!=s&&n.stickyElement.css("width",s)}},d={init:function(e){return this.each(function(){var i=t.extend({},n,e),r=t(this),s=r.attr("id"),c=s?s+"-"+n.wrapperClassName:n.wrapperClassName,a=t("<div></div>").attr("id",c).addClass(i.wrapperClassName);r.wrapAll(function(){if(0==t(this).parent("#"+c).length)return a});var p=r.parent();i.center&&p.css({width:r.outerWidth(),marginLeft:"auto",marginRight:"auto"}),"right"===r.css("float")&&r.css({float:"none"}).parent().css({float:"right"}),i.stickyElement=r,i.stickyWrapper=p,i.currentTop=null,o.push(i),d.setWrapperHeight(this),d.setupChangeListeners(this)})},setWrapperHeight:function(e){var i=t(e),n=i.parent();n&&n.css("height",i.outerHeight())},setupChangeListeners:function(t){window.MutationObserver?new window.MutationObserver(function(e){(e[0].addedNodes.length||e[0].removedNodes.length)&&d.setWrapperHeight(t)}).observe(t,{subtree:!0,childList:!0}):window.addEventListener?(t.addEventListener("DOMNodeInserted",function(){d.setWrapperHeight(t)},!1),t.addEventListener("DOMNodeRemoved",function(){d.setWrapperHeight(t)},!1)):window.attachEvent&&(t.attachEvent("onDOMNodeInserted",function(){d.setWrapperHeight(t)}),t.attachEvent("onDOMNodeRemoved",function(){d.setWrapperHeight(t)}))},update:a,unstick:function(e){return this.each(function(){for(var e=this,n=t(e),r=-1,s=o.length;s-- >0;)o[s].stickyElement.get(0)===e&&(i.call(o,s,1),r=s);-1!==r&&(n.unwrap(),n.css({width:"",position:"",top:"",float:"","z-index":""}))})}};window.addEventListener?(window.addEventListener("scroll",a,!1),window.addEventListener("resize",p,!1)):window.attachEvent&&(window.attachEvent("onscroll",a),window.attachEvent("onresize",p)),t.fn.sticky=function(i){return d[i]?d[i].apply(this,e.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.sticky"):d.init.apply(this,arguments)},t.fn.unstick=function(i){return d[i]?d[i].apply(this,e.call(arguments,1)):"object"!=typeof i&&i?void t.error("Method "+i+" does not exist on jQuery.sticky"):d.unstick.apply(this,arguments)},t(function(){setTimeout(a,0)})});

/*
 *  Menuzord - Responsive Megamenu
 * -----------------------------------------------
*/
!function(e){jQuery.fn.menuzord=function(n){function i(n){"fade"==p.effect?e(n).children(".dropdown, .megamenu").stop(!0,!0).delay(p.showDelay).fadeIn(p.showSpeed).addClass(p.animation):e(n).children(".dropdown, .megamenu").stop(!0,!0).delay(p.showDelay).slideDown(p.showSpeed).addClass(p.animation)}function d(n){"fade"==p.effect?e(n).children(".dropdown, .megamenu").stop(!0,!0).delay(p.hideDelay).fadeOut(p.hideSpeed).removeClass(p.animation):e(n).children(".dropdown, .megamenu").stop(!0,!0).delay(p.hideDelay).slideUp(p.hideSpeed).removeClass(p.animation),e(n).children(".dropdown, .megamenu").find(".dropdown, .megamenu").stop(!0,!0).delay(p.hideDelay).fadeOut(p.hideSpeed)}function o(){e(g).find(".dropdown, .megamenu").hide(0),navigator.userAgent.match(/Mobi/i)||window.navigator.msMaxTouchPoints>0||"click"==p.trigger?(e(".menuzord-menu > li > a, .menuzord-menu ul.dropdown li a").bind("click touchstart",function(n){return n.stopPropagation(),n.preventDefault(),e(this).parent("li").siblings("li").find(".dropdown, .megamenu").stop(!0,!0).fadeOut(300),"none"==e(this).siblings(".dropdown, .megamenu").css("display")?(i(e(this).parent("li")),!1):(d(e(this).parent("li")),void(window.location.href=e(this).attr("href")))}),e(document).bind("click.menu touchstart.menu",function(n){0==e(n.target).closest(".menuzord").length&&e(".menuzord-menu").find(".dropdown, .megamenu").fadeOut(300)})):e(w).bind("mouseenter",function(){i(this)}).bind("mouseleave",function(){d(this)})}function t(){e(g).find(".dropdown, .megamenu").hide(0),e(g).find(".indicator").each(function(){e(this).parent("a").siblings(".dropdown, .megamenu").length>0&&e(this).bind("click",function(n){e(g).scrollTo({top:45,left:0},600),"A"==e(this).parent().prop("tagName")&&n.preventDefault(),"none"==e(this).parent("a").siblings(".dropdown, .megamenu").css("display")?(e(this).parent("a").siblings(".dropdown, .megamenu").delay(p.showDelay).slideDown(p.showSpeed),e(this).parent("a").parent("li").siblings("li").find(".dropdown, .megamenu").slideUp(p.hideSpeed)):e(this).parent("a").siblings(".dropdown, .megamenu").slideUp(p.hideSpeed)})})}function a(){var n=e(g).children("li").children(".dropdown, .megamenu");if(e(window).innerWidth()>v)for(var i=e(f).outerWidth(!0),d=0;d<n.length;d++)e(n[d]).parent("li").position().left+e(n[d]).outerWidth()>i?e(n[d]).css("right",0):((i==e(n[d]).outerWidth()||i-e(n[d]).outerWidth()<20)&&e(n[d]).css("left",0),e(n[d]).parent("li").position().left+e(n[d]).outerWidth()<i&&e(n[d]).css("right","auto"))}function s(){e(g).hide(0),e(m).show(0).click(function(){"none"==e(g).css("display")?e(g).slideDown(p.showSpeed):e(g).slideUp(p.hideSpeed).find(".dropdown, .megamenu").hide(p.hideSpeed)})}function r(){e(g).show(0),e(m).hide(0)}function l(){e(f).find("li, a").unbind(),e(document).unbind("click.menu touchstart.menu")}function h(){function n(n){var i=e(n).find(".menuzord-tabs-nav > li"),d=e(n).find(".menuzord-tabs-content");e(i).bind("click touchstart",function(n){n.stopPropagation(),n.preventDefault(),e(i).removeClass("active"),e(this).addClass("active"),e(d).hide(0),e(d[e(this).index()]).show(0)})}if(e(g).find(".menuzord-tabs").length>0)for(var i=e(g).find(".menuzord-tabs"),d=0;d<i.length;d++)n(i[d])}function c(){return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth}function u(){if(a(),c()<=v&&b>v&&(l(),p.responsive?(s(),t()):o()),c()>v&&v>=y&&(l(),r(),o()),b=c(),y=c(),h(),/MSIE (\d+\.\d+);/.test(navigator.userAgent)&&c()<v){var n=new Number(RegExp.$1);8==n&&(e(m).hide(0),e(g).show(0),l(),o())}}var p;e.extend(p={showSpeed:300,hideSpeed:300,trigger:"hover",showDelay:0,hideDelay:0,effect:"fade",align:"left",responsive:!0,animation:"none",indentChildren:!0,indicatorFirstLevel:"+",indicatorSecondLevel:"+",scrollable:!0,scrollableMaxHeight:400},n);var m,f=e(this),g=e(f).children(".menuzord-menu"),w=e(g).find("li"),v=1000,b=2e3,y=200;e(g).children("li").children("a").each(function(){e(this).siblings(".dropdown, .megamenu").length>0&&e(this).append("<span class='indicator'>"+p.indicatorFirstLevel+"</span>")}),e(g).find(".dropdown").children("li").children("a").each(function(){e(this).siblings(".dropdown").length>0&&e(this).append("<span class='indicator'>"+p.indicatorSecondLevel+"</span>")}),"right"==p.align&&e(g).addClass("menuzord-right"),p.indentChildren&&e(g).addClass("menuzord-indented"),p.responsive&&(e(f).addClass("menuzord-responsive").prepend("<a href='javascript:void(0)' class='showhide'><em></em><em></em><em></em></a>"),m=e(f).children(".showhide")),p.scrollable&&p.responsive&&e(g).css("max-height",p.scrollableMaxHeight).addClass("scrollable").append("<li class='scrollable-fix'></li>"),u(),e(window).resize(function(){u(),a()})}}(jQuery);


/*
 *  animateNumbers
 * -----------------------------------------------
*/
/***********
	Animates element's number to new number with commas
	Parameters:
		stop (number): number to stop on
        commas (boolean): turn commas on/off (default is true)
		duration (number): how long in ms (default is 1000)
		ease (string): type of easing (default is "swing", others are avaiable from jQuery's easing plugin
	Examples:
        $("#div").animateNumbers(1234, false, 500, "linear"); // half second linear without commas
		$("#div").animateNumbers(1234, true, 2000); // two second swing with commas
		$("#div").animateNumbers(4321); // one second swing with commas
	This fully expects an element containing an integer
	If the number is within copy then separate it with a span and target the span
	Inserts and accounts for commas during animation by default
***********/
!function(t){t.fn.animateNumbers=function(e,n,a,i){return this.each(function(){var d=t(this),o=parseInt(d.text().replace(/,/g,""));n=void 0===n?!0:n,t({value:o}).animate({value:e},{duration:void 0==a?1e3:a,easing:void 0==i?"swing":i,step:function(){d.text(Math.floor(this.value)),n&&d.text(d.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,"))},complete:function(){parseInt(d.text())!==e&&(d.text(e),n&&d.text(d.text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,")))}})})}}(jQuery);


/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.6
 */
!function(e){function r(r){return e(r).filter(function(){return e(this).is(":appeared")})}function t(){a=!1;for(var e=0,t=i.length;t>e;e++){var n=r(i[e]);if(n.trigger("appear",[n]),p[e]){var o=p[e].not(n);o.trigger("disappear",[o])}p[e]=n}}function n(e){i.push(e),p.push()}var i=[],o=!1,a=!1,f={interval:250,force_process:!1},u=e(window),p=[];e.expr[":"].appeared=function(r){var t=e(r);if(!t.is(":visible"))return!1;var n=u.scrollLeft(),i=u.scrollTop(),o=t.offset(),a=o.left,f=o.top;return f+t.height()>=i&&f-(t.data("appear-top-offset")||0)<=i+u.height()&&a+t.width()>=n&&a-(t.data("appear-left-offset")||0)<=n+u.width()?!0:!1},e.fn.extend({appear:function(r){var i=e.extend({},f,r||{}),u=this.selector||this;if(!o){var p=function(){a||(a=!0,setTimeout(t,i.interval))};e(window).scroll(p).resize(p),o=!0}return i.force_process&&setTimeout(t,i.interval),n(u),e(u)}}),e.extend({force_appear:function(){return o?(t(),!0):!1}})}(function(){return"undefined"!=typeof module?require("jquery"):jQuery}());


