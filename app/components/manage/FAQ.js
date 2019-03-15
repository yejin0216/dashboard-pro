angular.module('app.manage')
    .controller('FAQController', FAQController);

function FAQController($rootScope, $scope) {

    $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

    var vm = this;
    vm.flag = 'member';

    vm.allList = {
        'member':[{
            'pre':'회원정보',
            'title':'회원정보를 변경하고 싶어요.',
            'contents':'Dashboard Pro2는 회원님의 개인정보 보호를 위해 민감한 개인정보를 보관하지 않습니다.<br/>다만, IoTMakers 개방형 포털에서 회원정보를 조회, 변경할 수 있습니다.<br/><br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/login/checkPwd" target="_blank"><i class="fas fa-external-link-alt"></i> 개방형 포털에서 개인정보 변경하기</a>'
        }
        , {
            'pre':'회원정보',
            'title':'회원탈퇴 방법을 알려주세요.',
            'contents':'IoTMakers 개방형 포털에서 회원탈퇴를 신청하실 수 있습니다.<br/>다만, 라이선스 사용기간이 남아있는 회원님께서는 회원탈퇴시 유의해주시기 바랍니다.<br/><br/>' +
            '<a href="http://localhost:8010/#/manage/general" target="_blank"><i class="fas fa-external-link-alt"></i> 라이선스 사용기간 확인하기</a><br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/login/checkPwd" target="_blank"><i class="fas fa-external-link-alt"></i> 개방형 포털에서 회원탈퇴하기</a>'
        }
        , {
            'pre':'회원정보',
            'title':'교육/비즈니스 회원이란 무엇인가요? 가입하려면 어떻게 해야하나요?',
            'contents':'IoTMakers와 Dashboard Pro2는 IoTMakers 라이선스를 통해 교육기관, 정부기관, 일반 사업체에서 IoT 서비스를 사용할 수 있도록 지원합니다. ' +
            'IoTMakers 라이선스를 구입한 회원님께서는 자동으로 교육/비즈니스 회원으로 회원등급이 상향조정됩니다.<br/><br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/license" target="_blank"><i class="fas fa-external-link-alt"></i> IoTMakers 라이선스 알아보기</a>'
        }],
        'license':[{
            'pre':'라이선스'
            , 'title':'IoTMakers 라이선스란 무엇인가요?'
            , 'contents':'IoTMakers 라이선스는 확장된 디바이스, 데이터베이스, Dashboard Pro2 등을 사용하여 효과적인 IoT 서비스를 구성하도록 지원합니다.<br/>' +
            '한정된 기능만 사용할 수 있는 무료회원과 달리 라이선스 회원님께서는 IoTMakers를 통해 니즈에 맞는 IoT 서비스를 구성할 수 있습니다.<br/>' +
            '또, 회원님께서는 별도의 수집 서버, 스토리지 등 IT 환경 구축 없이 KT Cloud를 통하여 편리하게 사용할 수 있습니다.<br/><br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/license" target="_blank"><i class="fas fa-external-link-alt"></i> IoTMakers 라이선스 상세정보 보기</a>'
        }
        , {
            'pre':'라이선스'
            , 'title':'IoTMakers 라이선스의 종류에는 무엇이 있나요?'
            , 'contents':'교육기관에서 교수 학습용으로 사용할 수 있는 교육용 라이선스와 공공기관, 일반 사업체에서 사용할 수 있는 비즈니스 라이선스가 있습니다.<br/>' +
            '각 라이선스마다 니즈에 맞게 구성요소를 변경할 수 있으므로 자세한 사항은 아래 링크를 참고해주세요.<br/><br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/license" target="_blank"><i class="fas fa-external-link-alt"></i> IoTMakers 라이선스 상세정보 보기</a>'
        }
        , {
            'pre':'라이선스'
            , 'title':'IoTMakers 라이선스 가입방법과 비용을 알고 싶어요.'
            , 'contents':'라이선스 가입문의는 대표 이메일이나 개방형 포털 Q&A 게시판으로 문의해주시기 바랍니다.<br/><br/>' +
            '<i class="far fa-envelope"></i> 대표 이메일 :iotmakers@kt.com<br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/qna" target="_blank"><i class="fas fa-external-link-alt"></i> 개방형 포털 Q&A 바로가기</a><br/>'
        }],
        'dashbd':[{
            'pre':'대시보드'
            , 'title':'Dashboard Pro2란 무엇인가요?'
            , 'contents':'IoTMakers 플랫폼에 연동한 IoT 디바이스를 관제할 수 있는 IoT 서비스입니다.<br/>' +
            '다양한 위젯을 배치, Drag&Drop하여 목적에 맞는 서비스 화면을 자유자재로 구성할 수 있으며 PC, Mobile을 통해 언제 어디서나 접속할 수 있습니다.'
        }
        , {
            'pre':'대시보드'
            , 'title':'Dashboard Pro2의 회원가입(사용권한)에 대해 알고 싶어요.'
            , 'contents':'Dashboard Pro2는 IoTMakers 라이선스 회원에 한하여 사용권한을 부여하고 있습니다.<br/>' +
            '라이선스 사용기간 만료회원, 또는 무료회원은 Dashboard Pro2를 사용할 수 없으며, 계정을 양도하거나 공유하여 사용할 수 없습니다.<br/><br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/license" target="_blank"><i class="fas fa-external-link-alt"></i> IoTMakers 라이선스 상세정보 보기</a>'
        }
        , {
            'pre':'대시보드'
            , 'title':'프로필 사진은 어떻게 등록하나요?'
            , 'contents':'Dashboard Pro2 좌측 메뉴 > 관리 > 기본정보 에서 수정할 수 있습니다.'
        }
        , {
            'pre':'대시보드'
            , 'title':'그룹태그란 무엇인가요?'
            , 'contents':'IoT 디바이스의 센서들의 묶음으로 NB-IoT 통신모듈을 사용하는 IoT 디바이스의 필수사항입니다.<br/>' +
            '설정한 그룹태그는 [나의 디바이스]에서 확인할 수 있습니다.<br/><br/>' +
            '<a ui-sref="myDev"><i class="fas fa-external-link-alt"></i> 디바이스의 그룹태그 확인하기</a>'
        }
        , {
            'pre':'대시보드'
            , 'title':'Capability UI Type이란 무엇인가요?'
            , 'contents':'IoT 디바이스의 제어센서의 UI 표현방식을 의미하는 Dashboard Pro2의 용어입니다.<br/>' +
            'Dashboard Pro2의 제어위젯은 TEXT로 제어문을 입력하도록 설정되어있지만 Capability UI Type를 설정하면 BUTTON, SLIDER 등 다양한 UI 방식으로 제어문을 입력하고 실행할 수 있습니다. ' +
            '설정한 Capability UI Type은 모든 제어위젯에 적용됩니다.<br/><br/>' +
            '<a ui-sref="myDev"><i class="fas fa-external-link-alt"></i> 제어센서의 Capability UI Type 변경하기</a>'
        }
        , {
            'pre':'대시보드'
            , 'title':'접속이 느린 경우'
            , 'contents':'먼저 PC, Mobile의 네트워크 환경을 확인해주시기 바랍니다.<br/>' +
            '네트워크 접속이 원활한 경우에는 아래 사항을 체크해보시기 바랍니다.<br/><br/>' +
            ' 원인1) 대시보드 페이지가 실시간 Push 데이터 스트리밍을 사용할 경우<br/>' +
            ' 해결1) 대시보드 페이지 > 데이터 연결 > 데이터 조회 방식으로 변경해주시기 바랍니다.<br/>' +
            ' 원인2) PC, Mobile 사양이 부족할 경우<br/>' +
            ' 해결2) 대시보드 페이지 > 데이터 연결 > 데이터 조회 방식으로 변경해주시기 바랍니다.'
        }
        , {
            'pre':'대시보드'
            , 'title':'화면이 깨지는 경우'
            , 'contents':'Dashboard Pro2는 Chrome 브라우저에 최적화 되어 있습니다.<br/>' +
            'Chrome 브라우저로 접속했음에도 화면이 깨지는 경우 브라우저 캐시 삭제 후 재접속해주시기 바랍니다.<br/><br/>' +
            '※ 브라우저 캐시 삭제 방법<br/>' +
            '브라우저 > 설정 > 고급 > 인터넷 사용 기록 삭제 > [전체기간] 선택 후 [인터넷 사용 기록 삭제] 버튼 클릭 후 재접속'
        }],
        'etcFaq':[{
            'pre':'기타문의'
            , 'title':'IoTMakers란 무엇인가요?'
            , 'contents':'IoTMakers는 IoT Player들이 쉽게 IoT생태계에 참여할 수 있도록 지원하는 KT의 Open IoT 플랫폼입니다.<br/>' +
            'IoTMakers를 통해서 손쉽게 IoT 디바이스를 연결하고 데이터를 수집, 제어하여 나만의 IoT 서비스를 기획하고 구축할 수 있습니다.<br/><br/>' +
            '<a href="http://iotmakers.kt.com/openp/" target="_blank"><i class="fas fa-external-link-alt"></i> IoTMakers 알아보기</a>'
        }
        , {
            'pre':'기타문의'
            , 'title':'IoTMakers, Dashboard Pro2에 문의할 것이 있습니다. 어떻게 하나요?'
            , 'contents':'대표 이메일이나 개방형 포털 Q&A 게시판으로 문의해주시기 바랍니다.<br/><br/>' +
            '<i class="far fa-envelope"></i> 대표 이메일 :iotmakers@kt.com<br/>' +
            '<a href="http://iotmakers.kt.com/openp/index.html#/qna" target="_blank"><i class="fas fa-external-link-alt"></i> 개방형 포털 Q&A 바로가기</a><br/>'
        }]
    };

    //initial
    vm.faqList = vm.allList['member'];

    //키워드 검색
    vm.search = function() {
        $scope.searchText = vm.keyword;
    }

    //아이템 선택
    vm.select = function(flag) {
        vm.faqList = vm.allList[flag];
        vm.flag = flag;
    }

    vm.on = function(flag){
        if ( vm.flag == flag ) {
            return 'on';
        }
    }
}