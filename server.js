import express from 'express';
import ejs from 'ejs';

// Initialise Express
var exp = express();

// Render public files (css, js, images)
exp.use(express.static('public'));

// Port website will run on
exp.listen(8080);

// Set the view engine to ejs
exp.set('view engine', 'ejs');

// Render the forum page with a tag
exp.get('/', function (req, res) {
	res.render('pages/index.ejs');
});

exp.get('/add', function (req, res) {
	res.render('pages/add.ejs');
});

exp.get('/post', function (req, res) {
	res.render('pages/post.ejs');
});

exp.get('/sign-in', function (req, res) {
	res.render('pages/sign-in.ejs');
});

exp.get('/sign-up', function (req, res) {
	res.render('pages/sign-up.ejs');
});

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const querySnapshot = await getDocs(collection(db, 'recipes'));
querySnapshot.forEach((doc) => {
	console.log(`${doc.id}`);
	console.log('\t', `${doc.data().username}`);
});

exp.get('/forum', function (req, res) {
	res.render('pages/forum.ejs', {
		tag: req.query.tag,
		recipes: [
			{
				title: 'Chilli Chicken',
				date: 'January 11th 2019',
				username: 'Samantha',
				userImage: 'https://i.pravatar.cc/60?img=1',
			},
			{
				title: 'Chilli Chicken',
				date: 'January 11th 2019',
				username: 'Samantha',
				userImage: 'https://i.pravatar.cc/60?img=1',
			},
			{
				title: 'Chilli Chicken',
				date: 'January 11th 2019',
				username: 'Samantha',
				userImage: 'https://i.pravatar.cc/60?img=1',
			},
			{
				title: 'Chilli Chicken',
				date: 'January 11th 2019',
				username: 'Samantha',
				userImage: 'https://i.pravatar.cc/60?img=1',
			},
		],
	});
});
