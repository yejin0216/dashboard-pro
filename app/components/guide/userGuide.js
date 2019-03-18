angular.module('app.guide', ['kt.ui'])
    .controller('userGuideController',
        function($rootScope) {
            $rootScope.$emit('showDashbdSttus', false); //상단 바 출력
        });