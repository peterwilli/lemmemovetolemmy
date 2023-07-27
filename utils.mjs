export const sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const truncate = function(str, length) {
    if (str.length > length) {
        return str.slice(0, length) + '…';
    } else return str;
}