angular
    .module('app', [
        'app.auth',
        'app.mydash',
        'app.manage',
        'app.guide',
        'app.commSvc',
        'ui.router',
        'ngFileUpload',
        'pascalprecht.translate',
        'angular-jwt',
        'ngSanitize',
        'gridster',
        'ngMaterial',
        'colorpicker'
    ])
    .run(function($rootScope, $state, jwtHelper, authDataService, $modalStack, $location, $window) {

        $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {
            if(sessionStorage.getItem('dash_access_token') && !jwtHelper.isTokenExpired(sessionStorage.getItem('dash_access_token'))) {
                $rootScope.access_token = sessionStorage.getItem('dash_access_token');
            } else {
                $rootScope.access_token = null;
            }
            if (toState.data && toState.data.requiresLogin ) {
                if (!sessionStorage.getItem('dash_access_token') || jwtHelper.isTokenExpired(sessionStorage.getItem('dash_access_token'))) {
                    e.preventDefault();
                    $rootScope.access_token = null;
                    sessionStorage.clear();

                    $state.go('auth.login', {toState:toState,toParams:toParams});
                }
            }
            $modalStack.dismissAll();
        });

        $rootScope.$on('$viewContentLoaded', function(){
            var state = $state.$current;
            if (state.scrollTo == undefined) $window.scrollTo(0, 0);
            else {
                var to = 0;
                if (state.scrollTo.id != undefined)
                    to = $(state.scrollTo.id).offset().top;
                if ($($window).scrollTop() == to)
                    return;
                if (state.scrollTo.animated)
                    $(document.body).animate({scrollTop:to});
                else
                    $window.scrollTo(0, to);
            }
        });

    });
