---
id: "6"
order: 6
title: 'About Pods'
excerpt: 'What are Kubernetes Pods?'
coverImage: ''
module: ''
videoId: 'B1_jgR3zuvA'
duration: '03:43'
---

## Working with Pods

Pods are probably one of the most common resources in Kubernetes. They are a collection of one or more containers. The containers within the Pod share the same network and storage. That means any containers within the same Pod can talk to each other through `localhost` and access the same Volumes.

You always design your Pods as temporary, disposable entities that can get deleted and rescheduled to run on different nodes. Whenever you or Kubernetes restart the Pod, you are also restarting containers within the Pod. 

![Kubernetes Pod](/assets/course/2/k8s-pod.png)

When created, each Pod gets assigned a unique IP address. The containers inside your Pod can listen to different ports. To access your containers, you can use the Pods' IP address. Using the example from the above figure, you could run `curl 10.1.0.1:3000` to talk to the one container and `curl 10.1.0.1:5000` to talk to the other container. However, if you wanted to talk between containers - for example, calling the top container from the bottom one, you could use `http://localhost:3000`.

If your Pod restarts, it will get a different IP address. Therefore, you cannot rely on the IP address. Talking to your Pods directly by the IP is not the right way to go.

An abstraction called a Kubernetes Service is what you can to communicate with your Pods. A Kubernetes Service gives you a stable IP address and DNS name. I'll talk about services later on.

### Scaling Pods

All containers within the Pod get scaled together. The figure below shows how scaling from a single Pod to four Pods would look like. Note that you cannot scale individual containers within the Pods. The Pod is the unit of scale, which means that whenever you scale a Pod, you will scale all containers inside the Pod as well.

![Kubernetes Pod scaling](/assets/course/2/k8s-pod-scaling.png)

WARNING: "Awesome! I can run my application and a database in the same Pod!!" No! Do not do that.

First, in most cases, your database will not scale at the same rate as your application. Remember, you're scaling a Pod and all containers inside that Pod, not just a single container.

Second, running a stateful workload in Kubernetes, such as a database, differs from running **stateless** workloads. For example, you need to ensure that data is persistent between Pod restarts and that the restarted Pods have the same network identity. You can use resources like persistent volumes and stateful sets to accomplish this.