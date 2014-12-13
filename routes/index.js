var crypto=require('crypto');
var User=require('../models/user.js');
var Post=require('../models/post.js');


/* GET home page. */
function router(app){
  app.get('/',function(request,response){
    Post.get(null,function(error,posts){
      if(error){
        posts=[];
      }
      response.render('index',{
        title:'Express',
        user:request.session.user,
        posts:posts,
        success:request.flash('success').toString(),
        error:request.flash('error').toString()
      });//调用ejs模板 routes 来进行相应。渲染模板时传给模板一个对象，该对象包含了渲染模板需要的数据
    });
  });

  app.get('/register',checkNotLogin);
  app.get('/register',function(request,response){
    response.render('register',{
      title:'注册',
      user:request.session.user,
      success:request.flash('success').toString(),
      error:request.flash('error').toString()
    });
  });

  app.post('/register',checkNotLogin);
  app.post('/register',function(request,response){
    var name=request.body.name;
    var password=request.body.password;
    var password_re=request.body['password-repeat'];

    //校验两次输入的密码是否相同;
    if(password!=password_re){
      request.flash('error','两次输入的密码不相同');
      return response.redirect('/register');
    }

    //生成密码的 md5 值
    var md5=crypto.createHash('md5');
    var password=md5.update(password).digest('hex');

    var newUser= new User({
      name:name,
      password:password,
      email:request.body.email
    });

    //检查用户名是否已经存在
    User.get (newUser.name,function(error,user){
      console.log(user);

      if(error){
        request.flash('error',error);
        return response.redirect('/');
      }

      if(user){
        request.flash('error','用户已存在');
        return response.redirect('/register');
      }

      //如果不存在测新增：
      newUser.save(function(error,user){
        if(error){
          request.flash('error',error);
          return response.redirect('/register');
        }

        request.session.user=user;
        request.flash('success');
        response.redirect('/');

      });
    });
  });

  app.get('/login',checkNotLogin);
  app.get('/login',function(request,response){
    response.render('login',{
      title:'登录',
      user:request.session.user,
      success:request.flash('success').toString(),
      error:request.flash('error').toString()
    });
  });

  app.post('/login',checkNotLogin);
  app.post('/login',function(request,response){
    var md5=crypto.createHash('md5');
    var password=md5.update(request.body.password).digest('hex');

    User.get(request.body.name,function(error,user){
      if(!user){
        request.flash('error','用户名不存在');
        return response.redirect('/login');
      }

      if(user.password!=password){
        request.flash('error','密码不正确');
        return response.redirect('/login');
      }

      request.session.user=user;
      request.flash('success','登录成功');
      response.redirect('/');
    });
  });

  app.get('/post',checkLogin);
  app.get('/post',function(request,response){
    response.render('post',{
      title:'发表博客',
      user:request.session.user,
      success:request.flash('success').toString(),
      error:request.flash('error').toString()
    });
  });

  app.post('/post',checkLogin);
  app.post('/post',function(request,response){
    var currentUser=request.session.user;
    var post=new Post(currentUser.name,request.body.title,request.body.post);
    post.save(function(error){
      if(error){
        request.flash('error',error);
        return response.redirect('/');
      }
      request.flash('success','发表成功');
      response.redirect('/');
    });
  });

  app.get('/logout',checkLogin);
  app.get('/logout',function(request,response){
    request.session.user = null;
    request.flash('success','登出成功');
    response.redirect('/');
  });

  function checkLogin(request,response,next){
    if(!request.session.user){
      request.flash('error','未登录');
      response.redirect('/login');
    }
    next();
  }

  function checkNotLogin(request,response,next){
    if(request.session.user){
      request.flash('error','已登录');
      response.redirect('back');
    }
    next();
  }
}

module.exports = router;


/*当index页面被请求的时候 app.use('/',routes)将请求的指引到路由文件index.js，
routes.js定义了ruter.get('/',callback)来对请求进行处理。
 */