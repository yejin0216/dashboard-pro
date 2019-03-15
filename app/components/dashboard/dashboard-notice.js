angular.module('app.mydash')
    .controller('DashboardNoticeController', DashboardNoticeController);

function DashboardNoticeController($rootScope, $scope) {

    var vm = this;
    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

    vm.list = [{ 'title':'Dashboard Pro2 신규 오픈!',
                 'contents':'Dashboard Pro2가 신규 오픈했습니다.<br/>대시보드와 위젯을 마음껏 커스터마이징해서 나만의 IoT 서비스를 만들어보세요.<br/>메뉴에서 [이용 가이드]를 클릭해서 더 자세히 알아보세요.<br/><h5>2019/04/01</h5>'
               }];

    //키워드 검색
    vm.search = function() {
        $scope.searchText = vm.keyword;
    }

    //컨텐츠 영역 스타일
    vm.collapse = function(index){
        if ( index == 0 ) {
            return 'panel-collapse';
        }
        return 'panel-collapse collapse';
    }

}