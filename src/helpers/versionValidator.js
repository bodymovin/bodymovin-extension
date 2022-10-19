function checkVersion(minimum,animVersionString){
    var animVersion = animVersionString ? animVersionString.split('.') : [100,100,100];
    if(minimum[0]>animVersion[0]){
        return false;
    } else if(animVersion[0] > minimum[0]){
        return true;
    }
    if(minimum[1]>animVersion[1]){
        return false;
    } else if(animVersion[1] > minimum[1]){
        return true;
    }
    if(minimum[2]>animVersion[2]){
        return false;
    } else if(animVersion[2] > minimum[2]){
        return true;
    }
}

export default checkVersion