angular.module('app')
/**
 * 비즈 API URL
 * */
    .constant("adminConstant", {
        "authPath"         : "https://bizservice.iotmakers.kt.com:443",
        "portalPath"       : "https://bizservice.iotmakers.kt.com:443/portalapi/v1/",
        "contextPathV1"    : "https://bizservice.iotmakers.kt.com:443/api/v1/",
        "contextPathV11"   : "https://bizservice.iotmakers.kt.com:443/api/v1.1/"
    })
    .constant("coreConstant", {
        "corePath"         : "https://bizservice.iotmakers.kt.com:443/coreapi/v1.1/",
        "contextPathV1"    : "https://bizservice.iotmakers.kt.com:443/api/v1/",
        "contextPathV11"   : "https://bizservice.iotmakers.kt.com:443/api/v1.1/"
    })
    .constant('messageType', {
        warning  : "warning",
        normal   : undefined,
        info     : "info",
        success  : "success"
    });
