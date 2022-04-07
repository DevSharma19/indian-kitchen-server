import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc } from 'firebase/firestore';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
} from 'firebase/auth';
import date from 'date-and-time';
import ordinal from 'date-and-time/plugin/ordinal';
date.plugin(ordinal);

// Initialize Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyDL4-0omskboRHpHYcwvkvWlqMxNyKNRnc',
	authDomain: 'indian-kitchen-forum.firebaseapp.com',
	databaseURL: 'https://indian-kitchen-forum-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'indian-kitchen-forum',
	storageBucket: 'indian-kitchen-forum.appspot.com',
	messagingSenderId: '466532377434',
	appId: '1:466532377434:web:286f567b43224ae773c963',
	measurementId: 'G-3HNZQP6W5Z',
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth(firebase);

onAuthStateChanged(auth, (user) => {
	if (user) {
		app.locals.username = user.displayName;
		app.locals.userImage = user.photoURL;
		app.locals.id = user.uid;
	} else {
		app.locals.username = '';
		app.locals.userImage = '';
		app.locals.id = '';
	}
});

// Initialise express
var app = express();

// Render public files (css, js, images)
app.use(express.static('public'));

// Port website will run on
app.listen(8080);

// Set the view engine to ejs
app.set('view engine', 'ejs');
// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Render the forum page with a tag
app.get('/', function (req, res) {
	res.render('pages/index.ejs');
});

app.get('/add', function (req, res) {
	res.render('pages/add.ejs');
});

app.get('/post/:id', async (req, res) => {
	const id = req.params.id;
	res.render('pages/post.ejs', {
		recipe: await getRecipe(id),
	});
});

app.get('/sign-in', function (req, res) {
	res.render('pages/sign-in.ejs', {
		error: '',
	});
});

app.get('/sign-up', function (req, res) {
	res.render('pages/sign-up.ejs', {
		error: '',
	});
});

app.get('/forum', async (req, res) => {
	const tag = req.query.tag ?? '*';
	res.render('pages/forum.ejs', {
		tag: tag,
		recipes: await getRecipes(tag),
	});
});

app.post('/add', async (req, res) => {
	let recipe = req.body;

	recipe.ingredients = recipe.ingredients.split('\r\n');
	recipe.tools = recipe.tools.split('\r\n');
	recipe.instructions = recipe.instructions.split('\r\n');

	// date
	const now = new Date();
	recipe.date = date.format(now, 'MMMM DDD, YYYY');

	// defaults
	recipe.username = app.locals.username;
	recipe.userImage = app.locals.userImage;

	// add recipe
	await addRecipe(recipe);

	res.render('pages/index.ejs');
});

app.post('/sign-in', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			res.redirect('/');
		})
		.catch((error) => {
			console.log(error.message);
			res.render('pages/sign-in.ejs', {
				error: error.message,
			});
		});
});

app.post('/sign-up', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			updateProfile(userCredential.user, {
				displayName: name,
				photoURL: 'https://i.pravatar.cc/60?img=13',
			});
			res.redirect('/');
		})
		.catch((error) => {
			console.log(error.message);
			res.render('pages/sign-up.ejs', {
				error: error.message,
			});
		});
});

const getRecipes = async (tag) => {
	let recipes = [];
	const querySnapshot = await getDocs(collection(db, 'recipes'));

	querySnapshot.forEach((doc) => {
		const recipe = doc.data();
		recipe.id = doc.id;
		if (Object.values(recipe.tags).includes(tag) || tag === '*') {
			recipes.push(recipe);
		}
	});
	return recipes;
};

const getRecipe = async (id) => {
	const querySnapshot = await getDoc(doc(db, 'recipes', id));
	const recipe = querySnapshot.data();
	return recipe;
};

const addRecipe = async (recipe) => {
	const id = await addDoc(collection(db, 'recipes'), recipe);
	return id;
};
