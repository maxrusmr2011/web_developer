var lib=require('./lib.js');
lib.init();

 http.createServer(function(req,res){
	var url_ob=url.parse(req.url,true);
	var data_post='';
	var pathname=url_ob.pathname;
	console.log(req.method+'  '+pathname);
	console.log('Content-type: '+req.headers['content-type']);
	var print_line=url_ob.query.printline;
	console.log(print_line);
	

	
if(pathname=='/'||pathname==''){
	fs.readFile('index.html', 'utf8', function(err, contents) {
		res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});	
		res.write(contents); res.end();
		console.log('send file : '+'index.html');
	});
}
else if(pathname=='/script'&&print_line){
	try{
		var ob_line=eval(print_line);
	console.log(ob_line);
	var type_line=typeof ob_line;
	var result=String(ob_line);
	if(type_line=='object'){
		if(Array.isArray(ob_line)){type_line='array';}
		else if(ob_line==null){result='null';}
		else{
		result=''; var arr=[],i=0;for(arr[i++] in ob_line);arr.sort();i=0;
		for(i in arr){result+='<br>'+arr[i]+'('+typeof(ob_line[arr[i]])+')'+' = '+(typeof(ob_line[arr[i]])=='object'||typeof(ob_line[arr[i]])=='function'?'':String(ob_line[arr[i]]));}
		}
		
	}
	}
	catch(e){result='ERROR';}
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
	res.write(print_line+' ('+type_line+') = '+result);
	res.end();}
else if(pathname=='/test'){
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
	res.write('http'+(ch?',chat':'')); res.end();
	console.log('send : '+'http'+(ch?',chat':''));
	}
else if(pathname=='/socketio'){
	if(!ch)require("./chat");
	res.write('socketio on');res.end();
	ch=true;
	}
else if(pathname=='/chat'){
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
	res.write('<!DOCTYPE html><html><head>');
	res.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js"></script>');
	res.write("<script>function a2(){var a3=document.getElementById('msg_sock'); socket.send(a3.value);a3.value='';}; ");
	res.write("newget('http://'+location.hostname+':3000/test',");
	res.write("function(){if(this.responseText.indexOf('chat')>0){run_chat();}");
	res.write("else{newget('http://'+location.hostname+':3000/socketio',run_chat);}} );");
	res.write("function newget(myurl,fun_sucs){ var xhr=new XMLHttpRequest(); ");
		res.write("xhr.open('GET',myurl); xhr.onload =fun_sucs; xhr.onerror=function(){alert('Ошибка запроса')}; xhr.send();}");
	res.write("function a1(x){document.getElementById('test_result').innerHTML+=x+'<br>';}; ");
	res.write("function run_chat(){ socket = io.connect('http://'+location.hostname+':8080'); ");
		res.write("socket.on('connect', function(){ ");
		res.write("socket.on('message', function(msg){ var m=(msg.event=='message'?msg.text:msg.event); a1('('+msg.time+' '+msg.name+') '+m);}); ");
		res.write("socket.on('disconnect', function(){a1('Сервер отключен'); }); }); } </script>");

	res.write('<style>#test_result{height:300px;overflow:scroll;}</style>');
	
	res.write('</head><body><div><input id="msg_sock"><button onclick="a2()">Передать</button>');
	res.write('</div><div id="test_result"></div>');
	res.write('</body></html>');
	res.end();
	}
