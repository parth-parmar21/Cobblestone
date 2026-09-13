import { k8sCoreApi } from "./config.js";

export const createPod = async (sandboxId) => {
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                app: "sandox",
                sandboxId: sandboxId
            }
        },
            spec: {
                containers: [{
                    name: "sandbox-container",
                    image: "template",
                    imagePullPolicy: "IfNotPresent",
                    ports: [{
                        name: "http",
                        containerPort: 5173
                    }],
                    resources: {
                        requests: {
                            cpu: "250m",
                            memory: "512Mi"
                        },
                        limits: {
                            cpu: "500m",
                            memory: "1Gi"
                        }
                    },
                }]
            }
        }

    const response = await k8sCoreApi.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    return response
}