angular.module('app.auth')
    .controller('IdentifyController', IdentifyController);

function IdentifyController($scope, authDataService, $rootScope, $state, jwtHelper, $stateParams, $translate) {
    var vm = this;
    vm.step = $state.params.param;
    vm.userId = '';
    vm.userNm = '';
    vm.userEmailAdr = '';

    //찾기
    vm.find = function(code) {
        if ( code === '0001' ) {
            findId();
        } else {
            findPwd();
        }
    }

    //아이디 찾기
    function findId() {
        var nextStep = true;
        if ( !vm.userNm ) {
            vm.invalidNm = true;
            nextStep = false;
        }
        if ( !vm.userEmailAdr ) {
            vm.invalidEmailAdr = true;
            nextStep = false;
        }

        if ( nextStep ) {
            //아이디 찾기
            var param = 'userNm='+vm.userNm+'&email='+vm.userEmailAdr;
            authDataService.findMbrId(param)
                .success(function(resp) {
                    if ( resp.responseCode === 'OK' ) {
                        var count = resp.data.total;
                        if ( count > 0 ) { //회원정보가 있을 경우
                            var mbrId = resp.data.rows[0].mbrId;
                            var mbrNm = resp.data.rows[0].userNm;
                            vm.findIdReslt = $translate.instant('comm.eMsgFindMbrId',{value1:mbrNm, value2:'<span>'+mbrId+'</span>'});
                            vm.step = 'reslt';
                        } else { //회원정보가 없을 경우
                            vm.findIdReslt = $translate.instant('comm.eMsgNotExistMbrInfo');
                            vm.step = 'fail';
                            vm.beforePageCode = '0001';
                        }
                    }
                })
                .error(function(error){
                    console.log("API Service Error : " + error.status + " " + error.error);
                });
        } else {
            return nextStep;
        }
    }

    //비밀번호 찾기
    function findPwd() {
        var nextStep = true;
        if ( !vm.userId ) {
            vm.invalidId = true;
            nextStep = false;
        }
        if ( !vm.userEmailAdr ) {
            vm.invalidEmailAdr = true;
            nextStep = false;
        }

        if ( nextStep ) {
            var param = {mbrId:vm.userId, email:vm.userEmailAdr};
            authDataService.findMbrInfo(param)
                .success(function (resp) {
                    if ( resp.responseCode === 'OK' ) {
                        var count = resp.data.total;
                        if ( count > 0 ) {
                            param = {mbrId:vm.userId, email:vm.userEmailAdr, langCd:localStorage.getItem('langCd')};
                            authDataService.updateMbrRanPwd(param)
                                .success(function(resp) {
                                    vm.step = 'pwdReslt';
                                })
                                .error(function (resp) {
                                    console.log("API Service Error : " + resp.status + " " + resp.error);
                                });
                        } else { //회원정보가 없을 경우
                            vm.step = 'pwdFail';
                            vm.findPwdReslt = $translate.instant('comm.eMsgNotExistMbrInfo');
                            vm.beforePageCode = '0002';
                        }
                    }
                })
                .error(function (resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        }
    }

    //이전 페이지로
    vm.hstBack = function() {
        if ( vm.beforePageCode === '0001' ) {
            vm.step = 'id';
        } else {
            vm.step = 'pwd';
        }
    }

    //Q&A 게시판으로 이동
    // vm.inqrInfoPage = function() {
    //     window.open('http://iotmakers.kt.com/openp/index.html#/qna', '_blank');
    // }
}