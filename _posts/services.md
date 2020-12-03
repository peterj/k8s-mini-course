---
id: "12"
order: 12
title: 'Accessing Pods with Services'
excerpt: 'How to use Kubernetes Services'
coverImage: ''
module: ''
videoId: ''
duration: ''
---

## Accessing and exposing Pods with Services

Pods are supposed to be temporary or short-lived. Once they crash, they are gone, and the ReplicaSet ensures to bring up a new Pod to maintain the desired number of replicas.

Let's say we are running a web frontend in a container within Pods. Each Pod gets a unique IP address. However, due to their temporary nature, we cannot rely on that IP address.

Let's create a deployment that runs a web frontend:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-frontend
  labels:
    app.kubernetes.io/name: web-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: web-frontend
  template:
    metadata:
      labels:
        app.kubernetes.io/name: web-frontend
    spec:
      containers:
        - name: web-frontend-container
          image: learncloudnative/helloworld:0.1.0
          ports:
            - containerPort: 3000
```

Comparing this deployment to the previous one, you will notice we changed the resource names and the image we are using.

One new thing we added to the deployment is the `ports` section. Using the `containerPort` field, we set the port number website server listens on. The `learncloudnative/helloworld:0.1.0` is a simple Node.js Express application.

Save the above YAML in `web-frontend.yaml` and create the deployment:

```bash
$ kubectl apply -f web-frontend.yaml
deployment.apps/web-frontend created
```

Run `kubectl get pods` to ensure Pod is up and running and then get the logs from the container:

```bash
$ kubectl get po
NAME                          READY   STATUS    RESTARTS   AGE
web-frontend-68f784d855-rdt97   1/1     Running   0          65s

$ kubectl logs web-frontend-68f784d855-rdt97

> helloworld@1.0.0 start /app
> node server.js

Listening on port 3000
```

From the logs, you will notice that the container is listening on port `3000`. If we set the output flag to gives up the wide output (`-o wide`), you'll notice the Pods' IP address - `10.244.0.170`:

```bash
$ kubectl get po -o wide
NAME                            READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
web-frontend-68f784d855-rdt97   1/1     Running   0          15s   172.17.0.4   minikube   <none>           <none>
```

If we delete this Pod, a new one will take its' place, and it will get a brand new IP address as well:

```bash
$ kubectl delete po web-frontend-68f784d855-rdt97
pod "web-frontend-68f784d855-rdt97" deleted

$ kubectl get po -o wide
NAME                            READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
web-frontend-68f784d855-8c76m   1/1     Running   0          15s   172.17.0.5   minikube   <none>           <none>
```

Similarly, if we scale up the deployment to four Pods, we will four different IP addresses:

```bash
$ kubectl scale deploy web-frontend --replicas=4
deployment.apps/web-frontend scaled

$ kubectl get pods -o wide
NAME                            READY   STATUS    RESTARTS   AGE     IP           NODE       NOMINATED NODE   READINESS GATES
web-frontend-68f784d855-8c76m   1/1     Running   0          5m23s   172.17.0.5   minikube   <none>           <none>
web-frontend-68f784d855-jrqq4   1/1     Running   0          18s     172.17.0.6   minikube   <none>           <none>
web-frontend-68f784d855-mftl6   1/1     Running   0          18s     172.17.0.7   minikube   <none>           <none>
web-frontend-68f784d855-stfqj   1/1     Running   0          18s     172.17.0.8   minikube   <none>           <none>
```

### How to access the Pods without a service?

If you try to send a request to one of those IP addresses, it's not going to work:

```bash
$ curl -v 172.17.0.5:3000
*   Trying 172.17.0.5...
* TCP_NODELAY set
* Connection failed
* connect to 172.17.0.5 port 3000 failed: Network is unreachable
* Failed to connect to 172.17.0.5 port 3000: Network is unreachable
* Closing connection 0
curl: (7) Failed to connect to 172.17.0.5 port 3000: Network is unreachable
```

The Pods are running within the cluster, and that IP address is only accessible from within the cluster.

![Can't access pod from outside of the cluster](/assets/course/8/k8s-curl-to-pod.png)

For the testing purposes, you can run a pod inside the cluster and then get shell access to that Pod. Yes, that is possible!

![Access pods from within a pod inside the cluster](/assets/course/8/k8s-curl-to-pod-from-pod.png)

The `radialbusyboxplus:curl` is the image I frequently run inside the cluster if I need to check something or debug things. Using the `-i` and `--tty` flags, we are want to allocate a terminal (`tty`), and that we want an interactive session so that we can run commands directly inside the container.

I usually name this Pod `curl`, but you can name it whatever you like:

```bash
$ kubectl run curl --image=radial/busyboxplus:curl -i --tty
If you dont see a command prompt, try pressing enter.
[ root@curl:/ ]$
```

Now that we have access to the the terminal running inside the container that' inside the cluster, we can run the same cURL command as before:

```bash
[ root@curl:/ ]$ curl -v 172.17.0.5:3000
> GET / HTTP/1.1
> User-Agent: curl/7.35.0
> Host: 172.17.0.5:3000
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: text/html; charset=utf-8
< Content-Length: 111
< ETag: W/"6f-U4ut6Q03D1uC/sbzBDyZfMqFSh0"
< Date: Wed, 20 May 2020 22:10:49 GMT
< Connection: keep-alive
<
<link rel="stylesheet" type="text/css" href="css/style.css" />

<div class="container">
    Hello World!
</div>[ root@curl:/ ]$
```

This time, we get a response from the Pod! Make sure you run `exit` to return to your terminal. The `curl` Pod will continue to run and to reaccess it, you can use the `attach` command:

```bash
kubectl attach curl -c curl -i -t
```

> You can get a terminal session to any container running inside the cluster using the attach command.
