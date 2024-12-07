const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;

const socket = require('#src/index.js'); //import socket  from src/index.js
const File = require('#Constants/File.js');
const General = require('#Constants/General.js');

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

// AWS s3 bucket credantial
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const BUCKET = 'hasbisoft';

async function googleTranslate(text, target = 'ru') {
  const [translation] = await translate.translate(text, target);
  return translation;
}

async function generateMultipleLanguages(text) {
  let languages = ['en', 'it'];
  let resultObj = { local: text };
  return resultObj;
  // language translater disabled because of key issue
  for (let i = 0; i < languages.length; i++) {
    resultObj[languages[i]] = await googleTranslate(text, languages[i]);
  }

  return resultObj;
}

async function bcryptPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function comparePassword(actual_password, encrypted_password) {
  return await bcrypt.compare(actual_password, encrypted_password);
}

function escapeLike(string) {
  return string
    .replace('#', '\\#')
    .replace('$', '\\$')
    .replace('%', '\\%')
    .replace('+', '\\+')
    .replace('_', '\\_');
}

function makeRegex(searchValue) {
  searchValue = escapeLike(searchValue);
  return new RegExp(searchValue, 'i');
}

function isValueSet(value) {
  return !(value == '' || value == null || value == undefined);
}

function isValueNotSet(value) {
  return value == '' || value == null || value == undefined;
}

function getPageSize() {
  return 10;
}

function getSkipCount(pageNo, pageSize) {
  return (pageNo - 1) * pageSize;
}

function checkPageLowerLimit(pageNo) {
  return pageNo < 1 ? 1 : pageNo;
}

function getPaginationDetails(pageNo) {
  return {
    pageNo: checkPageLowerLimit(pageNo),
    pageSize: getPageSize(),
    skip: getSkipCount(pageNo, getPageSize()),
  };
}

function makePaginationObject(pageNo, pageSize, skip, total, currentPageRecords) {
  return {
    currentPage: pageNo,
    pageSize: pageSize,
    from: skip == 0 ? 1 : skip + 1,
    to: currentPageRecords + (pageNo == 1 ? 0 : (pageNo - 1) * pageSize),
    total: total,
  };
}

function makeImagePath(dir, name) {
  return `${dir}/${name}`;
}

async function makeMultipleImagePath(dir, req) {
  const name = req.files;
  const { userId } = req.user;
  const files = [];

  await Promise.all(name.map(async ({ filename, path }) => {
    let keyName = `restaurants/${userId}/deals/${filename}`;
    const aws_image = await AWSBucketUploadImage(path, keyName);
    files.push(aws_image.Location);
  }));

  req.body.attachments &&
    req.body.attachments.map((filename) => {
      files.push(`${filename}`);
    });

  return files;
}

function makeFilePath(dir, name) {
  return `${dir}/${name}`;
}

function fourDigitRandomNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

function passwordGenerator() {
  return 'AK' + Math.floor(Math.random() * (999999 - 111111) + 111111) + 'roda$';
}

async function randomPasswordMaker(password) {
  return await bcryptPassword(password);
}

function genertatePasswordSetLink(id, token) {
  return `${process.env.FRONT_APP_URL}/set-password/${id}/${token}`;
}

function genertateProjectPageLink(projectId) {
  return `${process.env.FRONT_APP_URL}/projects?projectId=${projectId}`;
}

function genertateTasksPageLink(projectId) {
  return `${process.env.FRONT_APP_URL}/tasks`;
}

function genertateProjectViewPageLink(projectId) {
  return `${process.env.FRONT_APP_URL}/project/${projectId}`;
}

function getDateRange(filter, startDate, endDate) {
  let SD, ED;

  if (filter == General.FILTER_WEEK) {
    SD = moment().startOf('week');
    ED = moment().endOf('week');
  } else if (filter == General.FILTER_MONTH) {
    SD = moment().startOf('month');
    ED = moment().endOf('month');
  } else if (filter == General.FILTER_CUSTOM) {
    SD = moment(startDate).startOf('day');
    ED = moment(endDate).startOf('day');
  }
  return { SD, ED };
}

