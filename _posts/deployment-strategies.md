---
id: "11"
order: 11
title: 'Deployment Strategies'
excerpt: 'Recreate and RollingUpdate strategies'
coverImage: ''
module: ''
videoId: ''
duration: ''
---

## Deployment strategies

You might have wondered what logic or strategy Deployment controller used to bring up new Pods or terminate the old ones when we scaled the deployments up and down and updated the image names.

There are two different strategies used by deployments to replace old Pods with new ones. The **Recreate** strategy and the **RollingUpdate** strategy. The latter is the default strategy.

Here's a way to explain the differences between the two strategies. Imagine you work at a bank, and your job is to manage the tellers and ensure there's always someone working that can handle customer requests. Since this is an imaginary bank, let's say you have 10 desks available, and at the moment, five tellers are working.

![Five bank tellers at work](/assets/course/7/k8s-bank-5-tellers.png)

Time for a shift change! The current tellers have to leave their desks and let the new shift come in to take over.

One way you can do that is to tell the current tellers to stop working. They will put up the "Closed" sign in their booth, pack up their stuff, get off their seats, and leave. Only once all of them have left their seats, the new tellers can come in, sit down, unpack their stuff, and start working.

![New shift waiting](/assets/course/7/k8s-bank-new-shift-waiting.png)

Using this strategy, there will be downtime where you won't be able to serve any customers. As shown in the figure above, you might have one teller working, and once they pack up, it will take time for the new tellers to sit down and start their work. This is how the **Recreate** strategy works.

The **Recreate** strategy terminates all existing (old) Pods (shift change happens), and only when they are all terminated (they leave their booths), it starts creating the new ones (new shift comes in).

Using a different strategy, you can keep serving all of your customers while the shift is changing. Instead of waiting for all tellers to stop working first, you can utilize the empty booths and put your new shift to work right away. That means you might have more than five booths working at the same time during the shift change.

![Seven tellers working](/assets/course/7/k8s-bank-7-tellers.png)

As soon as you have seven tellers working, for example (five from the old shift, two from the new shift), more tellers from the old shift can start packing up, and new tellers can start replacing them. You could also say that you always want at least three tellers working during the shift change, and you can also accommodate more than five tellers working at the same time.

![Mix of tellers working](/assets/course/7/k8s-bank-2-old-3-new-tellers.png)

This is how the **RollingUpdate** strategy works. The `maxUnavailable` and `maxSurge` settings specify the maximum number of Pods that can be unavailable and the maximum number of old and new Pods that can be running at the same time.

### Recreate strategy

Let's create a deployment that uses the recreate strategy - notice the highlighted lines show where we specified the strategy.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
  labels:
    app.kubernetes.io/name: hello
spec:
  replicas: 5
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app.kubernetes.io/name: hello
  template:
    metadata:
      labels:
        app.kubernetes.io/name: hello
    spec:
      containers:
        - name: hello-container
          image: busybox
          command: ["sh", "-c", "echo Hello from my container! && sleep 3600"]
```

Copy the above YAML to `deployment-recreate.yaml` file and create the deployment:

```text
kubectl apply -f deployment-recreate.yaml
```

To see the recreate strategy in action, we will need a way to watch the changes that are happening to the Pods as we update the image version, for example.

You can open a second terminal window and use the `--watch` flag when listing all Pods - the `--watch` flag will keep the command running, and any changes to the Pods are written to the screen.

```text
kubectl get pods --watch
```

From the first terminal window, let's update the Docker image from `busybox` to `busybox:1.31.1` by running:

```text
kubectl set image deployment hello hello-container=busybox:1.31.1
```

The second terminal window's output where we are watching the Pods should look like the one below.  Note that I have added the line breaks between the groups.

```text
NAME                     READY   STATUS    RESTARTS   AGE
hello-6fcbc8bc84-jpm64   1/1     Running   0          54m
hello-6fcbc8bc84-wsw6s   1/1     Running   0          54m
hello-6fcbc8bc84-wwpk2   1/1     Running   0          54m
hello-6fcbc8bc84-z2dqv   1/1     Running   0          54m
hello-6fcbc8bc84-zpc5q   1/1     Running   0          54m

hello-6fcbc8bc84-z2dqv   1/1     Terminating   0          56m
hello-6fcbc8bc84-wwpk2   1/1     Terminating   0          56m
hello-6fcbc8bc84-wsw6s   1/1     Terminating   0          56m
hello-6fcbc8bc84-jpm64   1/1     Terminating   0          56m
hello-6fcbc8bc84-zpc5q   1/1     Terminating   0          56m
hello-6fcbc8bc84-wsw6s   0/1     Terminating   0          56m
hello-6fcbc8bc84-z2dqv   0/1     Terminating   0          56m
hello-6fcbc8bc84-zpc5q   0/1     Terminating   0          56m
hello-6fcbc8bc84-jpm64   0/1     Terminating   0          56m
hello-6fcbc8bc84-wwpk2   0/1     Terminating   0          56m
hello-6fcbc8bc84-z2dqv   0/1     Terminating   0          56m

