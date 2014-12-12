var crypto=require('crypto');
var User=require('../models/user.js')
/* GET home page. */
function router(app){
  app.get('/',function(requset,response){
    response.render('index',{title:'Express'});//调用ejs模板 routes 来进行相应。渲染模板时传给模板一个对象，该对象包含了渲染模板需要的数据
  });

  app.get('/register',function(request,response){
    response.render('register',{
      title:'注册',
      success:request.flash('success').toString(),
      error:request.flash('error').toString()
    });
  });

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
        console.log("123213213");
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

  app.get('/login',function(request,response){

  });

  app.post('/login',function(request,response){

  });

  app.get('/post',function(request,response){

  });

  app.post('/post',function(request,response){

  });

  app.get('/logout',function(reuqest,response){

  });

}

module.exports = router;


/*当index页面被请求的时候 app.use('/',routes)将请求的指引到路由文件index.js，
routes.js定义了ruter.get('/',callback)来对请求进行处理。
 */