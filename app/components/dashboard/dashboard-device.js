angular.module('app.mydash')
    .controller('DashboardDevController', DashboardDevController)
    .filter('snsrTypeNm', function($translate) {
        return function (input) {
            if ( input == '0000010' || input == '1000' ) {
                return $translate.instant('comm.colec'); //수집
            }
            return $translate.instant('comm.cntrl'); //제어
        };
    });

function DashboardDevController($rootScope, $scope, $state, $filter, $translate, myDashService) {

    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력
    $scope.deviceModal = false; //모달

    var selectedRowNum; //선택한 센서목록의 인덱스
    var vm = this;
    var selectedDevModel; //선택한 디바이스 모델

    //연동가능 목록
    // vm.ifList = [{'code':'0000','name':'NB-IoT'},
    //              {'code':'0001','name':'GiGA Genie'}];
    //capability 목록
    vm.cpList = [{code:'BUTTON', name:'BUTTON'}, //0001
                 // {code:'TOGGLE', name:'TOGGLE'}, //0002`
                 // {code:'SWITCH', name:'SWITCH'}, //0003
                 // {code:'CHECK', name:'CHECK'}, //0004
                 // {code:'RADIO', name:'RADIO'}, //0005
                 {code:'COMBO', name:'COMBO'}, //0006
                 // {code:'DATEPICKER', name:'DATEPICKER'}, //0007
                 // {code:'LINEGRAPH', name:'LINEGRAPH'} //0010
                 // {code:'SLIDER', name:'SLIDER'}]; //0009
                 {code:'TEXT', name:'TEXT'}] //0008

    vm.currentModal = 'dtlView'; //현재모달
    vm.snsrList = []; //선택한 디바이스의 센서 목록
    vm.cntrlSnsrList = []; //선택한 디바이스의 제어센서 목록
    vm.cntrlSnsr = '';
    vm.capaBySnsr = '';
    vm.capaValue = '';

    //디바이스 목록 조회
    myDashService.getDeviceListV1()
        .success(function(resp){
            if ( resp.responseCode === 'OK' ) {
                vm.devList = resp.data.rows; //디바이스 목록
            }
        });

    /**
     * 모달 열기
     * @param name Translate 코드명
     * @param dev 선택한 디바이스 정보
     */
    vm.open = function(name, dev) {
        vm.selectedDev = dev; //선택한 디바이스
        if ( name !== 'dtlView' ) {
            //유효성검증 항목 초기화
            $scope.invalidMessage1 = '';
            $scope.invalidMessage2 = '';
            $scope.invalidMessage3 = '';
            //디바이스모델 조회
            myDashService.getDeviceModel(dev.devModelSeq)
                .success(function(resp){
                    if ( resp.responseCode === '200') {
                        selectedDevModel = resp.data;
                        if ( resp.data.sensingTags ) {
                            vm.snsrList = resp.data.sensingTags; //센서목록
                            initModal(name);
                        }
                    }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
        }
        vm.modalName = $translate.instant('comm.'+name);
        vm.currentModal = name;

        $scope.deviceModal = true; //모달
    }

    /**
     * 모달 초기화
     * @param name 선택한 모달정보
     */
    function initModal(name) {
        if ( name === 'snsrView' ) {
            vm.getSnsrDtl(vm.snsrList[0], 0); //센서 상세보기
        } else if ( name === 'setCapa' ) {
            vm.cntrlSnsrList = vm.snsrList.filter(function(data){return data.type == '0000020' || data.type == '3000'}); //제어센서목록
        }
    }

    /**
     * 센서 자세히보기
     * @param snsr 선택한 센서
     * @param idx 선택한 센서의 인덱스
     */
    vm.getSnsrDtl = function(snsr, idx) {
        vm.selectedSnsr = snsr; //선택한 센서
        vm.selectedTagGroup = vm.selectedSnsr.tagGroup; //선택한 센서의 그룹태그
        //vm.selectedDataType = vm.selectedSnsr.dataType; //선택한 센서의 데이터타입
        selectedRowNum = idx;
    }

    /**
     * 모달 닫기
     */
    vm.close = function() {
        $scope.deviceModal = false; //모달

        //initialize
        vm.snsrList = [];
        vm.cntrlSnsrList = [];
        vm.cntrlSnsr = '';
        vm.capaBySnsr = '';
        vm.capaValue = '';
    }

    /**
     * CSS:센서목록
     * @param rowNum
     * @returns {string}
     */
    vm.isActive = function(idx) {
        if ( selectedRowNum == idx ) {
            return 'clickedBox'
        }
        return '';
    }

    /**
     * 센서별 Capability 세팅
     */
    vm.setCapaBySnsr = function() {
        vm.capaBySnsr = vm.cntrlSnsr.uiType;
        vm.capaValue = JSON.stringify(vm.cntrlSnsr.values);
    }

    /**
     * 모달 변경내역 저장
     */
    vm.save = function() {
        var tempSnsr = selectedDevModel.sensingTags;
        //센서보기 변경내역 저장
        if ( vm.currentModal === 'snsrView' && (vm.selectedTagGroup || vm.selectedDataType)) {
            for ( var i=0, count=tempSnsr.length; i<count; i++ ) {
                if ( tempSnsr[i].code === vm.selectedSnsr.code ) {
                    selectedDevModel.sensingTags[i].group = vm.selectedTagGroup; //그룹태그
                    //selectedDevModel.sensingTags[i].dataType = vm.selectedDataType; //데이터타입
                }
            }
        //Capability 변경내역 저장
        } else if ( vm.currentModal === 'setCapa' ) {
            //유효성 검증
            var validate = true;
            if ( !vm.cntrlSnsr ) {
                $scope.invalidMessage1 = $translate.instant('wdgt.eMsgMustValue');
                validate = false;
            }
            if ( !vm.capaBySnsr ) {
                $scope.invalidMessage2 = $translate.instant('wdgt.eMsgMustValue');
                validate = false;
            }
            if ( !vm.capaValue ) {
                $scope.invalidMessage3 = $translate.instant('wdgt.eMsgMustValue');
                validate = false;
            }/* else {
                $scope.invalidMessage3 = $translate.instant('wdgt.eMsgInvalidDataType', {value:'JSON'});
            }*/
            if ( !validate ) return;

            console.log(vm.capaValue)

            for ( var i=0, count=tempSnsr.length; i<count; i++ ) {
                if ( tempSnsr[i].code === vm.cntrlSnsr.code ) {
                    selectedDevModel.sensingTags[i].uiType = vm.capaBySnsr; //ui type
                    selectedDevModel.sensingTags[i].values = JSON.parse(vm.capaValue); //values
                }
            }
        }

        //모달 닫기
        vm.close();

        //디바이스모델 업데이트
        myDashService.updateDeviceModel(vm.selectedDev.devModelSeq, selectedDevModel)
            .success(function(resp){
                if ( resp.responseCode === '200') {

                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }
}