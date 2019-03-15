//-----------------------------------------------------------------
// IE console.log 보완
//-----------------------------------------------------------------
if (window.console === undefined || console.log === undefined ) {
    console = { log: function() {} };
}

//-----------------------------------------------------------------
// binding event
//-----------------------------------------------------------------
//모든 리소스 로드 후
$(window).bind("load",function(){
    //portal.ui.tbConFixedReady();
    portal.ui.gnb();
    portal.ui.gnbSlide();
    portal.ui.bsToggleSwicth();
    portal.ui.ieVerCheck();
});
//DOM 생성 후
$(window).bind("ready",function(){

});

$(window).bind("resize",function(){
    portal.ui.tbConFixed(250);
});

$(window).bind("scroll",function(){
    portal.ui.gnbSlide();
    portal.ui.tbConFixed(250);
});

//-----------------------------------------------------------------
// portal.ui
//-----------------------------------------------------------------
var portal = portal || {};
portal.ui={

    /**
     * GNB
     * @param {형식} 인자값 - 설명
     */
    gnb:function(){
        var gnb = $("nav.gnb");
        //sbg = $("#submenuBG");
        $(".d1", gnb).bind("mouseenter focusin",
            function(){
                if ($(".depth2", this).length >= 1 && $(".depth2", this).css("display") != "block"){
                    $(".depth2", gnb).hide(0);
                    $(".depth2", this).show(0);
                    //sbg.show(0);
                    portal.ui.gnbSize(this);
                }
            }
        );
        $(".d1", gnb).bind("mouseleave",
            function(){
                $(".depth2", this).hide(0);
                //sbg.hide(0);
                portal.ui.gnbActive();
            }
        );
        $(gnb).bind("mouseleave",
            function(){
                //sbg.hide(0);
                portal.ui.gnbActive();
            }
        );
    },
	/* SNB 초기 활성 */
    gnbActive:function(d1,d2){
        var gnb = $("nav.gnb");
        if (d1==0){
            $(".depth1 a",gnb).removeClass("on");
            $(".depth2",gnb).hide();
        } else{
            $(".depth1 > li:eq("+(d1-1)+")"+"> a",gnb).addClass("on");
            //$(".depth1 > li:eq("+(d1-1)+")"+" .depth2",gnb).css({left:0,marginLeft:0});
            $(".depth1 > li:eq("+(d1-1)+") > ul > li:eq("+(d2-1)+")"+"> a",gnb).addClass("on");
        }
        var allD1 = $(".depth1>.d1", gnb);
        $.each(allD1,function(){
            var actM = $(">a", this);
            if ( actM.attr("class") == "on" ){
                $("+.depth2",actM).show(0);
                //sbg.show(0);
                portal.ui.gnbSize(this);
            }
        });
    },
	/* SNB 사이즈 조절 */
    gnbSize:function(target){
        var gnb = $("nav.gnb");
        var menu = $(".depth2", target);
        var menus = $(".d2", target);
        var exSize = 18;//크로스브라우징 위한 1px 여백+영문 웹폰트를 위한 9px 여백
        var totalSize = 0;
        $.each(menus,function(){
            totalSize += parseInt($(this).outerWidth());
        });
        if ( menu.outerWidth() < totalSize+exSize ){ menu.width(totalSize+exSize); }
        if ( menu.outerWidth() > $(target).outerWidth() ){
            if ( (totalSize+menu.position().left) > (gnb.outerWidth()) ){
                menu.css("right","-"+exSize+"px");
            }else if (menu.position().left <= 1){
                //menu.css("left",0);
            }else{
                menu.css("margin-left","-"+parseInt((totalSize/2)-($(target).width()/2-parseInt(menu.css("padding-left"))))+"px");
            }
        }else{
            menu.css("margin-left",parseInt(($(target).width()/2-parseInt(menu.css("padding-left")))-(totalSize/2))+"px");
        }
    },

    /**
     * gnbSlide
     * @param {형식} 인자값 - 설명
     */
    gnbSlide:function(){
        var sc = $(document).scrollTop();
        var hdr = $("header.header");

        //if ($("body").attr("class")=="ng-scope home"){
        //		//hdr.addClass("mini");
        //}else{
        //	if (sc>1){
        //		//hdr.addClass("mini");
        //		hdr.addClass("fixed");
        //	} else {
        //		//hdr.removeClass("mini");
        //		hdr.removeClass("fixed");
        //	}
        //}
    },

	/* 토글 버튼 */
    bsToggleSwicth:function(){
        var ts = $(".toggleSwitch");
        if (ts){
            $(".toggleSwitch").bootstrapSwitch();
        }
    },

    saveId:function(){
        //작성
        //name space -> portal.ui.saveId();
    },

    guideScroll:function(el){
        var top = 0;
        var headerH = $("header.header").height();
        var titPd = 14;
        if (el.offsetParent) {
            do {
                top += el.offsetTop;
            } while (el = el.offsetParent);
            return [top-headerH-titPd];
        }
    },

    scrollTo:function(el){
        var el = document.getElementById(el);
        window.scroll(0, portal.ui.guideScroll(el));
    },

    tbConFixedReady:function(){
        //var tbc = document.getElementById("tbCon");
        //tbcPos = tbc.offsetTop;
        tbcPos = 250;
        portal.ui.tbConFixed(tbcPos);
    },

    tbConFixed:function(tbcPos){
        if (tbcPos<$(document).scrollTop()){
            $("#tbCon").addClass("fixed");
        }else{
            $("#tbCon").removeClass("fixed");
        }
    },

    ieVerCheck:function(){
        var trident = navigator.userAgent.match(/Trident\/(\d)/i);
        if(trident != null){	 trident = 1;	} else{	 trident = 0;	}
        var vs = navigator.appVersion.toLowerCase(), ie;
        if (vs.indexOf("msie 7") != -1 && trident == 0){ie ="IE7"; }
        else if (vs.indexOf("msie 8") != -1 || (vs.indexOf("msie 7") != -1 && trident == 1)){ ie ="IE8";}
        else if (vs.indexOf("msie 9") != -1){	ie ="IE9";}
        else if (vs.indexOf("msie 10") != -1)	{ie ="IE10";}
        else if (vs.indexOf("mac os") != -1)	{ie ="MacOS";}

        //if (ie=="IE7" || ie=="IE8" || ie=="IE9" ){
        if (ie=="IE7" || ie=="IE8"){
            $("body").html("<div class='oldIEArea'>"+
                "<div class='oiaCon'>"+
                "<p>"+
                "GiGA IoTMakers는 오래된 Internet Explorer 버전을 지원하지 않습니다.<br>"+
                "<strong>Internet Explorer 9</strong> 버전 이상으로 업그레이드 하시거나<br>"+
                "최신의 <strong>Chrome, Safari, FireFox</strong>등의 브라우저를 통해 재접속 하시기 바랍니다.<br> "+
                "이용에 불편을 드려 죄송합니다."+
                "</p>"+
                "<div class='btnArea'>"+
                "<a href='#' class='back' onclick='history.back(-1);return false;'>뒤로가기</a>"+
                "</div>"+
                "</div>"+
                "<div class='oiaBg'></div>"+
                "</div>	");
        }
    }

};

$(document).ready(function(){
    $('body').click(function(e){
        //if(!$(e.target).hasClass("glyphicon-th-large")){
        if(!$(e.target).hasClass("curDashbd")){
            $(".select_list").slideUp();
        }
        if($(".tableOfCon").css("bottom") == "53px"){
            if(!$(e.target).hasClass("guide_lnb_btn") && !$(e.target).hasClass("tableOfCon")){
                $(".tableOfCon").hide();
            }
        }
    });
});

function selectOn(_this){
    var _this = $(_this);
    var selectTxt = _this.text();
    $(".header_tab .nowDashboard span").text(selectTxt);
    $(".select_list").slideUp();
}

function selectBtn(_this){
    var _this = $(_this);
    _this.next().stop().slideToggle();
}

function lnbFuc(_this){
    var _this = $(_this);
    if(_this.next(".tableOfCon").css("display") == "block"){
        _this.next(".tableOfCon").hide();
    }else if(_this.next(".tableOfCon").css("display") == "none"){
        _this.next(".tableOfCon").show();
    }
}
