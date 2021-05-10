const fs = require('fs');
const path = require('path')

const deleteFile = filePath => {
    if(filePath) {
        fs.unlink(path.join(__dirname, '..', filePath), error => {
            if(error) console.log(error);
        });
    }
}

exports.deleteFile = deleteFile;