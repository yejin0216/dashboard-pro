angular.module('app.mydash')
    .controller('COMM_MAP_TOOLS_Ctrl', commMapToolsCtrl);

function commMapToolsCtrl($translatePartialLoader, $translate, $modalInstance, $scope, $rootScope, wdgtInfo, myDashService) {

    $scope.invalidMessage = ''; //유효성검증 메시지

    //모달 닫기
    $scope.close = function() {
        $modalInstance.close();
    }

    //행추가
    $scope.addRow = function(){
        $scope.assetsList.push({"label":"", "value":""});
    }

    //행삭제
    $scope.delRow = function(index){
        $scope.assetsList.splice(index, 1);
    }

    //모달내용 저장
    $scope.save = function() {
        //빈값이 있는지 유효성 검증
        var error = false;
        $scope.invalidMessage = '';
        for ( var i=0, iCount=$scope.assetsList.length; i<iCount; i++ ) {
            var asset = $scope.assetsList[i];
            if (asset.label === '' || asset.value === '') {
                error = true;
            }
        }
        if ( error ) {
            $scope.invalidMessage = $translate.instant("wdgt.eMsgMustAssetValue");//자산 이름 또는 자산 상세정보를 입력하세요.
            return;
        }

        //변경된 자산정보 업데이트
        var param = { "wdgtSeq":wdgtInfo.wdgtSeq
                    , "svcTgtSeq":wdgtInfo.svcTgtSeq
                    , "spotDevSeq":wdgtInfo.spotDevSeq
                    , "mapExpnsnInfo":JSON.stringify({"asset":$scope.assetsList}) };
        myDashService.updateComplexMapAsset(param)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $scope.$emit(wdgtInfo.wdgtSeq+'.changeMapAsset', {asset:$scope.assetsList});//변경된 자산정보 부모창에 전달
                    $modalInstance.close(); //닫기
                }
            })
            .error(function(error){
                console.log("API Service Error : " + error.status + " " + error.error);
            });
    }

    //최초조회
    function init() {
        //자산정보 세팅
        if ( wdgtInfo.mapExpnsnInfo ) {
            $scope.assetsList = wdgtInfo.mapExpnsnInfo;
        } else {
            $scope.assetsList = [{"label":"", "value":""}]; //자산 목록
        }
    }

    init(); //최초조회
}