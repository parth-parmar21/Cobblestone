import { k8sCoreApi } from "./config.js"

export const createService = async (sandboxId) => {
    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                app: "sandox",
                sandboxId: sandboxId
            }
        },
        spec:{
            selector: {
                app: "sandox",
                sandboxId: sandboxId
            },
            ports: [{
                name: "http",
                port: 80,
                targetPort: 5173,
                protocol: "TCP"
            }, {
                name: "agent-http",
                port: 3000,
                targetPort: 3000,
                protocol: "TCP"
            }]
        },
        type: "ClusterIP"
    }

    const response = await k8sCoreApi.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    })

    return response

}