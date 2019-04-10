angular.module('app.mydash')
    .factory('myDashService',function($http, adminConstant, coreConstant){
        return {
            //로그인사용자 라이선스 조회
            getMbrContInfo : function() {
                return $http.get(adminConstant.contextPathV11+'member/getMbrContInfo?langCd='+localStorage.getItem('langCd'), {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //최종 값 조회getDevWdgtBySbjt
            getLastVal : function(param) {
                return $http.post(adminConstant.contextPathV11+'dev/getLastVal', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //나의 디바이스 목록 조회
            getDeviceList : function() {
                return $http.get(adminConstant.contextPathV11+'dev/getDevList', {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //나의 디바이스 상세 조회
            getDeviceInfo : function(spotDevSeq) {
                return $http.get(adminConstant.contextPathV11+'dev/getDevList?spotDevSeq='+spotDevSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스/센서 목록 조회
            getDevSnsrList : function(wdgtSeq) {
                return $http.get(adminConstant.contextPathV11+'dev/getDevSnsrList?wdgtSeq='+wdgtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스모델별 그룹태그 목록 조회
            getSnsrGroupList : function(devModelSeq) {
                return $http.get(adminConstant.contextPathV11+'dev/getGroupByDevModelList?devModelSeq='+devModelSeq);
            },
            //대시보드 정보 조회
            getDashbdInfo : function() {
                return $http.get(adminConstant.contextPathV11+'dashbd/listDashbd', {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //대시보드 이미지 변경
            updateDashbdImg : function(param) {
                return $http.post(adminConstant.contextPathV11+'dashbd/updateDashbdImg', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //대시보드 복제
            copySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'sbjt/copySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마 목록 조회
            getSbjtList : function() {
                return $http.get(adminConstant.contextPathV11+'sbjt/listSbjt?langCd='+localStorage.getItem('langCd'), {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //신규 테마 생성
            insertSbjtItem : function(param) {
                return $http.post(adminConstant.contextPathV11+'sbjt/insertSbjt', param,{
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마 정보 수정
            updateSbjtItem : function(param) {
                return $http.post(adminConstant.contextPathV11+'sbjt/updateSbjt', param,{
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마 정보 삭제
            deleteSbjtItem : function(param) {
                return $http.post(adminConstant.contextPathV11+'sbjt/deleteSbjt', param,{
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마별 위젯 설정(넓이/높이/순서/이름/옵션) 수정
            updateWdgtSettingBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/updateWdgtSettingBySbjt', param,{
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //위젯 템플릿 조회
            getWdgtTmplt : function() {
                return $http.get(adminConstant.contextPathV11+'wdgt/listWdgtTmplt',{
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마별 위젯 조회
            getWdgtListBySbjt : function(sbjtSeq) {
                return $http.get(adminConstant.contextPathV11+'wdgt/listWdgtBySbjt/'+sbjtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마별 위젯 상세 조회
            getWdgtBySbjt : function(wdgt) {
                return $http.get(adminConstant.contextPathV11+'wdgt/selectWdgtBySbjt/'+wdgt.sbjtSeq+'/'+wdgt.wdgtSeq+'/'+wdgt.sorcCtgTypeCd+'/'+wdgt.compCtgTypeCd, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마별 위젯 신규 등록
            insertWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/insertWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스 위젯 상세조회
            getDevWdgtBySbjt : function(wdgt) {
                return $http.get(adminConstant.contextPathV11+'wdgt/getDevWdgtBySbjt/'+wdgt.sbjtSeq+'/'+wdgt.wdgtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스 위젯 신규 등록
            insertDevWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/insertDevWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스/센서 위젯 상세조회
            getDevSnsrWdgtBySbjt : function(wdgt) {
                return $http.get(adminConstant.contextPathV11+'wdgt/getDevSnsrWdgtBySbjt/'+wdgt.sbjtSeq+'/'+wdgt.wdgtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스/센서 위젯 신규 등록
            insertDevSnsrWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/insertDevSnsrWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //지도 위젯 상세조회
            getComplexMapWdgtBySbjt : function(wdgt) {
                return $http.get(adminConstant.contextPathV11+'wdgt/getComplexMapWdgtBySbjt/'+wdgt.viewType+'/'+wdgt.sbjtSeq+'/'+wdgt.wdgtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //지도 신규 등록
            insertComplexMapWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/insertComplexMapWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //지도 자산정보 수정
            updateComplexMapAsset : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/updateComplexMapAsset', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //지도 자산정보 조회
            selectComplexMapAsset : function(param) {
                return $http.get(adminConstant.contextPathV11+'wdgt/getComplexMapAsset/'+param.sbjtSeq+'/'+param.wdgtSeq+'/'+param.spotDevSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //테마별 위젯 삭제
            deleteWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/deleteWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },

            //디바이스/센서 위젯 수정
            updateDevSnsrWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/updateDevSnsrWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //디바이스/센서 위젯 아이콘 수정
            updateDevSnsrIcon : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/updateDevSnsrIcon', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //이벤트 목록 조회
            getEventWdgtBySbjt : function(wdgt) {
                return $http.get(adminConstant.contextPathV11+'wdgt/getEventWdgtBySbjt/'+wdgt.sbjtSeq+'/'+wdgt.wdgtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //복합 이미지 목록 조회
            getComplexImageWdgtBySbjt : function(wdgt) {
                return $http.get(adminConstant.contextPathV11+'wdgt/getComplexImageWdgtBySbjt/'+wdgt.sbjtSeq+'/'+wdgt.wdgtSeq, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //이벤트 위젯 신규 등록
            insertEventWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/insertEventWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            //이미지 위젯 신규 등록
            insertComplexImageWdgtBySbjt : function(param) {
                return $http.post(adminConstant.contextPathV11+'wdgt/insertComplexImageWdgtBySbjt', param, {
                    headers:{'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },

            //kt gis reverse geocode 조회
            getRoadAddress : function(param) {
                return $http.get('https://gis.kt.com/search/v1.0/utilities/geocode?'+param, {
                    headers:{'Authorization': 'Bearer 338251553db8897a3eaaa89b045716c076f7a19cc3a1c5b04d61673542b05d71888b1cbc'}
                });
            },
            getCdDtlList : function (groupCode){
                return $http.get(adminConstant.contextPathV11 + 'codes?groupCode='+groupCode +'&useYn=Y&lang='+localStorage.getItem('langCd'), {
                    headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')}
                });
            },
            getDeviceListV1 : function(){
                return $http.get(adminConstant.contextPathV1 + 'intn/devices?pageNum=1&pageCon=100&lang='+localStorage.getItem('langCd'));
            },
            getDeviceImg : function(atcFileId){
                return $http.get(adminConstant.contextPathV1 + 'devices/' + encodeURIComponent(atcFileId) +'/imageBase64');
            },
            getDevLogs : function(param){
                return $http.get(adminConstant.contextPathV11 + 'logs?type=0001'+ param );
            },
            putCtrlLogs : function(param){
                return $http.put(adminConstant.contextPathV11 + 'devices/'+param.sequence+'/sensingTags?targetSequence=' + param.targetSequence, param);
            },

            /* Model */
            getDeviceModel : function(sequence){
                return $http.get(adminConstant.contextPathV11 + 'models/' + sequence);
            },
            updateDeviceModel : function(sequence, param){
                return $http.put(adminConstant.contextPathV11 + 'models/' + sequence, param);
            },
            /* Event */
            getEventList : function(){
                return $http.get(coreConstant.contextPathV1 + 'event/eventList?pageNum=1&pageCon=100');
            },
            /* Event */
            getEventCount : function(param){
                return $http.get(coreConstant.corePath + 'eventLogs/eventCount?offset=1&limit=100&returnAll=true'+param);
            },
            getEventLogByRuleSeq : function(eplSeq, lastTime){
                return $http.get(coreConstant.contextPathV1 + 'event/logByRuleSeq/' + eplSeq + '/' + lastTime);
            },
            getEventEditorData : function(eplSeq){
                return $http.get(coreConstant.contextPathV1 + 'event/editorData/' + eplSeq);
            },
            updateEventStatus:function(eplSeq,status){
                return $http.get(coreConstant.contextPathV1+'event/'+eplSeq+'/'+status);
}
        };
    });