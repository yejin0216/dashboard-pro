angular.module('app.mydash')
    .controller('DashboardListController', DashboardListController);

function DashboardListController($rootScope, $scope, myDashService, messageBox, $state, $filter, $translate) {

    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

    var vm = this;
    vm.updateMode = false; //업데이트 모드 여부
    $scope.sbjtAddModal = false; //[테마추가]모달
    vm.selectedSbjtSeq = 0; //선택한 테마일련번호

    /**
     * 테마 목록 조회
     */
    myDashService.getSbjtList()
        .success(function(resp){
            if ( resp.responseCode === '200' ) {
                if ( resp.data.total > 0 ) {
                    //공통코드 조회: 테마타입코드(D002)
                    myDashService.getCdDtlList('D002')
                        .success(function(code){
                            vm.sbjtList = resp.data.rows; //테마목록
                            vm.commList = code.data; //테마타입코드
                        });
                }
            }
        })
        .error(function(resp) {
            console.log("API Service Error : " + resp.status + " " + resp.error);
            vm.sbjtList = [{}];
        });

    /**
     * 선택한 테마로 이동
     * @param sequence 선택한 테마일련번호
     */
    vm.move = function(sequence) {
        $rootScope.$emit('moveDashbd', {sequence:sequence});
        //$state.go('mydashboard', {sequence:sequence}); //대시보드로 이동
    }

    /**
     * 테마 수정모드로 전환
     * @param sbjt 선택한 테마 정보
     */
    vm.update = function(sbjt) {
        $scope.invalidMessage = '';
        vm.updateMode = true; //업데이트 모드
        vm.sbjtNm = sbjt.sbjtNm; //테마명
        vm.sbjtCtgTypeCd = sbjt.sbjtCtgTypeCd; //테마타입코드
        vm.selectedSbjtSeq = sbjt.sbjtSeq; //선택한 테마일련번호
    }

    /**
     * 수정한 테마정보 저장
     */
    vm.save = function(sbjt) {
        //유효성 검증
        if ( typeof vm.sbjtNm == 'undefined' || vm.sbjtNm == '' ) {
            messageBox.open($translate.instant('dash.eMsgInvalidDashbdNm'), {
                type: "warning"
            });
            return;
        }
        //변경된 정보가 없을 경우 api를 호출할 필요가 없다.
        if ( vm.sbjtNm != sbjt.sbjtNm || vm.sbjtCtgTypeCd != sbjt.sbjtCtgTypeCd ) {
            var param = {'sbjtSeq':vm.selectedSbjtSeq
                        , 'sbjtNm':vm.sbjtNm
                        , 'sbjtCtgTypeCd':vm.sbjtCtgTypeCd
                        , 'mbrId':sessionStorage.getItem('mbr_id')
                        , 'mbrSeq':sessionStorage.getItem('mbr_seq')};
            myDashService.updateSbjtItem(param)
                .success(function (resp) {
                    if (resp.responseCode === '200') {
                        vm.sbjtList = resp.data;
                        vm.selectedSbjtSeq = 0;

                        $rootScope.$emit('refreshSbjtList', {sbjtList:vm.sbjtList}); //테마 목록 리프레시
                    }
                })
                .error(function (resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        } else {
            vm.selectedSbjtSeq = 0;
        }

        vm.updateMode = false; //업데이트 모드 종료
    }

    /**
     * 수정 취소
     */
    vm.cancel = function() {
        vm.updateMode = false;
        vm.selectedSbjtSeq = 0;
    }

    /**
     * 테마 삭제
     * @param sequence 선택한 테마일련번호
     */
    vm.delete = function(sequence) {
        messageBox.open($translate.instant('comm.eMsgConfDel'), { //삭제하겠습니까?
            type:"info",
            confirm : true
        }).result.then(function(confirm) {
            if (!confirm) return; //컨펌하지 않을 경우
            var param = {'sbjtSeq':sequence};
            myDashService.deleteSbjtItem(param)
                .success(function (resp) {
                    if (resp.responseCode === '200') {
                        vm.sbjtList = resp.data;
                        vm.selectedSbjtSeq = 0;

                        $rootScope.$emit('refreshSbjtList', {sbjtList:vm.sbjtList}); //테마 목록 리프레시
                    }
                })
                .error(function (resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        });
    }

    /**
     * [테마추가] 모달 열기
     */
    vm.openModal = function() {
        $scope.sbjtAddModal = true;
        vm.sbjtNm = '';
    }

    /**
     * [테마추가] 모달 닫기
     */
    $scope.closeModal = function() {
        $scope.sbjtAddModal = false;
    }

    /**
     * [테마추가] 수정사항 저장
     * @description 신규 테마를 생성한다.
     */
    vm.saveModal = function() {
        //유효성 검증
        document.getElementById('inputSbjtNm').style.display = 'none';
        if ( typeof vm.sbjtNm == 'undefined' || vm.sbjtNm == '' ) {
            document.getElementById('inputSbjtNm').style.display = 'block';
            return;
        }
        //신규테마 생성
        var param = {'dashbdSeq':$rootScope.dashbdSeq
                   , 'sbjtNm':vm.sbjtNm
                   , 'mbrId':sessionStorage.getItem('mbr_id')
                   , 'mbrSeq':sessionStorage.getItem('mbr_seq')};
        myDashService.insertSbjtItem(param)
            .success(function (resp) {
                if (resp.responseCode === '200') {
                    vm.sbjtList = resp.data;
                    vm.selectedSbjtSeq = 0;
                    $scope.sbjtAddModal = false;

                    $rootScope.$emit('refreshSbjtList', {sbjtList:vm.sbjtList}); //테마 목록 리프레시
                }
            })
            .error(function (resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    /**
     * [테마추가] 모달 닫기
     */
    vm.closeModal = function() {
        $scope.sbjtAddModal = false;
    }
}