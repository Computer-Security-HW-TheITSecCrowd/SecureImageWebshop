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
        { "owner": 2, "title": "How NOT to ride a bike", "created_at": "2020-10-22T21:09:02Z", "boughtcounter": 13, "comments": [3, 4], "banned": true, "id": 2}
    ],
    "comments": [
        { "owner": 2, "created_at": "2020-11-17T23:29:36Z", "content": "Nice animation! Thanks for the upload!", "animID": 1, "id": 1 },
        { "owner": 4, "created_at": "2020-11-18T08:27:25Z", "content": "One of my favorites!", "animID": 1, "id": 2 },
        { "owner": 2, "created_at": "2020-10-22T21:31:32Z", "content": "Please do not try this at home!!!", "animID": 2, "id": 3 },
        { "owner": 5, "created_at": "2020-10-23T11:24:11Z", "content": "LOOOL", "animID": 2, "id": 4 }
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