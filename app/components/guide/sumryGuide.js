angular.module('app.guide', ['kt.ui'])
    .controller('sumryGuideController',
        function($scope, $translate, $modalInstance) {

            //헤더의 가이드 메시지를 출력한다.
            $scope.getSumryMsg = function(num) {
                $scope.sumryNaviMsg = '';
                $scope.sumryHeaderMsg = '';
                $scope.sumryDashbdMsg = false;
                $scope.sumryFootMsg = '';
                if ( num === 0 ) {
                    $scope.sumryNaviMsg = $translate.instant("comm.eMsgSumryMsg00");
                } else if ( num === 1 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg01");
                } else if ( num === 2 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg02");
                } else if ( num === 3 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg03");
                } else if ( num === 4 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg04");
                } else if ( num === 5 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg05");
                } else if ( num === 6 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg06");
                } else if ( num === 7 ) {
                    $scope.sumryNaviMsg = $translate.instant("comm.eMsgSumryMsg07");
                } else if ( num === 8 ) {
                    $scope.sumryNaviMsg = $translate.instant("comm.eMsgSumryMsg08");
                } else if ( num === 9 ) {
                    $scope.sumryDashbdMsg = $translate.instant("comm.eMsgSumryMsg09");
                } else if ( num === 10 ) {
                    $scope.sumryFootMsg = $translate.instant("comm.eMsgSumryMsg10");
                } else if ( num === 11 ) {
                    $scope.sumryFootMsg = $translate.instant("comm.eMsgSumryMsg11");
                } else if ( num === 12 ) {
                    $scope.sumryHeaderMsg = $translate.instant("comm.eMsgSumryMsg12");
                }
             }

            //모달을 닫는다.
            $scope.close = function() {
                $modalInstance.close();
            }
        });