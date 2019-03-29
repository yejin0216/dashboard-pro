angular.module('app.mydash')
    .controller('DashboardNoticeController', DashboardNoticeController);

function DashboardNoticeController($rootScope, $scope) {

    var vm = this;
    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

    vm.list = [{ 'title':'New Releases',
                 'contents':'IoTMakers Dashboard Pro2가 새롭게 오픈했습니다.<br>기존 대시보드의 장점은 살리고 사용자 중심으로 재편성된 새로운 대시보드를 만나보세요!<br>'+
                            '기존 대시보드 사용자의 이용정보는 그대로 승계되었으나 삭제된 위젯 종류의 경우 더 이상 지원되지 않음을 양해 부탁드립니다.<br><br>'+
                            '<p class="description">※ (참고)위젯 신구 대조표</p><br>'+
                            '<div class="table-type01"><table><thead><tr><th>기존 위젯</th><th>신규 위젯</th></tr></thead>'+
                            '<tbody>'+
                            '<tr><td>디바이스 현황</td><td>디바이스 목록, 디바이스 이미지</td></tr>' +
                            '<tr><td>디바이스 등록 위치(지도)</td><td>디바이스 지도</td></tr>' +
                            '<tr><td>디바이스 실시간 경로(지도)</td><td>복합 지도</td></tr>' +
                            '<tr><td>센서 모니터링/제어</td><td>센서 이미지</td></tr>' +
                            '<tr><td>센서 모니터링/제어(리스트)</td><td>센서 목록</td></tr>' +
                            '<tr><td>센서 수집 이력</td><td>센서 로그(목록)</td></tr>' +
                            '<tr><td class="color-gray2"><strike>센서 그룹 제어</strike></td><td></td></tr>' +
                            '<tr><td class="color-gray2"><strike>센서 모니터링(도면)</strike></td><td></td></tr>' +
                            '<tr><td class="color-gray2"><strike>센서 등록 위치(지도)</strike></td><td></td></tr>' +
                            '<tr><td>실시간 센서 게이지차트</td><td>센서 차트(게이지형)</td></tr>' +
                            '<tr><td>실시간 센서 라인차트</td><td>센서 차트(꺽은선형)</td></tr>' +
                            '<tr><td>기간검색 센서 라인차트</td><td>센서 로그(차트)</td></tr>' +
                            '<tr><td>실시간 센서 막대차트</td><td>센서 차트(막대형)</td></tr>' +
                            '<tr><td>이벤트 현황 리스트</td><td>이벤트 목록</td></tr>' +
                            '<tr><td>이벤트 타임라인 이력</td><td></td></tr>' +
                            '<tr><td>타이틀 박스</td><td>복합 이미지</td></tr>' +
                            '<tr><td></td><td>센서차트(분산형)</td></tr>' +
                            '<tr><td></td><td>센서차트(방사형)</td></tr>' +
                            '</tbody></table></div><br>'+
                            '<h5>2019/04/01</h5>'
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