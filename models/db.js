/**
 * Created by zp on 14-12-9.
 */
var settings=require('../settings'),
    Db=require('mongodb').Db,
    Connection=require('mongodb').Connection,
    Server=require('mongodb').Server;
module.exports=new Db(settings.db,new Server(settings.host,settings.port),{safe:true});
//创建数据库链接实例：(数据库名，新建服务器（主机名，端口），{safe:true})