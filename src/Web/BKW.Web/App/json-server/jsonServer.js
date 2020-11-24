const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

users = [
    { id: 1, username: "john", password: "johnpass", role: "customer", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIxIiwidXNlcm5hbWUiOiJqb2huIiwicm9sZSI6ImN1c3RvbWVyIn0.-OJN39Y3e-DTFFSRJIGK_tUqFkSHBCH82HZBGw-lo4s" },
    { id: 2, username: "jane", password: "janepass", role: "customer", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIyIiwidXNlcm5hbWUiOiJqYW5lIiwicm9sZSI6ImN1c3RvbWVyIn0.mI061iY6MOgYZCyaZ-ydjBXThjZGseuEJOExw0bFhbA" },
    { id: 3, username: "jill", password: "jillpass", role: "customer", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiIzIiwidXNlcm5hbWUiOiJqaWxsIiwicm9sZSI6ImN1c3RvbWVyIn0.Tjxk-jfsoulOpCH327zTYvFOUgM331vM9_BiKliuOhk" },
    { id: 4, username: "james", password: "jamespass", role: "customer", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI0IiwidXNlcm5hbWUiOiJqYW1lcyIsInJvbGUiOiJjdXN0b21lciJ9.nMg6RMHJprszEgHJCREZtPZeYYV9FSa-SOtA6CNtxVU" },
    { id: 5, username: "jerry", password: "jerrypass", role: "customer", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1IiwidXNlcm5hbWUiOiJqZXJyeSIsInJvbGUiOiJjdXN0b21lciJ9.q6T4tl3iPRt0NjZZG0__M8PixZcnFdGFt6mBCzXSxwM" },
    { id: 6, username: "adam", password: "adampass", role: "admin", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2IiwidXNlcm5hbWUiOiJhZGFtIiwicm9sZSI6ImFkbWluIn0.baKqQTDKeeLcBGrYV5DVJP0SsGFt4F3T1zpB7I95BNI" }
];

const database = {
    "users": [
        { "id": 1, "username": "john", "password": "johnpass", "role": "customer" },
        { "id": 2, "username": "jane", "password": "janepass", "role": "customer" },
        { "id": 3, "username": "jill", "password": "jillpass", "role": "customer" },
        { "id": 4, "username": "james", "password": "jamespass", "role": "customer" },
        { "id": 5, "username": "jerry", "password": "jerrypass", "role": "customer" },
        { "id": 6, "username": "adam", "password": "adampass", "role": "admin" }
    ],
    "animations": [
        { "owner": 1, "title": "Down the River", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 44, "comments": [1, 2], "banned": false, "id": 1},
        { "owner": 2, "title": "How NOT to ride a bike", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 13, "comments": [3, 4], "banned": true, "id": 2},
        { "owner": 3, "title": "Tale of a pidgeon", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 4, "comments": [], "banned": false, "id": 3},
        { "owner": 4, "title": "Rainy mood", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 130, "comments": [], "banned": true, "id": 4},
        { "owner": 5, "title": "Riverside rock", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 40, "comments": [], "banned": false, "id": 5},
        { "owner": 2, "title": "Take me for a walk", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 1, "comments": [], "banned": true, "id": 6},
        { "owner": 1, "title": "Corgi and corgo", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 409, "comments": [5, 6, 7], "banned": false, "id": 7},
        { "owner": 4, "title": "Around the City", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 55, "comments": [], "banned": true, "id": 8},
        { "owner": 3, "title": "Swansea at Night", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 356, "comments": [], "banned": false, "id": 9},
        { "owner": 5, "title": "My daughter's first birthday cake", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 2, "comments": [], "banned": true, "id": 10},
        { "owner": 5, "title": "How to make your hair in 2 seconds", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 6, "comments": [], "banned": false, "id": 11},
        { "owner": 1, "title": "Bungee", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 21, "comments": [], "banned": true, "id": 12},
        { "owner": 1, "title": "Winter Forest", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 488, "comments": [], "banned": false, "id": 13},
        { "owner": 2, "title": "Dream Team of The Week", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 12, "comments": [], "banned": true, "id": 14},
        { "owner": 3, "title": "Idk what this is", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 223, "comments": [], "banned": false, "id": 15},
        { "owner": 2, "title": "Snake needs help with ladder", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 134, "comments": [], "banned": true, "id": 16},
        { "owner": 2, "title": "Cute cats pooping", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 632, "comments": [], "banned": false, "id": 17},
        { "owner": 2, "title": "Breaking screens in slow mo", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 99, "comments": [], "banned": true, "id": 18},
        { "owner": 1, "title": "Arizona Sunset", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 537, "comments": [], "banned": false, "id": 19},
        { "owner": 4, "title": "Elks crossing", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 26, "comments": [], "banned": true, "id": 20},
        { "owner": 1, "title": "My Very Fancy House", "created_at": "2020-11-17T22:19:01Z", "boughtcounter": 11, "comments": [], "banned": false, "id": 21},
        { "owner": 3, "title": "This went personal..", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 45, "comments": [], "banned": true, "id": 22}
    ],
    "comments": [
        { "owner": 2, "created_at": "2020-11-17T23:29:36Z", "content": "Nice animation! Thanks for the upload!", "animID": 1, "id": 1 },
        { "owner": 4, "created_at": "2020-11-18T08:27:25Z", "content": "One of my favorites!", "animID": 1, "id": 2 },
        { "owner": 2, "created_at": "2020-10-22T21:31:32Z", "content": "Please do not try this at home!!!", "animID": 2, "id": 3 },
        { "owner": 5, "created_at": "2020-10-23T11:24:11Z", "content": "LOOOL", "animID": 2, "id": 4 },
        { "owner": 1, "created_at": "2020-11-18T08:27:25Z", "content": "OMG SOOO CUTE!", "animID": 7, "id": 5 },
        { "owner": 3, "created_at": "2020-10-22T21:31:32Z", "content": "My doggo looks similar", "animID": 7, "id": 6 },
        { "owner": 3, "created_at": "2020-10-23T11:24:11Z", "content": "Awww", "animID": 7, "id": 7 }
    ]
}

const router = jsonServer.router(database);
var currentUser = null;

server.post('/api/auth/register', (req, res) => {
    const filteredUsers = database['users'].filter(user => user.username === req.body.username);
    if (filteredUsers.length > 0) {
        res.sendStatus(400);
    } else {
        database['users'].push({ "id": database['users'].length + 1, "username": req.body.username, "password": req.body.password, "role": "customer"});
        res.sendStatus(200);
    }
});

server.post('/api/auth/login', (req, res) => {
    const filteredUsers = users.filter(user => user.username === req.body.username && user.password === req.body.password);
    if (filteredUsers.length > 0) {
        res.jsonp({ "token": filteredUsers[0].token});
    } else {
        res.sendStatus(401);
    }
});

server.post('/api/auth/logout', (req, res) => {
    res.sendStatus(201);
});

const isAuthorized = (req) => {
    console.log(req.headers);
    if (req.headers.authorization) {
        const filteredUsers = users.filter(user => user.token === req.headers.authorization.split(" ")[1]);
        if (filteredUsers.length > 0) {
            currentUser = filteredUsers[0];
            return true;
        }
    }
    currentUser = null;
    return false;
};
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