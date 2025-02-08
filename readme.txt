
$ git clone https://gitlab.com/ysdt-ai-dev/frontend/liaoliao.git


$ cd liaoliao
$ ./docker_run.sh
http://localhost:5173/
http://localhost:5173/
$ ./docker_rm.sh


liaoliao/
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
      
