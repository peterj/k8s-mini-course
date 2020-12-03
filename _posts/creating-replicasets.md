---
id: "9"
order: 9
title: 'Creating ReplicaSets'
excerpt: 'How to create and use ReplicaSets'
coverImage: ''
module: ''
videoId: 'RcxQfQjxD_4'
duration: '12:25'
---

Let's start by creating the following ReplicaSet:

```yaml
```yaml
apiVersion: apps/v1
kind: ReplicaSet
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
          command: ['sh', '-c', 'echo Hello from my container! && sleep 3600']
```

Save the above contents in `replicaset.yaml` file and run:

```bash
$ kubectl apply -f replicaset.yaml
replicaset.apps/hello created
```

You can view the ReplicaSet by running the following command:

```bash
$ kubectl get replicaset
NAME    DESIRED   CURRENT   READY   AGE
hello   5         5         5       30s
```

The command will show you the name of the ReplicaSet and the number of desired, current, and ready Pod replicas. If you list the Pods, you will notice that five Pods are running:

```bash
$ kubectl get po
NAME          READY   STATUS    RESTARTS   AGE
hello-dwx89   1/1     Running   0          31s
hello-fchvr   1/1     Running   0          31s
hello-fl6hd   1/1     Running   0          31s
hello-n667q   1/1     Running   0          31s
hello-rftkf   1/1     Running   0          31s
```

You can also list the Pods by their labels. For example, if you run `kubectl get po -l=app.kubernetes.io/name=hello`, you will get all Pods that have `app.kubernetes.io/name: hello` label set. The output includes the five Pods we created.

Let's also look at the `ownerReferences` field. We can use the `-o yaml` flag to get the YAML representation of any object in Kubernetes. Once we get the YAML, we will search for the `ownerReferences` string:

```bash
$ kubectl get po hello-dwx89 -o yaml | grep -A5 ownerReferences
...
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: hello
```

In the `ownerReferences`, Kubernetes sets the `name` to `hello`, and the `kind` to `ReplicaSet`. The name corresponds to the ReplicaSet that owns the Pod.

NOTE: Notice how we used `po` in the command to refer to Pods? Some Kubernetes resources have short names you can use in place of the 'full names'. You can use `po` when you mean `pods` or `deploy` when you mean `deployment`. To get the full list of supported short names, you can run `kubectl api-resources`.

Another thing you will notice is how the Pods are named. Previously, where we were creating a single Pod directly, the name of the Pod was `hello-pod`, because that's what we specified in the YAML. When using the ReplicaSet, Pods are created using the combination of the ReplicaSet name (`hello`) and a semi-random string such as `dwx89`, `fchrv` and so on.

> Semi-random? Yes, Kubernetes maintainers removed the [vowels](https://github.com/kubernetes/kubernetes/pull/37225), and [numbers 0,1, and 3](https://github.com/kubernetes/kubernetes/pull/50070) to avoid creating 'bad words'.

Let's try and delete one of the Pods. To delete a resource from Kubernetes you use the `delete` keyword followed by the resource (e.g. `pod`) and the resource name `hello-dwx89`:

```yaml
$ kubectl delete po hello-dwx89
pod "hello-dwx89" deleted
```

Once you've deleted the Pod, you can run `kubectl get pods` again. Did you notice something? There are still five Pods running.

```bash
$ kubectl get po
NAME          READY   STATUS    RESTARTS   AGE
hello-fchvr   1/1     Running   0          14m
hello-fl6hd   1/1     Running   0          14m
hello-n667q   1/1     Running   0          14m
hello-rftkf   1/1     Running   0          14m
hello-vctkh   1/1     Running   0          48s
```

If you look at the `AGE` column, you will notice four Pods created 14 minutes ago and one created more recently. ReplicaSet created this new Pod. When we deleted one Pod, the number of actual replicas decreased from five to four. The replica set controller detected that and created a new Pod to match the replicas' desired number (5).

Let's try something different now. We will manually create a Pod with labels that match the ReplicaSets selector labels (`app.kubernetes.io/name: hello`).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: stray-pod
  labels:
    app.kubernetes.io/name: hello
spec:
  containers:
    - name: stray-pod-container
      image: busybox
      command: ["sh", "-c", "echo Hello from stray pod! && sleep 3600"]
```

Save the above YAML in the `stray-pod.yaml` file, then create the Pod by running:

```bash
$ kubectl apply -f stray-pod.yaml
pod/stray-pod created
```

The Pod gets created, and all looks good. However, if you run `kubectl get pods` you will notice that the `stray-pod` has dissapeared. What happened?

The ReplicaSet makes sure only five Pod replicas are running. When we manually created the `stray-pod` with the label `app.kubernetes.io/name=hello` that matches the selector label on the ReplicaSet, the ReplicaSet took that new Pod for its own. Remember, manually created Pod didn't have the owner. With this new Pod under ReplicaSets' management, the number of replicas was six and not five, as stated in the ReplicaSet. Therefore, the ReplicaSet did what it's supposed to do; it deleted the new Pod to maintain the desired state of five replicas.

### Zero-downtime updates?

I mentioned zero-downtime deployments and updates earlier. How can that be done using a replica set? Well, it you can't do it with a replica set. At least not in a zero-downtime manner.

Let's say we want to change the Docker image used in the original replica set from `busybox` to `busybox:1.31.1`. We could use `kubectl edit rs hello` to open the replica set YAML in the editor, then update the image value.  

Once you save the changes - nothing will happen. Five Pods will still keep running as if nothing has happened. Let's check the image used by one of the Pods:

```bash
$ kubectl describe po hello-fchvr | grep image
  Normal  Pulling    14m        kubelet, docker-desktop  Pulling image "busybox"
  Normal  Pulled     13m        kubelet, docker-desktop  Successfully pulled image "busybox"
```

Notice it's referencing the `busybox` image, but there's no sign of the `busybox:1.31.1` anywhere. Let's see what happens if we delete this same Pod:

```bash
$ kubectl delete po hello-fchvr
pod "hello-fchvr" deleted
```

We already know that ReplicaSet will bring up a new Pod (`hello-q8fnl` in our case) to match the desired replica count from the previous test we did. If we run `describe` against the new Pod that came up, you will notice how the image is changed this time:

```bash
$ kubectl describe po hello-q8fnl | grep image
  Normal  Pulling    74s        kubelet, docker-desktop  Pulling image "busybox:1.31"
  Normal  Pulled     73s        kubelet, docker-desktop  Successfully pulled image "busybox:1.31"
```

A similar thing will happen if we delete the other Pods that are still using the old image (`busybox`). The ReplicaSet would start new Pods, and this time, the Pods would use the new image `busybox:1.31.1`.

We can use another resource to manage the ReplicaSets, allowing us to update Pods in a controlled manner. Upon changing the image name, it can start Pods using the new image names in a controlled way. This resource is called a **Deployment**.

To delete all Pods, you need to delete the ReplicaSet by running: `kubectl delete rs hello`. `rs` is the short name for `replicaset`. If you list the Pods (`kubectl get po`) right after you issued the delete command, you will see the Pods getting terminated:

```bash
NAME          READY   STATUS        RESTARTS   AGE
hello-fchvr   1/1     Terminating   0          18m
hello-fl6hd   1/1     Terminating   0          18m
hello-n667q   1/1     Terminating   0          18m
hello-rftkf   1/1     Terminating   0          18m
hello-vctkh   1/1     Terminating   0          7m39s
```

Once the replica set terminates all Pods, they will be gone, and so will be the ReplicaSet.
