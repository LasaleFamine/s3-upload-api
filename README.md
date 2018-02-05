# s3-upload-api
[![Build Status](https://travis-ci.org/LasaleFamine/s3-upload-api.svg?branch=master)](https://travis-ci.org/LasaleFamine/s3-upload-api) [![codecov](https://codecov.io/gh/LasaleFamine/s3-upload-api/badge.svg?branch=master)](https://codecov.io/gh/LasaleFamine/s3-upload-api?branch=master)

> Single route API for uploading things on S3 (**currently supports only images**)


## Usage

```bash
$ git clone https://github.com/LasaleFamine/s3-upload-api && cd s3-upload-api
```

Install dependencies

```bash
$ yarn
```

## Configuration

The server will read from a configuration file some basic confs.
The name of the file should be `s3-upload.config.js`

Ex:
```js
module.exports = {
	bucket: '',
	accessKeyId: '', // read from process.env.AWS_ID if not present
	secretAccessKey: '', // read from process.env.AWS_SECRET if not present
	folder: ''
};
```

## API



## License

MIT © [LasaleFamine](https://godev.space)
