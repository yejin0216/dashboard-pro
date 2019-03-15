angular.module('app.mydash')
    .controller('SENSOR_ICON_VIEW_MODAL_Ctrl', sensorIconViewModalCtrl);

function sensorIconViewModalCtrl($translate, $scope, $modalInstance, $rootScope, myDashService, wdgtInfo) {

    $scope.snsrIconList = wdgtInfo;
    $scope.selectedIcon = '';//초기화
    $scope.invalidMessage = '';//초기화

    //센서 아이콘 업데이트 모달 닫기
    $scope.closeSnsrIconModal = function() {
        $modalInstance.close();
    }

    //센서 아이콘 업데이트
    $scope.updateSnsrIcon = function() {
        //유효성 검증
        if ( !$scope.selectedIcon ) { //이미지 파일이 아닌 경우
            $scope.invalidMessage = $translate.instant('comm.eMsgInvalidFileFormat',{value1:'Image', value2:'png,jpeg,jpg'});
            return;
        }

        var param = {'wdgtSeq':$scope.snsrIconList.wdgtSeq
                    ,'mbrId':sessionStorage.getItem('dash_mbr_id')
                    ,'svcTgtSeq':$scope.snsrIconList.svcTgtSeq
                    ,'spotDevSeq':$scope.snsrIconList.spotDevSeq
                    ,'snsrCd':$scope.snsrIconList.snsrCd
                    ,'otputIcon':''};

        //사용자 정의 아이콘은 Base64로 인코딩한다.
        if ( $scope.selectedIcon.name ) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL($scope.selectedIcon);
            fileReader.onload = function (e) {
                param.otputIcon = e.target.result;
                myDashService.updateDevSnsrIcon(param)
                    .success(function(resp){
                        $rootScope.$broadcast($scope.snsrIconList.wdgtSeq+'.changeSettings', { refresh:true });
                        $modalInstance.close();
                    });
            }
        } else {
            param.otputIcon = 'assets/images/'+$scope.selectedIcon+'.png';
            myDashService.updateDevSnsrIcon(param)
                .success(function(resp){
                    $rootScope.$broadcast($scope.snsrIconList.wdgtSeq+'.changeSettings', { refresh:true });
                    $modalInstance.close();
                });
        }
    }

    //센서 아이콘 키트 Array 생성용
    $scope.range = function(n) {
        return new Array(n);
    };

    //센서 아이콘 선택시
    $scope.selectIcon = function(flag, index) {
        angular.element('#custIcon').val(null);
        $scope.selectedIcon = flag+index; //선택한 아이콘 key
    }

}