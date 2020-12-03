---
id: "5"
order: 5
title: 'Labels and Annotations'
excerpt: 'About Labels, Selectors, and Annotations'
coverImage: ''
module: ''
videoId: ''
duration: ''
---

## Labels and selectors

You can use labels (key/value pairs) to label resources in Kubernetes. They are used to organize, query, and select objects and attach identifying metadata to them. You can specify labels at creation time or add, remove, or update them later after you've created the resource.

![Kubernetes Labels](/assets/course/basic/k8s-labels.png)

The labels have two parts: the key name and the value. The key name can have an optional prefix and the name, separated by a slash (`/`). 

The `startkuberenetes.com` portion in the figure is the optional prefix, and the key name is `app-name`. The prefix, if specified, must be a series of DNS labels separated by dots (`.`). It can't be longer than 253 characters.

The key name portion is required and must be 63 characters or less. It has to start and end with an alphanumeric character. The key name is made of alphanumerical values and can include dashes (`-`), underscores (`_`), and dots (`.`).

Just like the key name, a valid label value must be 63 characters or less. It can be empty or being and end with an alphanumeric character and can include dashes (`-`), underscores (`_`), and dots (`.`).

Here's an example of a couple of valid labels on a Kubernetes resource:

```yaml
metadata:
  labels:
    startkubernetes.com/app-name: my-application
    blog.startkubernetes.com/version: 1.0.0
    env: staging-us-west
    owner: ricky
    department: AB1
```

**Selectors** are used to query for a set of Kubernetes resources. For example, you could use a selector to identify all Kubernetes cluster objects with a label `env` set to `staging-us-west`. You could write that selector as `env = staging-us-west`. This selector is called an equality-based selector.

Selectors also support multiple requirements. For example, we could query for all resources with the `env` label set to `staging-us-west` and are not of version `1.0.0`. The requirements have to be separated by commas that act as a logical AND operator. We could write the above two requirements like this: `env = staging-us-west, blog.startkubernetes.com/version != 1.0.0`.

The second type of selector is called set-based selectors. These selectors allow filtering label keys based on a set of values. The following three operators are supported: `in`, `notin`, and `exists`. Here's an example:

```text
env in (staging-us-west,staging-us-east)
owner notin (ricky, peter)
department
department!
```

The first example selects all objects with the `env` label set to either `staging-us-west` or `staging-us-east`. The second example uses the `notin` operator and selects all objects where the `owner` label values are not `ricky` or `peter`. The third example selects all objects with a `department` label set, regardless of it's value, and the last example selects all objects without the `department` label set.

Later on, we will see the practical use of labels and selectors when discussing how Kubernetes services know which pods to include in their load balancing pools.

Labeling resources is essential, so make sure you take your time to decide on the core set of labels you will use in your organization. Setting labels on all resources make it easier to do bulk operations against them later on.

Kubernetes provides a list of recommended labels that share a common prefix `app.kubernetes.io`:

| Name | Value | Description |
| --- | --- | --- |
| `app.kubernetes.io/name` | my-app | Application name |
| `app.kubernetes.io/instance` | my-app-1122233 | Identifying instance of the application |
| `app.kubernetes.io/version` | 1.2.3 | Application version |
| `app.kubernetes.io/component`| website | The name of the component|
| `app.kubernetes.io/part-of` | carts | The name of the higher-level application this component is part of |
| `app.kubernetes.io/managed-by` | helm | The tools used for managing the application |

Additionally, you could create an maintain a list of your own labels:

- Project ID ({carts-project-123})
- Owner ({Ricky}, {Peter}, or {team-a}, {team-b}, ...)
- Environment ({dev}, {test}, {staging}, {prod})
- Release identifer ({release-1.0.0})
- Tier ({backend}, {frontend})


## Annotations

Annotations are similar to labels as they also add metadata to Kubernetes objects. However, you don't use annotations for identifying and selecting objects. The annotations allow you to add non-identifying metadata to Kubernetes objects. Examples would be information needed for debugging, emails, or contact information of the on-call engineering team, port numbers or URL paths used by monitoring or logging systems, and any other information that might be used by the client tools or DevOps teams.

For example, annotations are used by ingress controllers to claim the Ingress resource.

Similar to labels, annotations are key/value pairs. The key name has two parts and the same rules apply as with the label key names.

However, the annotation values can be both structured or unstructured and can include characters that are not valid in the labels.

```yaml
metadata:
  annotations:
    startkubernetes.com/debug-info: | 
      { "debugTool": "sometoolname", "portNumber": "1234", "email": "hello@example.com" } 
```

The above example defines an annotation called `startkubernetes.com/debug-info` that contains a JSON string.