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
            volumes: [
                {
                    name: "workspace-volume",
                    emptyDir: {}
                }
            ],
            initContainers: [
                {
                    name: "init-container",
                    image: "template",
                    imagePullPolicy: "IfNotPresent",

                    command: ["sh", "-c", "cp -r /workspace/. /seed/"],

                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/seed"
                        }
                    ]
                }
            ],
            containers: [
                {
                    name: "sandbox-container",
                    image: "template",
                    imagePullPolicy: "IfNotPresent",
                    ports: [{
                        name: "http",
                        containerPort: 5173
                    }
                    ],

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

                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                },
                {
                    name: "agent-container",
                    image: "agent",
                    imagePullPolicy: "IfNotPresent",

                    ports: [
                        {
                            containerPort: 3000,
                            name: "agent-http"
                        }
                    ],

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

                    volumeMounts: [
                        {
                            name: "workspace-volume",
                            mountPath: "/workspace"
                        }
                    ]
                }
            ]
        }
    }

    const response = await k8sCoreApi.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    return response
}