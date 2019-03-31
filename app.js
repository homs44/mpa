var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var auth = require('./auth');

var app = express();

app.use(session({
    secret:'sjkdlfajsil mikle'
}));

/**
 * 기본적으로 express는 http 메소드의 body 내용을 가져오지 않음.
 * 따라서 body-parser라는 라이브러리를 사용해서
 * body 내용을 읽을 수 있도록 해야함.
 */
app.use(bodyParser());
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

/**
 *  같은 표현
 *  function(req, res){
 *  }
 * 
 *  (req,res)=>{
 *  }
 */

 /**
  *  var routing  = []
  *  
  * routing.push('/','get', callback );
  * routing.push('/','get', callback );
  * routing.push('/login','get', callback );
  * routing.push('/login','post', callback );
  * 
  * for(var i =0; i< routing.length; i++){
  * if(routing[i].url === url && routing[i].method=== method){
  *     callback();    
  *     break;
  * }
  * }
  * 
  */

/**
 * 미들웨어
 */
app.use((req,res,next)=>{
    console.log(new Date());
    next();
})

function authroize(req,res,next){
    if(req.session.email){
        next();
    }else{
        res.render('login',{})
    }
}

app.get('/', authroize, (req,res,next)=>{
    //로그인이 안돼 있으면 login 페이지로 이동
    var test = [
        {title: 'The Definite Article', content:'The definite article is the word the. It limits the meaning of a noun to one particular'},
        {title: 'The Indefinite Article', content: 'The indefinite article takes two forms. It’s the word a when it precedes a word that '},
        {title: 'Exceptions: Choosing A or An', content:'There are a few exceptions to the general rule of using a before words that start with '}
    ]
    res.render('index',{email: req.session.email, list:test});
    // if(req.session.email){
    //     res.render('index',{});
    // }else{
    //     res.redirect('/login');
    // }
});

app.get('/login', (req,res,next)=>{
    res.render('login', {});
});

app.get('/logout', (req,res,next)=>{
    req.session.email = undefined;
    res.redirect('/login');
});
app.post('/login', (req,res,next)=>{

    var email = req.body.email;
    var password = req.body.password;

    var result = auth.login(email,password);

    if(result){
        //성공 시에는 index 페이지로 이동
        req.session.email = email; // Session에 사용자 Email 저장
        res.redirect('/');
    }else{
        //실패시에는 어떤 메시지를 전달
        res.redirect('/login');
    }

});

app.listen(3000);