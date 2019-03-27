angular.module('app.mydash')
    .controller('BookmarkController', BookmarkController)

function BookmarkController($scope, $translate, $rootScope, $state, messageBox, myDashService) {

    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

    var vm = this;
    vm.bmarkList = [];
    vm.selectedSbjtSeq = '';

    /**
     * 테마 목록 조회
     */
    function init() {
        //테마 목록 조회
        myDashService.getSbjtList()
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    var result = resp.data;
                    if ( result.total > 0 ) {
                        vm.bmarkList = result.rows.filter(function(item) {return item.bmarkYn === 'Y';});
                        vm.notBmarkList = result.rows.filter(function(item) {return item.bmarkYn === 'N';});
                    }
                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    /**
     * 선택한 테마로 이동
     * @param sequence 선택한 테마일련번호
     */
    vm.move = function(sequence) {
        $rootScope.$emit('moveDashbd', {sequence:sequence});
        //$state.go('mydashboard', {sequence:sequence}); //대시보드로 이동
    }

    /**
     * 즐겨찾기 목록 추가
     */
    vm.addBMarkDashbd = function() {
        //유효성 검증
        if ( !vm.selectedSbjtSeq ) {
            //즐겨찾기 추가할 대시보드를 선택해주십시오.
            messageBox.open($translate.instant('dash.eMsgSelectBmark'), {
                type: "info"
            });
            return;
        }
        //테마 수정
        var param = {'sbjtSeq':vm.selectedSbjtSeq
                   , 'bmarkYn':'Y'
                   , 'mbrId':sessionStorage.getItem('mbr_id')
                   , 'mbrSeq':sessionStorage.getItem('mbr_seq')};
        myDashService.updateSbjtItem(param)
            .success(function(resp){
                if ( resp.responseCode === '200' ) {
                    var result = resp.data;
                    vm.bmarkList = result.filter(function(item) {return item.bmarkYn === 'Y';});
                    vm.notBmarkList = result.filter(function(item) {return item.bmarkYn === 'N';});
                    $rootScope.$emit('refreshSbjtList', {sbjtList:result}); //테마 목록 리프레시
                }
            })
            .error(function(resp) {
                console.log("API Service Error : " + resp.status + " " + resp.error);
            });
    }

    init();

}