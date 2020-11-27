const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

users = [
    { id: "1", username: "john", password: "johnpass", role: "Customer", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjEiLCJVc2VybmFtZSI6ImpvaG4iLCJSb2xlIjoiQ3VzdG9tZXIifQ.zO8PaRZXRrNwtQNX9BH4fcuE3FyygwWYKt1dZFXs-oA" },
    { id: "2", username: "jane", password: "janepass", role: "Customer", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjIiLCJVc2VybmFtZSI6ImphbmUiLCJSb2xlIjoiQ3VzdG9tZXIifQ.oy3iwwR7_6R9v9zb9AqDBCvuYn-RjGIjeS9lrXyI8aQ" },
    { id: "3", username: "jill", password: "jillpass", role: "Customer", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjMiLCJVc2VybmFtZSI6ImppbGwiLCJSb2xlIjoiQ3VzdG9tZXIifQ.WG5l5-ydVkiP03T0yJ0ZnONrM2sefcyQgw_e8H9tTsE" },
    { id: "4", username: "james", password: "jamespass", role: "Customer", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjQiLCJVc2VybmFtZSI6ImphbWVzIiwiUm9sZSI6IkN1c3RvbWVyIn0.8ohu6pLq_SJNvACJDysU5V4kYnQlig8sIt2b0bvxGuE" },
    { id: "5", username: "jerry", password: "jerrypass", role: "Customer", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjUiLCJVc2VybmFtZSI6ImplcnJ5IiwiUm9sZSI6IkN1c3RvbWVyIn0.SKo_HIIK8FS5DF6sHuK2emMnZwEfjj3TeuYSnh_mUVA" },
    { id: "6", username: "adam", password: "adampass", role: "Admin", accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjYiLCJVc2VybmFtZSI6ImFkYW0iLCJSb2xlIjoiQWRtaW4ifQ.RTmUL93kayoi0JSb1EMeD3aMSTFmecK3v3s5x0vcwSQ" }
];

const database = {
    "users": [
        { "id": "1", "username": "john", "password": "johnpass", "role": "Customer" },
        { "id": "2", "username": "jane", "password": "janepass", "role": "Customer" },
        { "id": "3", "username": "jill", "password": "jillpass", "role": "Customer" },
        { "id": "4", "username": "james", "password": "jamespass", "role": "Customer" },
        { "id": "5", "username": "jerry", "password": "jerrypass", "role": "Customer" },
        { "id": "6", "username": "adam", "password": "adampass", "role": "Admin" }
    ],
    "animations": [
        { "owner": "1", "title": "Down the River", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 44, "comments": [1, 2], "banned": false, "id": "1"},
        { "owner": "2", "title": "How NOT to ride a bike", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 13, "comments": [3, 4], "banned": true, "id": "2"},
        { "owner": "3", "title": "Tale of a pidgeon", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 4, "comments": [], "banned": false, "id": "3"},
        { "owner": "4", "title": "Rainy mood", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 130, "comments": [], "banned": true, "id": "4"},
        { "owner": "5", "title": "Riverside rock", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 40, "comments": [], "banned": false, "id": "5"},
        { "owner": "2", "title": "Take me for a walk", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 1, "comments": [], "banned": true, "id": "6"},
        { "owner": "1", "title": "Corgi and corgo", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 409, "comments": [5, 6, 7], "banned": false, "id": "7"},
        { "owner": "4", "title": "Around the City", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 55, "comments": [], "banned": true, "id": "8"},
        { "owner": "3", "title": "Swansea at Night", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 356, "comments": [], "banned": false, "id": "9"},
        { "owner": "5", "title": "My daughter's first birthday cake", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 2, "comments": [], "banned": true, "id": "10"},
        { "owner": "5", "title": "How to make your hair in 2 seconds", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 6, "comments": [], "banned": false, "id": "11"},
        { "owner": "1", "title": "Bungee", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 21, "comments": [], "banned": true, "id": "12"},
        { "owner": "1", "title": "Winter Forest", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 488, "comments": [], "banned": false, "id": "13"},
        { "owner": "2", "title": "Dream Team of The Week", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 12, "comments": [], "banned": true, "id": "14"},
        { "owner": "3", "title": "Idk what this is", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 223, "comments": [], "banned": false, "id": "15"},
        { "owner": "2", "title": "Snake needs help with ladder", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 134, "comments": [], "banned": true, "id": "16"},
        { "owner": "2", "title": "Cute cats pooping", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 632, "comments": [], "banned": false, "id": "17"},
        { "owner": "2", "title": "Breaking screens in slow mo", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 99, "comments": [], "banned": true, "id": "18"},
        { "owner": "1", "title": "Arizona Sunset", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 537, "comments": [], "banned": false, "id": "19"},
        { "owner": "4", "title": "Elks crossing", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 26, "comments": [], "banned": true, "id": "20"},
        { "owner": "1", "title": "My Very Fancy House", "createdAt": "2020-11-17T22:19:01Z", "numberOfPurchase": 11, "comments": [], "banned": false, "id": "21"},
        { "owner": "3", "title": "This went personal..", "createdAt": "2020-10-22T21:09:02Z", "numberOfPurchase": 0, "comments": [], "banned": true, "id": "22"}
    ],
    "comments": [
        { "owner": "2", "createdAt": "2020-11-17T23:29:36Z", "content": "Nice animation! Thanks for the upload!", "animID": "1", "id": "1" },
        { "owner": "4", "createdAt": "2020-11-18T08:27:25Z", "content": "One of my favorites!", "animID": "1", "id": "2" },
        { "owner": "2", "createdAt": "2020-10-22T21:31:32Z", "content": "Please do not try this at home!!!", "animID": "1", "id": "3" },
        { "owner": "5", "createdAt": "2020-10-23T11:24:11Z", "content": "LOOOL", "animID": "1", "id": "4" },
        { "owner": "1", "createdAt": "2020-11-18T08:27:25Z", "content": "OMG SOOO CUTE!", "animID": "1", "id": "5" },
        { "owner": "3", "createdAt": "2020-10-22T21:31:32Z", "content": "My doggo looks similar", "animID": "1", "id": "6" },
        { "owner": "3", "createdAt": "2020-10-23T11:24:11Z", "content": "Awww", "animID": "1", "id": "7" }
    ]
}

const router = jsonServer.router(database);
var currentUser = null;

server.post('/auth/register', (req, res) => {
    const filteredUsers = database['users'].filter(user => user.username === req.body.username);
    if (filteredUsers.length > 0) {
        res.sendStatus(400);
    } else {
        database['users'].push({ "id": database['users'].length + 1, "username": req.body.username, "password": req.body.password, "role": "Customer"});
        res.sendStatus(200);
    }
});

server.post('/auth/login', (req, res) => {
    const filteredUsers = users.filter(user => user.username === req.body.username && user.password === req.body.password);
    if (filteredUsers.length > 0) {
        res.jsonp({ "accessToken": filteredUsers[0].accessToken});
    } else {
        res.sendStatus(401);
    }
});

server.post('/auth/logout', (req, res) => {
    res.sendStatus(201);
});

server.post('/animations/:animID/disable', (req, res) => {
    if (isAuthorized(req) && currentUser.role === 'Admin') {
        const filteredAnimations = database['animations'].filter(animation => animation.id == req.params.animID);
        if (filteredAnimations.length > 0) {
            filteredAnimations[0].banned = true;
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
});

server.put('/animations', (req, res) => {
    if (isAuthorized(req) && currentUser.role === 'Customer') {
        database['animations'].find(animation => animation.id == req.body.animID).boughtcounter++;
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

const isAuthorized = (req) => {
    if (req.headers.authorization) {
        const filteredUsers = users.filter(user => user.accessToken === req.headers.authorization.split(" ")[1]);
        if (filteredUsers.length > 0) {
            currentUser = filteredUsers[0];
            return true;
        }
    }
    currentUser = null;
    return false;
};

server.get('/animations/:animID', (req, res) => {

    console.log("anim + comment");

    if (isAuthorized(req) && ['Admin', 'Customer'].indexOf(currentUser.role) > -1) {

        const animID =  req.params['animID'];

        const animation = database['animations'].find(animation => animation.id === animID);
        const comments = database['comments'].filter(comment => comment.animID === animID);
        res.json({
            id: animation.id,
            owner: animation.owner,
            title: animation.title,
            createAt: animation.createdAt,
            numberOfPurchase: animation.numberOfPurchase,
            banned: animation.banned,
            comments
        })
    } else {
        res.sendStatus(401);
    }
})

server.use(router);
server.use((req, res, next) => {
 if (isAuthorized(req)) {
   next();
 } else {
   res.sendStatus(401);
 }
});
server.listen(3001, () => {
  console.log('JSON Server is running');
});