else if(pathname=='/obj/register'){
	if(req.method=='POST'){
	var form0 = new multiparty.Form();
	form0.parse(req, function(err, fields, files){console.log(fields);});
	
	var form1 = new formidable.IncomingForm();
	form1.parse(req, function(err, fields, files){
		console.log(fields);	
			var salt='hallo';
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
			for(var i in db_json){
				if(db_json[i].username==fields.username){
				res.end('Такй пользователь уже существует');return;}
			}
		fields.hash=crypto.pbkdf2Sync(fields.password,salt,1,10,"sha256").toString('hex');
		db_json.push(fields);
		res.end(JSON.stringify(db_json));
			});
}
}
else if(pathname=='/obj/login'){
	if(req.method=='POST'){
		req.on("data",(d)=>{data_post+=d; });
		req.on("end",()=>{
			data_post=decodeURIComponent(data_post);
			data_post=querystring.parse(data_post);
			var salt='hallo';
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
	for(var i in db_json){
		if(db_json[i].username==data_post.username){
			data_post.hash=crypto.pbkdf2Sync(data_post.password,salt,1,10,"sha256").toString('hex');
			if(data_post.hash==db_json[i].hash) {
		//if(data_post.password==db_json[i].password) {
				res.end('Ok');return;}
			else {
				res.end('Пароль не правильный'); return;}
		}};
		res.end('Такого пользователя не существует');
		});
	}
}
else if(pathname=='/mongodb'){
	var uri = 'mongodb://admin:admin@ds151024.mlab.com:51024/alldata';		
	if(req.method=='POST'){
		req.on("data",(d)=>{data_post+=d; });
		req.on("end",()=>{
			data_post=decodeURIComponent(data_post);
			if(req.headers['content-type'].indexOf('json')>0) data_post=JSON.parse(data_post);
			else data_post=querystring.parse(data_post);
			var salt='hallo';
	   
	  mongodb.MongoClient.connect(uri, function(err, db) {
		console.log(1);
		if(err) throw err;
		console.log(2);
		var tabl = db.collection('users');
		console.log(3);
		tabl.insertOne(data_post, function(err, result) {
			console.log(4);
			if(err) throw err;
			console.log(5);
			console.log(result.ops);
			res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
		    res.end( JSON.stringify(result.ops));
		});	
	  });
	});
}
else if(req.method=='GET'){
	
	  mongodb.MongoClient.connect(uri, function(err, db) {
		console.log(1);
		if(err) throw err;
		console.log(2);
		var tabl = db.collection('users');
		console.log(3);
			tabl.find({}).toArray(function(err, result) {
			console.log(4);
			if(err) throw err;
			console.log(5);
			console.log(result);
			res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
		    res.end( JSON.stringify(result));
			});	
	  });
	}
}
else if(pathname.substr(0,9)=='/mongodb/'){
	var uri = 'mongodb://admin:admin@ds151024.mlab.com:51024/alldata',sub=pathname.substr(9);		
		console.log('1 '+sub);

	if(req.method=='GET'){
		if(sub!=''){
		mongodb.MongoClient.connect(uri, function(err, db) {
		console.log(sub);
		if(err) throw err;
		console.log(2);
		var tabl = db.collection('users');
		console.log(3);
		tabl.findOne({username:sub},function(err, result) {
			console.log(4);
			if(err) throw err;
			console.log(5);
			console.log(result);
			res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});			
			res.end( JSON.stringify(result) );
		});
		db.close();
		});
		}
	}
	else if(req.method=='DELETE'){
		if(sub!=''){
		mongodb.MongoClient.connect(uri, function(err, db) {
		console.log('2 '+sub);
		if(err) throw err;
		console.log(2);
		var tabl = db.collection('users');
		console.log(3);
		tabl.remove({username:sub},function(err, result) {
			console.log(4);
			if(err) throw err;
			console.log(5);
			console.log(result.result);
			res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});			
			res.end( JSON.stringify(result) );
		});
		db.close();
		});
		}
	}
	else if(req.method=='PUT'){
		if(sub!=''){
		mongodb.MongoClient.connect(uri, function(err, db) {
		console.log('2 '+sub);
		if(err) throw err;
		console.log(2);
		var tabl = db.collection('users');
		console.log(3);
	var form1 = new formidable.IncomingForm();
	form1.parse(req, function(err, fields, files){
			console.log(fields);		
			tabl.updateOne({username:sub},{$set:{password:fields.password,email:fields.email}},function(err, result){
				console.log(5);
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				if(err)	{res.end( 'ERROR');
					console.log(err);		
				}
				else {res.end( JSON.stringify(result) );console.log(result.result);	}
				db.close();

			});
	});
		});
		}
	}	
}
else if(pathname=='/mongoose'){
	  if(req.method=='POST'){
		req.on("data",(d)=>{data_post+=d; });
		req.on("end",()=>{
			data_post=decodeURIComponent(data_post);
			data_post=querystring.parse(data_post);
			console.log(data_post);
			var new_user = new User({username:data_post.username,password:data_post.password,email:data_post.email,_id:new mongoose.Types.ObjectId()});
			new_user.save( function(err) {
				if(err) throw err;
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.end('Ok');
			});	
		});
	}
	else if(req.method=='GET'){
			User.find({},function(err, result) {
				if(err) throw err;
				console.log(result);
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.end( JSON.stringify(result));
			});	
	}
}
else if(pathname.substr(0,10)=='/mongoose/'){
	var sub=pathname.substr(10);		
		console.log('1 '+sub);
	if(req.method=='GET'){
			User.findOne({username:sub},function(err, result) {
				if(err) throw err;
				console.log(result);
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.end( JSON.stringify(result));
			});			
	}
	else if(req.method=='DELETE'){
			User.findOne({username:sub},function(err, result) {
				if(err) throw err;
				result.remove();
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.end( 'Delete');
			});			
	}	
	else if(req.method=='PUT'){
	var form1 = new formidable.IncomingForm();
	form1.parse(req, function(err, fields, files){
			console.log(fields);			
			User.findOneAndUpdate({username:sub},fields,function(err, result) {
				if(err) throw err;
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.end( JSON.stringify(fields));
			});	
		});	
	}		
}
else {
	pathname=pathname.substr(1);
		fs.stat(pathname,function(err,data){
		if(err){
			res.writeHead(404);
			res.write("Bad request 404\n");
			res.end();
		}else if(data.isFile()){
			var type=mime.lookup(pathname);
			console.log(type);
			res.setHeader('Content-Type',type);
			res.statusCode=200;
			var file=fs.createReadStream(pathname);
			file.on("open",function(){file.pipe(res);});
			file.on("error",function(err){console.log(err);});
		}
		});
}


}).listen(3000,()=>{console.log("Server http running at 3000 ("+ip+")\n")});
