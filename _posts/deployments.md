---
id: "10"
order: 10
title: 'Deployments'
excerpt: 'Creating Kubernetes Deployments'
coverImage: ''
module: ''
videoId: ''
duration: ''
---

## Creating Deployments

A deployment resource is a wrapper around the ReplicaSet that allows doing controlled updates to your Pods. For example, if you want to update image names for all Pods, you can edit the Pod template, and the deployment controller will re-create Pods with the new image.

If we continue with the same example as we used before, this is how a Deployment would look like:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
  labels:
    app.kubernetes.io/name: hello
spec:
  replicas: 5
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

The YAML for Kubernetes Deployment looks almost the same as for a ReplicaSet. There's the replica count, the selector labels, and the Pod template.

Save the above YAML contents in `deployment.yaml` and create the deployment:

```bash
$ kubectl apply -f deployment.yaml --record
deployment.apps/hello created
```

NOTE: Why the `--record` flag? Using this flag, we are telling Kubernetes to store the command we executed in the annotation called `kubernetes.io/change-cause`. Record flag is useful to track the changes or commands that you executed when the deployment was updated. You will see this in action later on when we do rollouts.

To list all deployments, we can use the `get` command:

```bash
$ kubectl get deployment
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
hello   5/5     5            5           2m8s
```

The output is the same as when we were listing the ReplicaSets. When we create the deployment, controller also creates a ReplicaSet:

```bash
$ kubectl get rs
NAME               DESIRED   CURRENT   READY   AGE
hello-6fcbc8bc84   5         5         5       3m17s
```

Notice how the ReplicaSet name has the random string at the end. Finally, let's list the Pods:

```bash
$ kubectl get po
NAME                     READY   STATUS    RESTARTS   AGE
hello-6fcbc8bc84-27s2s   1/1     Running   0          4m2s
hello-6fcbc8bc84-49852   1/1     Running   0          4m1s
hello-6fcbc8bc84-7tpvs   1/1     Running   0          4m2s
hello-6fcbc8bc84-h7jwd   1/1     Running   0          4m1s
hello-6fcbc8bc84-prvpq   1/1     Running   0          4m2s
```

When we created a ReplicaSet previously, the Pods got named like this: `hello-fchvr`. However, this time, the Pod names are a bit longer - `hello-6fcbc8bc84-27s2s`. The random middle section in the name `6fcbc8bc84` corresponds to the random section of the ReplicaSet name, and the Pod names get created by combining the deployment name, ReplicaSet name, and a random string.

![Deployment, ReplicaSet, and Pod naming](/assets/course/6/k8s-deploy-rs-pod-naming.png)

Just like before, if we delete one of the Pods, the Deployment and ReplicaSet will make sure awalys to maintain the number of desired replicas:

```
$ kubectl delete po hello-6fcbc8bc84-27s2s
pod "hello-6fcbc8bc84-27s2s" deleted

$ kubectl get po
NAME                     READY   STATUS    RESTARTS   AGE
hello-6fcbc8bc84-49852   1/1     Running   0          46m
hello-6fcbc8bc84-58q7l   1/1     Running   0          15s
hello-6fcbc8bc84-7tpvs   1/1     Running   0          46m
hello-6fcbc8bc84-h7jwd   1/1     Running   0          46m
hello-6fcbc8bc84-prvpq   1/1     Running   0          46m
```

### How to scale the Pods up or down?

There's a handy command in Kubernetes CLI called `scale`. Using this command, we can scale up (or down) the number of Pods controlled by the Deployment or a ReplicaSet.

Let's scale the Pods down to three replicas:

```bash
$ kubectl scale deployment hello --replicas=3
deployment.apps/hello scaled

$ kubectl get po
NAME                     READY   STATUS    RESTARTS   AGE
hello-6fcbc8bc84-49852   1/1     Running   0          48m
hello-6fcbc8bc84-7tpvs   1/1     Running   0          48m
hello-6fcbc8bc84-h7jwd   1/1     Running   0          48m
```

Similarly, we can increase the number of replicas back to five, and ReplicaSet will create the Pods.

```bash
$ kubectl scale deployment hello --replicas=5
deployment.apps/hello scaled

$ kubectl get po
NAME                     READY   STATUS    RESTARTS   AGE
hello-6fcbc8bc84-49852   1/1     Running   0          49m
hello-6fcbc8bc84-7tpvs   1/1     Running   0          49m
hello-6fcbc8bc84-h7jwd   1/1     Running   0          49m
hello-6fcbc8bc84-kmmzh   1/1     Running   0          6s
hello-6fcbc8bc84-wfh8c   1/1     Running   0          6s
```

### Updating the Pod templates

When we were using a ReplicaSet we noticed that ReplicaSet did not automatically restart the Pods when we updated the image name. However, Deployment can do this.

Let's use the `set image` command to update the image in the Pod templates from `busybox` to `busybox:1.31.1`.

> You can use the `set` command to update the parts of the Pod template, such as image name, environment variables, resources, and a couple of others.

```bash
$ kubectl set image deployment hello hello-container=busybox:1.31.1 --record
deployment.apps/hello image updated
```

If you run the `kubectl get pods` right after you execute the `set` command, you might see something like this:

```bash
$ kubectl get po
NAME                     READY   STATUS        RESTARTS   AGE
hello-6fcbc8bc84-49852   1/1     Terminating   0          57m
hello-6fcbc8bc84-7tpvs   0/1     Terminating   0          57m
hello-6fcbc8bc84-h7jwd   1/1     Terminating   0          57m
hello-6fcbc8bc84-kmmzh   0/1     Terminating   0          7m15s
hello-84f59c54cd-8khwj   1/1     Running       0          36s
hello-84f59c54cd-fzcf2   1/1     Running       0          32s
hello-84f59c54cd-k947l   1/1     Running       0          33s
hello-84f59c54cd-r8cv7   1/1     Running       0          36s
hello-84f59c54cd-xd4hb   1/1     Running       0          35s
```

The controller terminated the Pods and has started five new Pods. Notice something else in the Pod names? The ReplicaSet section looks different, right? That's because Deployment scaled down the Pods controlled by the previous ReplicaSet and create a new ReplicaSet that uses the latest image we defined.

Remember that `--record` flag we set? We can now use `rollout history` command to view the previous rollouts.

```bash
$ kubectl rollout history deploy hello
deployment.apps/hello
REVISION  CHANGE-CAUSE
1         kubectl apply --filename=deployment.yaml --record=true
2         kubectl set image deployment hello hello-container=busybox:1.31.1 --record=true
```

The history command shows all revisions you made to the deployment. The first revision is when we initially created the resource and the second one is when we updated the image.

Let's say we rolled out this new image version, but for some reason, we want to go back to the previous state. Using the `rollout` command, we can also roll back to an earlier revision of the resource.

To roll back, you can use the `rollout undo` command, like this:

```bash
$ kubectl rollout undo deploy hello
deployment.apps/hello rolled back
```

With the undo command, we rolled back the changes to the previous revision, which is the original state we were in before we updated the image:

```bash
$ kubectl rollout history deploy hello
deployment.apps/hello
REVISION  CHANGE-CAUSE
2         kubectl set image deployment hello hello-container=busybox:1.31.1 --record=true
3         kubectl apply --filename=deployment.yaml --record=true
```

Let's remove the deployment by running:

```bash
$ kubectl delete deploy hello
deployment.apps "hello" deleted
```