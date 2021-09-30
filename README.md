# Scaling websockets

Goal: By the end of quarter learn about websockets and how to scale them by implementing an example application and sharing it with team.

## Problem

There are 2 main problems when it comes to scaling applications based on websockets

1. Number of connections
2. Cross server communication

## Solution

1. We can substantially limit number of connections a client can open by using a `SharedWorker` that will communicate with the server and with all opened tabs. Without a `SharedWorker` every new tab will create a new websocket connection with the server. This number is limited by the OS of the server. Command `ulimit -n` can show what that limit is, for linux it's usually 1024 connections, this value can be modified - https://www.tecmint.com/increase-set-open-file-limits-in-linux/)

2. To solve this problem we can use a pub/sub service that will communicate between server instances. For purpose of this application I used `Redis` (other services that offer similiar functionality are Kafka, RabbitMQ). I also used `socket.io` as websocket server on top of `express` framework which offers much flexibility, lots of features and easy to use adapters to intergrate with Redis or other services.

[Source code](https://github.com/maeek/ws-scaling)

![Running app](/example.png?raw=true)

## Deployment

To test the app run:

```bash
cd deploy
docker network create proxy --subnet=172.21.0.0/16
docker-compose up --build
```

Then open the browser and go to http://172.21.1.1/
