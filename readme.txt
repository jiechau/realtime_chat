
$ git clone https://gitlab.com/jiechau/realtime_chat.git

# if use docker network with a local mongodb
$ cd realtime_chat
$ ./docker_network_run.sh
http://localhost:5173/
http://localhost:5173/
$ ./docker_network_rm.sh

# if no use docker network
# edit server/server.js, ln:24, edit mongodb connection string
$ ./docker_run.sh
http://localhost:5173/
http://localhost:5173/
$ ./docker_rm.sh


realtime_chat/
│
├── server/
│   ├── package.json
│   ├── server.js
│   └── models/
│       └── Message.js
│
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.js
        ├── App.vue
        ├── components/
        │   ├── Login.vue
        │   ├── ChatInterface.vue
        │   ├── ContactList.vue
        │   └── ChatWindow.vue
        └── store/
            └── index.js
      
