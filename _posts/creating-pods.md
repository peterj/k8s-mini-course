---
id: "7"
order: 7
title: 'Creating Pods'
excerpt: 'How to create Pods'
coverImage: ''
module: ''
videoId: 'n2iN9Gl1zfM'
duration: '5:20'
---

## Creating Pods

Usually, you shouldn't be creating Pods manually. You can do it, but you really should not. The reason being is that if the Pod crashes or if it gets deleted, it will be gone forever. That said, throughout this book, we will be creating Pods directly for the sake of simplicity and purposes of learning and explaining different concepts. However, if you're planning to run your applications inside Kubernetes, make sure you aren't creating Pods manually. 

Let's look at how a single Pod can be defined using YAML.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-pod
  labels:
    app.kubernetes.io/name: hello
spec:
  containers:
    - name: hello-container
      image: busybox
      command: ["sh", "-c", "echo Hello from my container! && sleep 3600"]
```

In the first couple of lines, we define the kind of resource (`Pod`) and the metadata. The metadata includes the name of our Pod (`hello-pod`) and a set of labels that are simple key-value pairs (`app.kubernetes.io/name=hello`).

In the `spec` section, we are describing how the Pod should look. We will have a single container inside this Pod, called `hello-container`, and it will run the image called `busybox`. When the container starts, it executes the command defined in the `command` field.

To create the Pod, you can save the above YAML to a file called `pod.yaml`. Then, you can use Kubernetes CLI (`kubectl`) to create the Pod:

```bash
$ kubectl apply -f pod.yaml
pod/hello-pod created
```

Kubernetes responds with the resource type and the name it created. You can use `kubectl get pods` to get a list of all Pods running the `default` namespace of the cluster.

```bash
$ kubectl get pods
NAME        READY   STATUS    RESTARTS   AGE
hello-pod   1/1     Running   0          7s
```

You can use the `logs` command to see the output from the container running inside the Pod:

```bash
$ kubectl logs hello-pod
Hello from my container!
```

> When you have multiple containers running inside the same Pod, you can use the `-c` flag to specify the container name whose logs you want to get. For example: `kubectl logs hello-pod -c hello-container`

If we delete this Pod using `kubectl delete pod hello-pod`, the Pod will be gone forever. There's nothing that would automatically restart it. If you run the `kubectl get pods` again, you will notice the Pod is gone:

```bash
$ kubectl get pods
No resources found in default namespace.
```

Not automatically recreating the Pod is the opposite of the behavior you want. If you have your containers running in a Pod, you would want Kubernetes to reschedule and restart them if something goes wrong automatically.

To make sure the crashed Pods get restarted, you need a **controller** to manage the Pods' lifecycle. This controller automatically reschedules your Pod if it gets deleted or if something terrible happens (cluster nodes go down and Kubernetes need to evict the Pods).
