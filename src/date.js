const options = {};
const token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
const twoDigits = /\d\d?/;
const threeDigits = /\d{3}/;
const fourDigits = /\d{4}/;

const word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

const noop = function() {};

const shorten = function(arr, sLen) {
    const newArr = [];
    for (let i = 0, len = arr.length; i < len; i++) {
        newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
}

function monthUpdate(arrName) {
    return function(d, v, i18n) {
        const index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toUpperCase());
        if (~index) {
            d.month = index;
        }
    }
}

function pad(val, len = 2) {
    val = String(val);
    while (val.length < len) {
        val = '0' + val;
    }
    return val;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Devember'];
const shortMonthNames = shorten(monthNames, 3);
const shortDayNames = shorten(dayNames, 3);

options.i18n = {
    shortDayNames,
    dayNames,
    shortMonthNames,
    monthNames,
    amPm: ['am', 'pm'],
    DoFn: function(D) {
        return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
}

// date 为Date对象
const formatFlags = {
    // 星期几
    D: function(date) {
        return date.getDay();
    },
    DD: function(date) {
        return pad(date.getDay());
    },
    // 获取日期：1st, 2nd
    Do: function(date, i18n) {
        return i18n.DoFn(date.getDate());
    },
    d: function(date) {
        return date.getDate();
    },
    dd: function(date) {
        return pad(date.getDate());
    }
}