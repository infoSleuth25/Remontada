const fileFormat = (url="") => {
    const fileExtension = url.split('.').pop();
    if(fileExtension === 'mp4' || fileExtension === 'webm' || fileExtension === 'ogg'){
        return "video";
    }
    else if(fileExtension === 'mp3' || fileExtension === 'wav'){
        return "audio";
    }
    else if(fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'gif'){
        return "image";
    }
    return "file";
};

const transformImage = (url="",width=100) =>{
    return url;
}


export {fileFormat, transformImage};