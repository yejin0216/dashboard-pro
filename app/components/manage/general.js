manage.controller('GeneralController',
    function($scope, $modal, $log, $rootScope, $state, $stateParams, $http, $translate, adminConstant, myDashService) {

        $rootScope.$emit('showDashbdSttus', false); //상단 바 출력

        var vm = this;
        vm.profileFile = './assets/images/svg/user.svg';
        vm.langList = [{'code':'KOR','name':'한국어'},
                       {'code':'ENG','name':'English'}];
        vm.selectedLang = localStorage.getItem('langCd') || 'KOR';

        /**
         * 사용자 계정정보, 라이선스정보 세팅
         */
        function init() {
            //Profile 사진
            myDashService.getDashbdInfo('0001')
                .success(function(resp){
                    if ( resp.responseCode === '200' ) {
                        var rows = resp.data.rows[0];
                        vm.profileFile = rows.profileImgFilePath ? rows.profileImgFilePath : vm.profileFile; //프로필이미지 BASE64
                    }
                });

            //정보보안단 권고사항, 사용자계정 Masking 처리
            var tempUserNm = sessionStorage.getItem('dash_mbr_id');
            vm.userNm = tempUserNm.substr(0,tempUserNm.length-1)+'*';
            tempUserNm = null; //사용자 아이디

            //라이선스 정보 조회
            myDashService.getMbrContInfo()
                .success(function(resp){
                    if ( resp.responseCode === '200' && resp.data ) {
                        vm.lcnsInfo = resp.data[0];
                        var auth = JSON.parse(resp.data[0].bizContSvcTypeCd);
                        var authVals = Object.values(auth);
                        var authKeys = Object.keys(auth);
                        for ( var i=0, iCount=authVals.length; i<iCount; i++ ) {
                            if ( authVals[i] === 'N' ) {
                                authKeys.splice(i, 1);
                            }
                        }
                        vm.lcnsInfo.bizContSvcTypeCd = authKeys;
                    }
                });
        }

        //언어 설정 적용
        vm.aplyLang = function() {
            var langCd = vm.selectedLang;
            localStorage.setItem('langCd', langCd);
            $translate.use(langCd);
        }

        //프로필 이미지 삭제
        vm.deleteProfileFile = function() {
            vm.profileFile = './assets/images/svg/user.svg';
            saveImage("", "");
        }

        //프로필 이미지 업로드
        vm.uploadProfileFile = function(file, errFiles) {
            //convert to base64
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (e) {
                var imageUrl = e.target.result;
                saveImage(file.name, imageUrl);
            };
            fileReader = null;
        }


        //선택한 이미지 저장
        function saveImage(imageName, imageUrl) {
            var param = {
                'profileImgFilePath':imageUrl,
                'profileImgFileNm':imageName,
                'dashbdSeq':$rootScope.dashbdSeq,
                'mbrId':sessionStorage.getItem("dash_mbr_id"),
                'mbrSeq':sessionStorage.getItem("dash_mbr_seq")
            };
            myDashService.updateDashbdImg(param)
                .success(function(resp) {
                    if (resp.responseCode === '200') {
                        vm.profileFile = imageUrl||vm.profileFile;
                        $rootScope.$emit('changeUserImg', {profileImgFilePath:vm.profileFile}); //사용자 프로필 이미지 변경
                    }
                })
                .error(function(resp) {
                    console.log("API Service Error : " + resp.status + " " + resp.error);
                });
        }

        init();

    });