hello-84f59c54cd-77hpt   0/1     Pending       0          0s
hello-84f59c54cd-77hpt   0/1     Pending       0          0s
hello-84f59c54cd-9st7n   0/1     Pending       0          0s
hello-84f59c54cd-lxqrn   0/1     Pending       0          0s
hello-84f59c54cd-9st7n   0/1     Pending       0          0s
hello-84f59c54cd-lxqrn   0/1     Pending       0          0s
hello-84f59c54cd-z9s5s   0/1     Pending       0          0s
hello-84f59c54cd-8f2pt   0/1     Pending       0          0s
hello-84f59c54cd-77hpt   0/1     ContainerCreating   0          0s
hello-84f59c54cd-z9s5s   0/1     Pending             0          0s
hello-84f59c54cd-8f2pt   0/1     Pending             0          0s
hello-84f59c54cd-9st7n   0/1     ContainerCreating   0          1s
hello-84f59c54cd-lxqrn   0/1     ContainerCreating   0          1s
hello-84f59c54cd-z9s5s   0/1     ContainerCreating   0          1s
hello-84f59c54cd-8f2pt   0/1     ContainerCreating   0          1s
hello-84f59c54cd-77hpt   1/1     Running             0          3s
hello-84f59c54cd-lxqrn   1/1     Running             0          4s
hello-84f59c54cd-9st7n   1/1     Running             0          5s
hello-84f59c54cd-8f2pt   1/1     Running             0          6s
hello-84f59c54cd-z9s5s   1/1     Running             0          7s
```

The first couple of lines show all five Pods running. Right at the first empty line above (I added that for clarity), we ran the set image command. The controller terminated all Pods first. Once they were terminated (second empty line in the output above), the controller created the new Pods.

The apparent downside of this strategy is that once controller terminates old Pods and stastarts up the new ones, there are no running Pods to handle any traffic, which means that there will be downtime. Make sure you delete the deployment `kubectl delete deploy hello` before continuing. You can also press CTRL+C to stop running the `--watch` command from the second terminal window (keep the window open as we will use it again shortly).

### Rolling update strategy

The second strategy called **RollingUpdate** does the rollout in a more controlled way. There are two settings you can tweak to control the process: `maxUnavailable` and `maxSurge`. Both of these settings are optional and have the default values set - 25% for both settings.

The `maxUnavailable` setting specifies the maximum number of Pods that can be unavailable during the rollout process. You can set it to an actual number or a percentage of desired Pods.

Let's say `maxUnavailable` is set to 40%. When the update starts, the old ReplicaSet is scaled down to 60%. As soon as new Pods are started and ready, the old ReplicaSet is scaled down again and the new ReplicaSet is scaled up. This happens in such a way that the total number of available Pods (old and new, since we are scaling up and down) is always at least 60%.

The `maxSurge` setting specifies the maximum number of Pods that can be created _over_ the desired number of Pods. If we use the same percentage as before (40%), the new ReplicaSet is scaled up right away when the rollout starts. The new ReplicaSet will be scaled up in such a way that it does not exceed 140% of desired Pods. As old Pods get killed, the new ReplicaSet scales up again, making sure it never goes over the 140% of desired Pods.

Let's create the deployment again, but this time we will use the `RollingUpdate` strategy.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
  labels:
    app.kubernetes.io/name: hello
spec:
  replicas: 10
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 40%
      maxSurge: 40%
  selector:
    matchLabels:
      app.kubernetes.io/name: hello
  template:
    metadata:
      labels:
        app.kubernetes.io/name: hello
    spec:
      containers:
        - name: hello-container
          image: busybox
          command: ["sh", "-c", "echo Hello from my container! && sleep 3600"]
```

Save the contents to `deployment-rolling.yaml` and create the deployment:

```bash
$ kubectl apply -f deployment-rolling.yaml
deployment.apps/hello created
```

Let's do the same we did before, run the `kubectl get po --watch` from the second terminal window to start watching the Pods.

```text
kubectl set image deployment hello hello-container=busybox:1.31.1
```

This time, you will notice that the new ReplicaSet is scaled up right away and the old ReplicaSet is scaled down at the same time:

```bash
$ kubectl get po --watch
NAME                     READY   STATUS    RESTARTS   AGE
hello-6fcbc8bc84-4xnt7   1/1     Running   0          37s
hello-6fcbc8bc84-bpsxj   1/1     Running   0          37s
hello-6fcbc8bc84-dx4cg   1/1     Running   0          37s
hello-6fcbc8bc84-fx7ll   1/1     Running   0          37s
hello-6fcbc8bc84-fxsp5   1/1     Running   0          37s
hello-6fcbc8bc84-jhb29   1/1     Running   0          37s
hello-6fcbc8bc84-k8dh9   1/1     Running   0          37s
hello-6fcbc8bc84-qlt2q   1/1     Running   0          37s
hello-6fcbc8bc84-wx4v7   1/1     Running   0          37s
hello-6fcbc8bc84-xkr4x   1/1     Running   0          37s

hello-84f59c54cd-ztfg4   0/1     Pending   0          0s
hello-84f59c54cd-ztfg4   0/1     Pending   0          0s
hello-84f59c54cd-mtwcc   0/1     Pending   0          0s
hello-84f59c54cd-x7rww   0/1     Pending   0          0s

hello-6fcbc8bc84-dx4cg   1/1     Terminating   0          46s
hello-6fcbc8bc84-fx7ll   1/1     Terminating   0          46s
hello-6fcbc8bc84-bpsxj   1/1     Terminating   0          46s
hello-6fcbc8bc84-jhb29   1/1     Terminating   0          46s
...
```

Using the rolling strategy, you can keep a percentage of Pods running at all times while you're doing updates. That means that there will be no downtime for your users.

Make sure you delete the deployment before continuing:

```text
kubectl delete deploy hello
```