angular.module('app')
/**
 * 개방형 API URL
 * */
    .constant("adminConstant", {
        "authPath"         : "https://iotmakers.kt.com",
        "portalPath"       : "https://iotmakers.kt.com/portalapi/v1/",
        "contextPathV1"    : "https://iotmakers.kt.com/api/v1/",
        "contextPathV11"   : "https://iotmakers.kt.com/api/v1.1/"
    })
    .constant("coreConstant", {
        "corePath"         : "https://iotmakers.kt.com/coreapi/v1.1/",
        "contextPathV1"    : "https://iotmakers.kt.com/api/v1/",
        "contextPathV11"   : "https://iotmakers.kt.com/api/v1.1/"
    })
    .constant('messageType', {
        warning  : "warning",
        normal   : undefined,
        info     : "info",
        success  : "success"
    });
