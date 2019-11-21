var lib=require('./lib.js');
lib.init(true);
var app = express();
app.use(morgan('short'));
app.use(bodyParser.text(),bodyParser.urlencoded({extended:true}),bodyParser.json(),multer().single('aa'));

app.get('/', lib.html );
app.get('/favicon.ico', lib.ico );

app.get('/script', lib.showscript );

app.get('/test', lib.test );
app.get('/socketio', lib.socketio );
app.get('/chat', lib.chat );

app.post('/obj/login', lib.login );
app.post('/obj/register', lib.registr );

	mdb=express.Router();
	mdb.get('',lib.mdb_all);
	mdb.post('',lib.mdb_new);
	mdb.get('/:a',lib.mdb_one);
	mdb.delete('/:a',lib.mdb_del);
	mdb.put('/:a',lib.mdb_put);
app.use('/mongodb',mdb);

	mgs=express.Router();
	mgs.get('',lib.mgs_all);
	mgs.post('',lib.mgs_new);
	mgs.get('/:a',lib.mgs_one);
	mgs.delete('/:a',lib.mgs_del);
	mgs.put('/:a',lib.mgs_put);
app.use('/mongoose',mgs);
app.use(express.static(__dirname));











app.listen(3000, function () {
  console.log('Server express running at 3000!  ('+ip+')');
});