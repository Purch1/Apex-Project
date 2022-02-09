"use strict"

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const STORAGE_BUCKET_NAME = process.env.STORAGE_BUCKET_NAME? process.env.STORAGE_BUCKET_NAME : "";
const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT? process.env.STORAGE_ENDPOINT : "";
const STORAGE_KEY_ID = process.env.STORAGE_KEY_ID? process.env.STORAGE_KEY_ID : "";
const STORAGE_KEY_SECRET = process.env.STORAGE_KEY_SECRET? process.env.STORAGE_KEY_SECRET : "";

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(STORAGE_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: STORAGE_KEY_ID,
    secretAccessKey: STORAGE_KEY_SECRET
});

/**
 * return spaces storage file url
 */

const uploadFile = multer({
    storage: multerS3({
        s3,
        bucket: STORAGE_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            console.log(file);
            console.log('file name', file.originalname);    
            cb(null, `${req.user.currentUser.email+'-'}${file.originalname}`);
        }
    })
}).array("file", 1);

module.exports = uploadFile;