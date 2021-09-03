var backup = require('mongodb-backup'); 
var currentDate = Date.now()
exports.backups = () => {
   backup({
  uri: process.env.MONGO_DB,
  root: __dirname,
  tar: `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDay()}${currentDate.getHours()}.tar`, // save backup into this tar file
})
} 