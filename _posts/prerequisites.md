---
id: "2"
order: 2
title: 'Prerequisites'
excerpt: 'What do I need?'
coverImage: ''
module: ''
videoId: ''
duration: ''
---

## What do I need to start with Kubernetes?

You'll get the most out of this mini-course if you follow along with the practical examples. To do that, you will need the following tools:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Access to a Kubernetes cluster. See "Which Kubernetes cluster should I use" below
- [Kubernetes CLI (`kubectl`)](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

## Which Kubernetes cluster should I use?

You have multiple choices. The most 'real-world' option would be to get a Kubernetes cluster from one cloud provider.  However, for numerous reasons, that might not be an option for everyone.

The next best option is to run a Kubernetes cluster on your computer. Assuming you have some memory and CPU to spare, you can use one of the following tools to run a single-node Kubernetes cluster on your computer:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
- [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)

You could go with any of the above options. Creating Kubernetes ReplicaSets, Deployments, and Pods works with any of them. You can also create Kubernetes Services. However, things get a bit complicated when you're trying to use a LoadBalancer service type.

With the cloud-managed cluster, creating a LoadBalancer service type creates an actual instance of the load balancer, and you would get an external/public IP address you can use to access your services.

The one solution from the above list closest to simulating the LoadBalancer service type is [Docker Desktop](https://www.docker.com/products/docker-desktop). With Docker Desktop your service gets exposed on an external IP, `localhost`. You can access these services using both [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) and [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/) as well; however, it requires you to run additional commands.

## Kubernetes and contexts

After you've installed one of these tools, make sure you download the [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/). Kubernetes CLI is a single binary called `kubectl`, and it allows you to run commands against your cluster. To make sure everything is working correctly, you can run `kubectl get nodes` to list all nodes in the Kubernetes cluster. The output from the command should look like this:

```bash
$ kubectl get nodes
NAME             STATUS   ROLES    AGE   VERSION
docker-desktop   Ready    master   63d   v1.16.6-beta.0
```

You can also check that the context is set correctly to `docker-desktop`. Kubernetes uses a configuration file called `config` to find the information it needs to connect to the cluster. Kubernetes CLI reads this file from your home folder - for example `$HOME/.kube/config`. Context is an element inside that config file, and it contains a reference to the cluster, namespace, and the user. If you're accessing or running a single cluster, you will only have one context in the config file. However, you can have multiple contexts defined that point to different clusters.

Using the `kubectl config` command, you can view these contexts and switch between them. You can run the `current-context` command to view the current context:

```bash
$ kubectl config current-context
docker-desktop
```

There are other commands such as `use-context`, `set-context`, `view-contexts`, etc. I prefer to use a tool called https://github.com/ahmetb/kubectx[`kubectx`]. This tool allows you to switch between different Kubernetes contexts quickly. For example, if I have three clusters (contexts) set in the config file, running `kubectx` outputs this:

```bash
$ kubectx
docker-desktop
peterj-cluster
minikube
```

The tool highlights the currently selected context when you run the command. To switch to the `minikube` context, I can run: `kubectx minikube`.

The equivalent commands you can run with `kubectl` would be `kubectl config get-contexts` to view all contexts, and `kubectl config use-context minikube` to switch the context.

Before you continue, make sure your context is set to `docker-desktop` if you're using Docker for Mac/Windows or `minikube` if you're using Minikube.

Let's get started with your journey to Kubernetes and cloud-native world with the container orchestration!