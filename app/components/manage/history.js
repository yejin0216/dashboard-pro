angular.module('app.manage')
    .controller('HistoryController', HistoryController);

function HistoryController($rootScope) {

    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

}