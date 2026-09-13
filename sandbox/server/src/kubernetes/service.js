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
                port: 80,
                targetPort: 5173,
                name: "http",
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