function random(len = 10) {
    var sequence = 'abcdefghijklmnoqrstuvwxyz1234567890', returnString = '', i;
    for (i = 0; i < len; i += 1) {
        returnString += sequence.charAt(Math.floor(Math.random() * sequence.length));
    }
    return returnString;
}

export default random