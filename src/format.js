const masks = {
    'default': 'ddd MMM dd yyyy HH:mm:ss'
}

/**
 * d{1,4}        匹配1-4个字母d  天
 * M{1,4}        匹配1-4个字母M  月
 * yy(?:yy)?     匹配2或4个字母y  年
 * S{1,3}        匹配1-3个字母S
 * Do            匹配Do
 * ZZ            匹配ZZ
 * ([HhMsDm])\1? 匹配HH、hh、MM、ss、DD、mm
 * [aA]          匹配a或A
 * "[^"]*"       匹配双引号
 * '[^']*'       匹配单引号
 */
const token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;

// 匹配两位数 00-99
const twoDigits = /\d\d?/;
// 匹配三位数
const threeDigits = /\d{3}/;
// 匹配四位数
const fourDigits = /\d{4}/;
//
const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

//声明一个空函数
const noop = function() {};
// 批量截取指定长度的字符串
function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
}

function monthUpdate(arrName) {
    return function(d, v, i18n) {
        var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
        if (~index) {
            d.month = index;
        }
    };
}

// 填充0
function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
        val = '0' + val;
    }
    return val;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthNamesShort = shorten(monthNames, 3);
const dayNamesShort = shorten(dayNames, 3);
const i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
        return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
}

const formatFlags = {
    D: function(dateObj) {
        return dateObj.getDay();
    },
    DD: function(dateObj) {
        return pad(dateObj.getDay());
    },
    Do: function(dateObj, i18n) {
        return i18n.DoFn(dateObj.getDate());
    },
    d: function(dateObj) {
        return dateObj.getDate();
    },
    dd: function(dateObj) {
        return pad(dateObj.getDate());
    },
    ddd: function(dateObj, i18n) {
        return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function(dateObj, i18n) {
        return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
        return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
        return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
        return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
        return i18n.monthNames[dateObj.getMonth()];
    },
    yy: function(dateObj) {
        return String(dateObj.getFullYear()).substr(2);
    },
    yyyy: function(dateObj) {
        return dateObj.getFullYear();
    },
    h: function(dateObj) {
        return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
        return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
        return dateObj.getHours();
    },
    HH: function(dateObj) {
        return pad(dateObj.getHours());
    },
    m: function(dateObj) {
        return dateObj.getMinutes();
    },
    mm: function(dateObj) {
        return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
        return dateObj.getSeconds();
    },
    ss: function(dateObj) {
        return pad(dateObj.getSeconds());
    },
    S: function(dateObj) {
        return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function(dateObj) {
        return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function(dateObj) {
        return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function(dateObj) {
        var o = dateObj.getTimezoneOffset();
        return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
};

const parseFlags = {
    d: [twoDigits, function(d, v) {
        d.day = v;
    }],
    M: [twoDigits, function(d, v) {
        d.month = v - 1;
    }],
    yy: [twoDigits, function(d, v) {
        var da = new Date(),
            cent = +('' + da.getFullYear()).substr(0, 2);
        d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function(d, v) {
        d.hour = v;
    }],
    m: [twoDigits, function(d, v) {
        d.minute = v;
    }],
    s: [twoDigits, function(d, v) {
        d.second = v;
    }],
    yyyy: [fourDigits, function(d, v) {
        d.year = v;
    }],
    S: [/\d/, function(d, v) {
        d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function(d, v) {
        d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function(d, v) {
        d.millisecond = v;
    }],
    D: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function(d, v, i18n) {
        var val = v.toLowerCase();
        if (val === i18n.amPm[0]) {
            d.isPm = false;
        } else if (val === i18n.amPm[1]) {
            d.isPm = true;
        }
    }],
    ZZ: [/[\+\-]\d\d:?\d\d/, function(d, v) {
        var parts = (v + '').match(/([\+\-]|\d\d)/gi),
            minutes;

        if (parts) {
            minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
            d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
        }
    }]
};
parseFlags.DD = parseFlags.DD;
parseFlags.dddd = parseFlags.ddd;
parseFlags.Do = parseFlags.dd = parseFlags.d;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.MM = parseFlags.M;
parseFlags.ss = parseFlags.s;
parseFlags.A = parseFlags.a;



/**
 *
 *
 * @param {Date|Number} dateObj
 * @param {String} mask Format of the date, i.e. 'mm-dd-yy'
 * @returns
 */
function format(dateObj, mask) {
    if (typeof dateObj === 'number') {
        dateObj = new Date(dateObj);
    }

    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
        throw new Error('Invalid Date in fecha.format');
    }

    mask = mask || masks['default'];


    // 格式化 $0是匹配的格式化字符，如yyyy
    return mask.replace(token, function($0) {
        return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
}


/**
 *
 *
 * @param {String} dateStr
 * @param {String} format
 * @returns
 */
function parse(dateStr, format) {
    if (typeof format !== 'string') {
        throw new Error('Invalid format in parse');
    }
    format = masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
        return false;
    }

    let isValid = true;
    let dateInfo = {};
    format.replace(token, function($0) {
        if (parseFlags[$0]) {
            let info = parseFlags[$0];
            let index = dateStr.search(info[0]);
            /**
             * ~-1 === 0
             * !~-1 === !0 === true
             * -1 => isValid = false;
             */
            if (!~index) {
                isValid = false;
            } else {
                dateStr.replace(info[0], function(result) {
                    info[1](dateInfo, result, i18n);
                    dateStr = dateStr.substr(index + result.length);
                    return result;
                });
            }
        }

        return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
        return false;
    }

    let today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
    }

    let date;
    if (dateInfo.timezoneOffset != null) {
        dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
        date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
            dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
        date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
            dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
}

module.exports = {
    format,
    parse
};