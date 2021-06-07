const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const svgSourceFolder = path.join(__dirname, '../../svg');

const directories = [
    "svgsJa", "svgsJaSpecial", "svgsKana",
    "svgsZhHans", "svgsZhHansSpecial", "svgsZhHant"
]

const getSvg = catchAsync(async (req, res) => {
    const svgCode = req.params.svgCode
    const fileName = `${svgCode}.svg`
    let found = false;
    for (let i = 0; i < directories.length; i++) {
        let files = fs.readdirSync(path.join(svgSourceFolder, directories[i]))
        if (files.includes(fileName)) {
            found = { path: '/svg/' + directories[i] + '/' + fileName, subDir: directories[i] }
            break;
        }
    }
    if (found) {
        res.send(found);
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'SVG not found');
    }
});

module.exports = {
    getSvg
};
