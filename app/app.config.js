angular.module('app')
    .config([
        "$httpProvider", "jwtInterceptorProvider",
        function($httpProvider, jwtInterceptorProvider){
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            jwtInterceptorProvider.tokenGetter = function($state, jwtHelper, $rootScope, authDataService) {
                if(!sessionStorage.getItem('access_token')) {
                    var tokenParams = {
                        grant_type: 'client_credentials',
                        username: '',
                        password: ''
                    };
                    authDataService.gwLogin(tokenParams)
                        .success(function (data) {
                            var token = data.access_token;
                            if (token) {
                                sessionStorage.setItem('client_token', token);
                                return token;
                            }
                        });
                } else {
                    if (jwtHelper.isTokenExpired(sessionStorage.getItem('access_token'))) {
                        $rootScope.access_token = null;
                        sessionStorage.clear();
                        $state.go('auth.login', {toState:{},toParams:{},refresh:true});
                    }
                    return sessionStorage.getItem('access_token');
                }
            };
            $httpProvider.interceptors.push('jwtInterceptor');
        }
    ]);

