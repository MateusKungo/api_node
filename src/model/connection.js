const mysql=require('mysql2/promise')
const connection=mysql.createPool({
    host:'mysql-meubancobemestar123.alwaysdata.net',
    user:'398169',
    password:'meubancobemestar123Boma@_',
    database:'meubancobemestar123_bemestar',
})
module.exports=connection