export function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true;
    }
    else {
        return false;
    }
}

export function isArray(obj) {
    return Array.isArray(obj);
}
