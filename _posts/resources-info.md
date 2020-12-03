---
id: "4"
order: 4
title: 'Introduction'
excerpt: 'Kubernetes Resources'
coverImage: ''
module: 'Basic Resources'
videoId: ''
duration: ''
---

The Kubernetes API defines many objects called resources, such as namespaces, pods, services, secrets, config maps, etc.

Of course, you can also define your custom resources using the custom resource definition or CRD.

After you've configured Kubernetes CLI and your cluster, you should try and run `kubectl api-resources` command. It will list all defined resources - there will be a lot of them.

Resources in Kubernetes can be defined using YAML. People commonly use YAML (YAML Ain't Markup Language) for configuration files.  It is a superset of JSON format, which means you can also use JSON to describe Kubernetes resources.

Every Kubernetes resource has an `apiVersion` and `kind` fields to describe which version of the Kubernetes API you're using when creating the resource (for example, `apps/v1`) and what kind of a resource you are creating (for example, `Deployment`, `Pod`, `Service`, etc.).

The `metadata` includes the data that can help to identify the resource you are creating. Commonly found fields in the metadata section include the `name` (for example `mydeployment`) and the `namespace` where Kubernetes creats the resource. 

Other fields you can have in the metadata section are `labels` and `annotations`. Kubernetes also adds a couple of fields automatically after creating the resource (such as `creationTimestamp`, for example).