function randomId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Highr order function to trace/catch an error
const use = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ===========  Profile Upload ============
const uploadHelper = (dir, req) => {
  try {
    const dirPath = `./Uploads/${dir}`;
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    } catch (err) {
      console.error(err);
    }

    return multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, `./Uploads/${dir}`);
        },
        filename: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          const time = new Date().getTime();
          const imgPath = `file${time}${ext}`;
          req.imageName = imgPath;
          // const imgPath = file.originalname;
          cb(null, imgPath);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * process.env.FILE_SIZE_LIMIT, // 1mb * N = N mb
      },
      fileFilter: (req, file, cb) => {
        // reject a file
        if (
          file.mimetype === File.JPEG ||
          file.mimetype === File.JPG ||
          file.mimetype === File.PNG
        ) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    });
  } catch (error) {
    throw error;
  }
};

// ============ Delete File   =============
const deleteFileHelper = (dir) => {
  const path = `./Uploads/${dir}`;
  fs.unlink(path, (err) => {
    if (err) console.log(err);
    else console.log(path, 'File Deleted successfully.');
  });
};

const deleteMultipleFileHelper = (dir, req) => {
  const files = req.body;
  dir.map(async (location) => {
    // const path = `./Uploads/${location}`;
    const fileExist = files?.attachments?.find((name) => name === location);
    !fileExist && await AWSBucketDeleteImage(location)
    // fs.unlink(path, (err) => {
    //   if (err) console.log(err);
    //   else console.log(path, 'File Deleted successfully.');
    // });
  });
};

// ============ Emit Socket   =============
const socketEmit = (method, ids, payload) => {
  ids.forEach((id) => {
    socket.io.to(id).emit(method, payload);
  });
};

// ============ Frontend App URL   =============
function getFrontAppUrl() {
  return process.env.MODE == 'DEV' ? process.env.FRONT_APP_URL_DEV : process.env.FRONT_APP_URL_PRO;
}

// ============ Backend App URL   =============
function getBackAppUrl() {
  return process.env.MODE == 'DEV' ? process.env.BACK_APP_URL_DEV : process.env.BACK_APP_URL_PRO;
}

const AWSBucketUploadImage = async (filePath, keyName) => {
  const file = fs.readFileSync(filePath);

  return await new Promise((resolve, reject) => {
    try {

      const uploadParams = {
        Bucket: BUCKET,
        Key: keyName,
        Body: file,
        ACL: 'public-read',
        ContentType: 'image/jpeg'
      };

      s3.upload(uploadParams, function (err, data) {
        if (err) {
          return reject(err);
        }
        if (data) {
          return resolve(data);
        }
      });
    } catch (err) {
      return reject(err);
    }
  })
}

const AWSBucketDeleteImage = async (oldFileUrl) => {
  let filePathKey;
  if (isValidUrl(oldFileUrl)) {
    // If it's a valid URL, extract the key
    const urlObj = new URL(oldFileUrl);
    filePathKey = urlObj.pathname.substring(1);
  } else {
    // If it's not a valid URL, assume it's a file path and handle accordingly
    filePathKey = oldFileUrl;
  }

  try {
    // Check if the file exists
    await s3.headObject({ Bucket: BUCKET, Key: filePathKey }).promise();

    // If it exists, delete the file
    await s3.deleteObject({ Bucket: BUCKET, Key: filePathKey }).promise();
    console.log("File deleted successfully.");

  } catch (err) {
    if (err.code === 'NotFound') {
      console.log("File does not exist.");
    } else {
      console.log("Error:", err.message);
    }
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  use,
  randomId,
  bcryptPassword,
  getPageSize,
  getSkipCount,
  checkPageLowerLimit,
  makePaginationObject,
  getPaginationDetails,
  getFrontAppUrl,
  getBackAppUrl,
  escapeLike,
  makeImagePath,
  isValueSet,
  passwordGenerator,
  comparePassword,
  makeFilePath,
  getDateRange,
  makeRegex,
  randomPasswordMaker,
  genertatePasswordSetLink,
  genertateProjectPageLink,
  genertateTasksPageLink,
  genertateProjectViewPageLink,
  googleTranslate,
  generateMultipleLanguages,
  uploadHelper,
  deleteFileHelper,
  socketEmit,
  makeMultipleImagePath,
  deleteMultipleFileHelper,
  AWSBucketUploadImage,
  AWSBucketDeleteImage,
};
