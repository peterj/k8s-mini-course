---
id: "1"
order: 1
title: 'Kubernetes Introduction'
excerpt: 'What is container orchestration and Kubernetes.'
coverImage: ''
module: 'Getting Started'
videoId: ''
duration: ''
---

## What is container orchestration?

Containers are everywhere these days. People use tools such as [Docker](https://docker.com) for packaging anything from applications to databases. With the growing popularity of microservice architecture and moving away from the monolithic applications, a monolith application is now a collection of multiple smaller services.

Managing a single application has its issues and challenges, let alone managing tens of smaller services that have to work together. You need a way to automate and manage your deployments, figure out how to scale individual services, use the network, connect them, and so on.

The container orchestration can help you do this. Container orchestration can help you manage the lifecycles of your containers. Using a container orchestration system allows you to do the following:

- Provision and deploy containers based on available resources
- Perform health monitoring on containers
- Load balancing and service discovery
- Allocate resources between different containers
- Scaling the containers up and down

A couple of examples of container orchestrators are [Marathon](https://mesosphere.github.io/marathon/), [Swarm](https://docs.docker.com/get-started/swarm-deploy/) and the one discussed in this course, [Kubernetes](https://kubernetes.io).

[Kubernetes](https://kubernetes.io) is an open-source project and one of the popular choices for cluster management and scheduling container-centric workloads. You can use Kubernetes to run your containers, do zero-downtime deployments where you can update your application without impacting your users, and bunch of other cool stuff.

![Kubernetes Numerony](/assets/course/1/k8s-numeronym.png)

>Frequently, people refer to Kubernetes as "K8S". K8S is a **numeronym** for Kubernetes. The first (K) and the last letter (S) are the first, and the last letters in the word Kubernetes, and 8 is the number of characters between those two letters. Other popular numeronyms are "i18n" for internationalization or "a11y" for accessibility.
