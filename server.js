import express from 'express';
import ejs from 'ejs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc } from 'firebase/firestore';

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

// Initialise express
var app = express();

// Render public files (css, js, images)
app.use(express.static('public'));

// Port website will run on
app.listen(8080);

// Set the view engine to ejs
app.set('view engine', 'ejs');

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
	res.render('pages/sign-in.ejs');
});

app.get('/sign-up', function (req, res) {
	res.render('pages/sign-up.ejs');
});

app.get('/forum', async (req, res) => {
	const tag = req.query.tag ?? '*';
	res.render('pages/forum.ejs', {
		tag: tag,
		recipes: await getRecipes(tag),
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

const addRecipe = async () => {
	const id = await addDoc(collection(db, 'recipes'), {
		userImage: 'https://i.pravatar.cc/60?img=1',
		date: 'January 1st, 2000',
		tags: { mealType: 'lunch', keyIngredient: 'chicken', region: 'tamil nadu' },
		title: '',
		description: '',
		username: '',
		ingredients: [],
		tools: [],
		instructions: [],
	});
	return id;
};
