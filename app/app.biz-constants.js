angular.module('app')
/**
 * 비즈 API URL
 * */
    .constant("adminConstant", {
        "authPath"         : "http://112.175.172.105:8080",
        "portalPath"       : "http://112.175.172.105:8080/portalapi/v1/",
        "contextPathV1"    : "http://112.175.172.105:8080/api/v1/",
        "contextPathV11"   : "http://112.175.172.105:8080/api/v1.1/"
    })
    .constant("coreConstant", {
        "corePath": "http://112.175.172.105:8080/coreapi/v1.1/",
        "contextPathV1": "http://112.175.172.105:8080/api/v1/",
        "contextPathV11": "http://112.175.172.105:8080/api/v1.1/"
    })
    // .constant("adminConstant", {
    //     "authPath"         : "https://bizservice.iotmakers.kt.com:443",
    //     "portalPath"       : "https://bizservice.iotmakers.kt.com:443/portalapi/v1/",
    //     "contextPathV1"    : "https://bizservice.iotmakers.kt.com:443/api/v1/",
    //     "contextPathV11"   : "https://bizservice.iotmakers.kt.com:443/api/v1.1/"
    // })
    // .constant("coreConstant", {
    //     "corePath"         : "https://bizservice.iotmakers.kt.com:443/coreapi/v1.1/",
    //     "contextPathV1"    : "https://bizservice.iotmakers.kt.com:443/api/v1/",
    //     "contextPathV11"   : "https://bizservice.iotmakers.kt.com:443/api/v1.1/"
    // })
    .constant('messageType', {
        warning  : "warning",
        normal   : undefined,
        info     : "info",
        success  : "success"
    });