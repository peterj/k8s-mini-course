---
id: "8"
order: 8
title: 'About ReplicaSets'
excerpt: 'What are ReplicaSets?'
coverImage: ''
module: ''
videoId: 'PgvKGRYUgeY'
duration: '02:44'
---

## Managing Pods with ReplicaSets

The job of a ReplicaSet is to maintain a stable number of Pod copies. The term used to represents the number of Pods is **replicas**. The ReplicaSet controller guarantees that a specified number of identical Pods (or replicas) is running . The number of replicas is controlled by the `replicas` field in the Pod resource definition.

Let's say you start with a single Pod, and you want to scale to five Pods. The single Pod is the current state in the cluster, and the five Pods is the desired state. The ReplicaSet controller uses the current and desired state and goes to create four more Pods to meet the desired state (five pods). The ReplicaSet also keeps an eye on the Pods. If you scale the Pod up or down (add a Pod replica or remove a Pod replica), the ReplicaSet does the necessary to meet the desired number of replicas. To create the Pods, the ReplicaSet uses the Pod template that's part of the resource definition.

**But how does ReplicaSet know which Pods to watch and control?**

To explain that, let's look at how the ReplicaSet gets defined:

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

Every Pod that's created by a ReplicaSet has a field called `metadata.ownerReferences`. This field specifies which ReplicaSet owns the Pod. When you delete a Pod, the ReplicaSet that owns it will know about it and act accordingly (i.e., re-creates the Pod).

The ReplicaSet also uses the `selector` object and `matchLabel` to check for any new Pods that it might own. If there's a new Pod that matches the selector labels and it doesn't have an owner reference, or the owner is not a controller (i.e., if we manually created a pod), the ReplicaSet will take it over and start controlling it.

![ReplicaSet details](/assets/course/3/k8s-replicaset.png)