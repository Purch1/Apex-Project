"use strict"

const aws = require('aws-sdk');


const STORAGE_KEY_ID = process.env.STORAGE_KEY_ID? process.env.STORAGE_KEY_ID : "";
const STORAGE_KEY_SECRET = process.env.STORAGE_KEY_SECRET? process.env.STORAGE_KEY_SECRET : "";
const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT? process.env.STORAGE_ENDPOINT : "";

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(STORAGE_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: STORAGE_KEY_ID,
    secretAccessKey: STORAGE_KEY_SECRET
});

module.exports = s3;