/**
 * ktDocs Module
 *
 * Description
 */
'use strict';

var ktDocApp = angular.module('ktDoc', ['ui.codemirror','kt.ui','pascalprecht.translate', 'ngRoute', 'ng']);

ktDocApp.config(['$routeProvider','$translateProvider', '$controllerProvider',function($routeProvider, $translateProvider, $controllerProvider) {
	$translateProvider.useStaticFilesLoader({
		prefix: 'doc/json/lang_test_',
		suffix: '.json'
	});
	// $translateProvider.translations('en_US', {
 //    "TITLE"     : "KT Standar Plaform UI F/W API Applicaition",
 //    "CHANGE.LAN" : "change language"
 //  });

 //  $translateProvider.translations('ko_KR', {
 //    "TITLE"     : "KT 표준관제 플랫폼 UI F/W API 어플리케이션",
 //    "CHANGE.LAN"     : "언어 변경"
 //  });

	$translateProvider.preferredLanguage('en_US');

	$routeProvider
		.when('/',{
			templateUrl:"doc/contents/index.html"
		})
		.when('/ui-patterns',{
			templateUrl:"doc/contents/ui-patterns/layout.html"/*,
            controller:"uiPatternLayoutController"*/
		})
		.when('/ui-patterns/:patternId',{
			templateUrl:"doc/contents/ui-patterns/layout.html"/*,
			controller:"uiPatternLayoutController"*/
		})
		.when('/api',{
			templateUrl:"doc/contents/api/layout.html"/*,
            controller:"apiLayoutController"*/
		})
		.when('/api/:patternId',{
			templateUrl:"doc/contents/api/layout.html"/*,
            controller:"apiLayoutController"*/
		})
		.when('/api/:patternId/:patternId2',{
			templateUrl:"doc/contents/api/layout.html"/*,
            controller:"apiLayoutController"*/
        })
		.when('/api/:patternId/:patternId2/:patternId3',{
			templateUrl:"doc/contents/api/layout.html"/*,
            controller:"apiLayoutController"*/
		})
		.when('/ui-examples',{
			templateUrl:"doc/contents/ui-examples/layout.html"/*,
            controller:"apiLayoutController"*/
		})
		.when('/ui-examples/:patternId',{
			templateUrl:"doc/contents/ui-examples/layout.html"/*,
            controller:"exampleLayoutController"*/
		})
		.when('/ui-examples/:patternId/:patternId2',{
			templateUrl:"doc/contents/ui-examples/layout.html"/*,
            controller:"exampleLayoutController"*/
		})
		.when('/ui-examples/:patternId/:patternId2/:patternId3',{
			templateUrl:"doc/contents/ui-examples/layout.html"/*,
            controller:"exampleLayoutController"*/
		});

	$controllerProvider.allowGlobals();
}]);

ktDocApp.value("KT_DOC_MENU",KT_DOC_MENU);

ktDocApp.controller('docMainCtrl',function($scope, $route, $location, $translate) {
	var sections = [];
	var langKey = "en_US"
	_.each(KT_DOC_MENU,function(element, index, list) {
		if(element.id === "index"){
			sections.push(element);
		}
	});

	$scope.sections = sections;

	$scope.changeLangToggle = function() {
		langKey = (langKey === "ko_KR") ? "en_US" : "ko_KR";
		$translate.use(langKey);
	};

	$scope.navClass = function(section) {
		var active = false;

		if($location.path().split("/")[1]===section.section){
			active = true;
		}

		return {
			active :active
		}
	};

});

ktDocApp.directive('docSubview', ['$compile', function($compile){
	// Runs during compile
	return {
		restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs, controller) {
			var template = '<div><ng-switch-when="'+$scope.patternId+'" ng-include src="patternUrl"></ng-switch-when></div>';
			iElm.html(template);
			$compile(iElm.contents())($scope);
		}
	};
}]);


ktDocApp.factory('PageMenuHelper',['KT_DOC_MENU', function(KT_DOC_MENU) {

	var nomalizedMenuList = _.reduce(KT_DOC_MENU,function(memo, obj) {
		var index = _.indexOf(_.pluck(memo,"section"),obj.section);
		if(index === -1) {
			memo.push({ section: obj.section, id: obj.id, child : []});
		}else {
			var splitedObjId = obj.id.split(".");
			var groupId = splitedObjId[0];
			var groupIndex = _.indexOf(_.pluck(memo[index].child,"id"), groupId);
			var pageId = splitedObjId[1];

			if(groupIndex === -1){
				memo[index].child.push({id: groupId, title: obj.title, child : [], url: obj.id.replace(/\./,"-")});
			}else{
				memo[index].child[groupIndex].child.push({ id: pageId, title: obj.title, url: obj.id.replace(/\./,"-") });
			}
		};
		return memo;
	},[]);

	function getTreeMenu(section) {
		return _(nomalizedMenuList).find( function(value) {
      return value.section === section;
    });
	}
	//url === ["rootId:ui-patterns","pageUrl:BP-SD2"]
	function getCurrentPage(url) {
		var rootInfo, groupInfo;

		var rootId = url[0];
		var groupId = (url[1] !== undefined) ? url[1].split("-")[0] : "";
		var pageId = (url[1] !== undefined) ? url[1].replace(/-/,".") : "";


		var pageInfo = _.find(KT_DOC_MENU,function(data) {
			if(!!!rootInfo && data.section === rootId) rootInfo = data;
			if(!!!groupInfo && data.id === groupId) groupInfo = data;
			return (data.section === rootId && data.id === pageId) ? true : false;
		}) || {
			id : "",
			title : "",
			url : ""
		};

		if(groupInfo === undefined){
			groupInfo = {
				id : "",
				title: "",
				url:""
			}
		}

		if(pageInfo)

		return {
			rootInfo : rootInfo,
			pageInfo : angular.extend({ url : pageInfo.id.replace(".","-")},pageInfo),
			groupInfo : angular.extend({ url : groupInfo.id.replace(".","-")}, groupInfo)
		};
	}
	return {
		getTreeMenu : getTreeMenu,
		getCurrentPage : getCurrentPage
	}
}]);
// ktDocApp.directive('navHeader', [function(){
// 	// Runs during compile
// 	return {
// 		restrict: 'AC', // E = Element, A = Attribute, C = Class, M = Comment
// 		link: function($scope, iElm, iAttrs, controller) {
// 			iElm.addClass("unfold");

// 			iElm.toggle(
// 				function() {
// 					$(this).removeClass("unfold");
// 					$(this).addClass("fold").nextUntil('li.divider').hide();
// 			},function() {
// 				$(this).removeClass("fold");
// 					$(this).addClass("unfold").nextUntil('li.divider').show();
// 			});
// 		}
// 	};
// }]);