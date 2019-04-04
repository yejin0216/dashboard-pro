angular.module('app.mydash')
    .controller('SENSOR_IMAGE_WIDGET_Ctrl', sensorImageWdgtCtrl)
    .controller('SENSOR_IMAGE_WIDGET_SET_Ctrl', sensorImageWdgtSetCtrl);

function sensorImageWdgtCtrl($scope, $rootScope, $modal, myDashService) {

    $scope.content = '10'; //content type
    $scope.devList = [];

    //initialize
    $scope.getWdgtInfo = function(widget) {
        $scope.wdgtInfo = widget;
        $scope.gridCol = JSON.parse(widget.wdgtDataset).ds; //데이터셋

        getDevSnsrList(widget);//디바이스,센서 목록 조회

        //변경된 위젯설정 배포
        $scope.$on($scope.wdgtInfo.wdgtSeq+".changeSettings", function(event, arg){
            if ( arg.refresh ) {
                getDevSnsrList($scope.wdgtInfo);
            }
        });
    };

    //디바이스,센서 목록 조회
    function getDevSnsrList(widget) {
        myDashService.getDevSnsrList(widget.wdgtSeq)
            .success(function(resp){
                if ( resp.responseCode === '200' && resp.data ) {
                    var result = resp.data[0];
                    //capability 목록
                    var cpList = {'0001':'BUTTON', //0001
                                  '0002':'TOGGLE', //0002`
                                  '0003':'SWITCH', //0003
                                  '0006':'COMBO', //0006
                                  '0008':'TEXT', //0008
                                  '0009':'SLIDER'}; //0009

                    // 컨텐츠 타입 정의
                    if ( result.snsrType === '3000' || result.snsrType === '0000020' ) {
                        $scope.content = '30'; //제어인 경우, content type
                        //capability를 위한 세팅
                        $scope.allDevList = resp.data;
                        $scope.allDevList[0].uiType = cpList[$scope.allDevList[0].uiType];
                        $scope.allDevList[0].wdgtSeq = $scope.wdgtInfo.wdgtSeq;

                        $rootScope.$broadcast(widget.wdgtSeq+'.changeCapaUISettings', {data:$scope.allDevList[0]});
                    } else {
                        $scope.content = '20'; //content type
                    }

                    //기준정보 세팅
                    $scope.devList.svcTgtSeq = result.svcTgtSeq;
                    $scope.devList.spotDevSeq = result.spotDevSeq;
                    $scope.devList.snsrCd = result.snsrCd;
                    //옵션에서 선택한 항목 세팅
                    for (var i = 0, iCount = $scope.gridCol.length; i<iCount; i++) {
                        var colId = $scope.gridCol[i].id;
                        $scope.devList[colId] = result[colId];
                        colId = null;
                    }
                }
            });
    }

    //센서 아이콘 변경
    $scope.updateIcon = function(list) {
        //아이콘 업데이트 모달 호출
        list.wdgtSeq = $scope.wdgtInfo.wdgtSeq; //위젯일련번호 세팅
        $modal.open({
            templateUrl:'app/components/dashboard/widget/SENSOR_ICON_VIEW_MODAL.html',
            scope:$scope,
            resolve:{
                wdgtInfo: function() {
                    return list;
                }
            },
            controller:'SENSOR_ICON_VIEW_MODAL_Ctrl'
        });
    }

    // 실시간 업데이트
    $scope.$on('getLastVal', function (e, data) {
        var devItem = $scope.devList;
        var pData = data.data,
            pSvcTgtSeq = pData.svcTgtSeq,
            pSpotDevSeq = pData.spotDevSeq,
            pAttributes = pData.attributes;
        if ( devItem.svcTgtSeq == pSvcTgtSeq && devItem.spotDevSeq == pSpotDevSeq ) { //서비스대상일련번호, 디바이스일련번호가 동일할 경우
            if ( pAttributes && pAttributes[devItem.snsrCd] ) {
                devItem.lastVal = pAttributes[devItem.snsrCd];
                devItem.amdDtt = moment(pData.occDt).format("YYYY-MM-DD HH:mm:ss");
            }
        }
        $scope.devList = devItem;
        $scope.$apply();
    });
}

function sensorImageWdgtSetCtrl($translatePartialLoader, $translate, $rootScope, $scope, $modalInstance, myDashService, wdgtInfo) {

    $scope.wdgtNm = wdgtInfo.wdgtNm; //기저장 또는 Default 위젯명 세팅
    $scope.wdgtSubnm = wdgtInfo.wdgtSubnm; //기저장 또는 Default 위젯명 세팅

    var savedDevSnsr = wdgtInfo.devSnsrWdgtList; //기저장한 디바이스/센서 정보
    $scope.selectedList = []; //디바이스/센서 목록
    if ( savedDevSnsr ) {
        $scope.selectedList = savedDevSnsr; //디바이스명, 센서명을 찾아서 목록에 넣는다.
        savedDevSnsr = null;
    }

    //디바이스 목록 조회
    myDashService.getDeviceList()
        .success(function(resp){
            if ( resp.responseCode === '200' ) {
                $scope.devList = resp.data; //디바이스 목록
            }
        });

    /**
     * 디바이스 센서 조회
     * @param selectedDev 선택한 디바이스
     */
    $scope.getSnsrByDev = function(selectedDev) {
        myDashService.getDeviceModel(selectedDev.devModelSeq)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    $scope.selectedSnsr = []; //센서목록 초기화
                    $scope.snsrList = resp.data.sensingTags;
                }
            });
    }

    /**
     * 추가한 센서 목록
     * @description 선택한 디바이스, 센서 목록 세팅
     */
    $scope.setSelectedList = function() {
        if ( !$scope.selectedSnsr.code ) return;
        if ( $scope.selectedList ) $scope.selectedList = [];


        var addItem = { 'svcTgtSeq': $scope.selectedDev.svcTgtSeq
                      , 'spotDevSeq': $scope.selectedDev.spotDevSeq
                      , 'devNm': $scope.selectedDev.devNm
                      , 'snsrCd': $scope.selectedSnsr.code
                      , 'snsrNm': $scope.selectedSnsr.name };
        $scope.selectedList.push(addItem);
    }

    /**
     * 선택한 행 삭제
     * @param index 선택한 행 인덱스
     */
    $scope.delRow = function(index) {
        $scope.selectedList.splice(index,1);
    }

    /**
     * 모달 닫기
     */
    $scope.close = function() {
        $modalInstance.close();
    }

    /**
     * 모달 변경내역 저장
     */
    $scope.save = function() {
        //현재 추가된 목록이 없을 경우
        if ( $scope.selectedList.length === 0 ) {
            $scope.invalidMessage = $translate.instant('wdgt.eMsgMustValue');
            return;
        }

        var param = {'wdgtNm':$scope.wdgtNm
                   , 'wdgtSubnm':$scope.wdgtSubnm
                   , 'wdgtSeq':wdgtInfo.wdgtSeq
                   , 'sensors':$scope.selectedList
                   , 'mbrId':sessionStorage.getItem('mbr_id')};
        myDashService.insertDevSnsrWdgtBySbjt(param)
            .success(function(resp){
                // 위젯설정 broadcast
                $rootScope.$broadcast(wdgtInfo.wdgtSeq+'.changeSettings', {refresh:true});
                $rootScope.$emit('changeWdgtInfo', {wdgtNm:$scope.wdgtNm, wdgtSubnm:$scope.wdgtSubnm, wdgtSeq:wdgtInfo.wdgtSeq}); //위젯정보 변경
                $modalInstance.close(); //모달 닫기
            });
    }
}


