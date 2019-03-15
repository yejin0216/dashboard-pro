(function() {
    angular
        .module('app')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .when('', '/dashboard')
            .otherwise('/dashboard');

        $stateProvider
            .state('auth', {
                url:'/auth',
                controller:'AuthController as vm',
                templateUrl:'components/login/auth.html'
            })
            .state('auth.login', {
                url:'/login',
                controller:'LoginController as vm',
                templateUrl:'components/login/login.html',
                params:{'toState':'', 'toParams':''},
                data:{
                    requiresLogin:false
                }
            })
            .state('auth.findId', {
                url:'/id/identify',
                controller:'IdentifyController as vm',
                templateUrl:'components/login/identify.html',
                params:{param:'id'},
                data:{
                    requiresLogin:false
                }
            })
            .state('auth.findPwd', {
                url:'/pwd/identify',
                controller:'IdentifyController as vm',
                templateUrl:'components/login/identify.html',
                params:{param:'pwd'},
                data:{
                    requiresLogin:false
                }
            })
            .state('auth.changePwd', {
                url:'/pwd/policy',
                controller:'pwdPolicyController as vm',
                templateUrl:'components/login/pwdPolicy.html',
                data:{
                    requiresLogin:false
                }
            })
            .state('bmark', {
                url:'/bookmark',
                controller:'BookmarkController as vm',
                templateUrl:'components/dashboard/dashboard-bookmark.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('myDev', {
                url:'/device',
                controller:'DashboardDevController as vm',
                templateUrl:'components/dashboard/dashboard-device.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('log', {
                url:'/log',
                controller:'DashboardLogController as vm',
                templateUrl:'components/dashboard/dashboard-log.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('dashbdList', {
                url:'/dashbdList',
                controller:'DashboardListController as vm',
                templateUrl:'components/dashboard/dashboard-list.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('notice', {
                url:'/notice',
                controller:'DashboardNoticeController as vm',
                templateUrl:'components/dashboard/dashboard-notice.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('mydashboard', {
                url:'/dashboard',
                controller:'MyDashCtrl as vm',
                templateUrl:'components/dashboard/dashboard-main.html',
                params:{'sequence':0},
                data:{
                    requiresLogin:true
                }
            })
            .state('general', {
                url:'/manage/general',
                controller:'GeneralController as vm',
                templateUrl:'components/manage/general.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('updHist', {
                url:'/manage/history',
                controller:'HistoryController as vm',
                templateUrl:'components/manage/history.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('faq', {
                url:'/manage/FAQ',
                controller:'FAQController as vm',
                templateUrl:'components/manage/FAQ.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('korUserGuide', {
                url:'/guide/korean',
                controller:'userGuideController as vm',
                templateUrl:'components/guide/korUserGuide.html',
                data:{
                    requiresLogin:true
                }
            })
            .state('engUserGuide', {
                url:'/guide/english',
                controller:'userGuideController as vm',
                templateUrl:'components/guide/engUserGuide.html',
                data:{
                    requiresLogin:true
                }
            })
    }
})();