/**
 * Created by zp on 14-12-10.
 */

var mongodb=require('./db');

//class：user
function User(user){
    this.name=user.name;
    this.password=user.password;
    this.email=user.email;
}
module.exports=User;

//实例方法：存储用户信息
User.prototype.save=function(callback){
    //要存储的用户文档
    var user={
        name:this.name,
        password:this.password,
        email:this.email
    };

    //打开数据库
    mongodb.open(function(error,db){
        if(error){
            return callback(error);
        }

        //读取user集合，
        db.collection('user',function(error,collection){
            if(error){
                mongodb.close();
                return callback(error);
            }

            //将要存储的用户数据插入user集合
            collection.insert(user,{safe:true},function(error,user){
                mongodb.close();
                if(error){
                    return callback(error);
                }

                //成功后返回存储的用户文档
                callback(null,user[0]);
            });
        });
    });
};

//类方法：get名为：name 的 用户的 数据
User.get=function(name,callback){
    //打开数据库
    mongodb.open(function(error,db){
        if(error){
            return callback(error);
        }

        //读取user集合
        db.collection('express',function(error,collection){
            if(error){
                mongodb.close();
                return callback(error);
            }

            //查找用户名为 name的一个文档
            collection.findOne({name:name},function(error,user){
                mongodb.close();
                if(error){
                    return callback(error);
                }
                callback(null,user);
            });
        });
    });
};

