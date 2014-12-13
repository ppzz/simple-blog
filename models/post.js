/**
 * Created by zp on 14-12-13.
 */

var mongodb=require('./db');

function Post(name,title,post){
    this.name=name;
    this.post = post;
    this.title=title;
}

module.exports=Post;

Post.prototype.save =function(callback){
    var date =new Date();
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };

    //要存入数据库的文档
    var post={
        name:this.name,
        time:time,
        title:this.title,
        post:this.post
    };

    mongodb.open(function(error,db){
        if(error){
            return callback(error);
        }

        //读取post集合
        db.collection('posts',function(error,collection){
            if(error){
                mongodb.close();
                return callback(error);
            }

            //将文档放入集合
            collection.insert(post, { safe:true },function(err){
                mongodb.close();
                if(error){
                    return callback(error);
                }
                callback(null); //表示没有错误
            });
        });
    });
};

Post.get=function(name,callback){
    mongodb.open(function(error,db){
        if(error){
            return callback(error);
        }

        //读取post集合
        db.collection('posts',function(error,collection){
            if(error){
                mongodb.close();
                return callback(error);
            }

            var query={};
            if(name){
                query.name = name;
            }

            //根据query查询文章,反序排序,转化为数组，再传递给回调函数
            collection.find(query).sort({ time: -1 }).toArray(function(error,docs){
                mongodb.close();
                if(error){
                    return callback(error);
                }
                callback(null,docs);
            });
        });
    });
};