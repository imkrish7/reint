const serviceBusNamespace = "elexon-insights-iris";
const queueName = "iris.89a8bbcb-9cc2-41ea-833f-833b47ad9e9c"
const downloadDirectory = "./data";
const tenantId = "4203b7a0-7773-4de5-b830-8b263a20426e"; // Elexon Products and Services Tenant Id

if (!serviceBusNamespace) {
    throw new Error("Invalid configuration value: SERVICE_BUS_NAMESPACE is required");
}

if (!queueName) {
    throw new Error("Invalid configuration value: QUEUE_NAME is required");
}

if (!downloadDirectory) {
    throw new Error("Invalid configuration value: RELATIVE_FILE_DOWNLOAD_DIRECTORY is required");
}

if (!process.env.CLIENT_ID !== !process.env.SECRET) {
    throw new Error("Invalid configuration value(s): If one of CLIENT_ID and SECRET is provided, both are required")
}

const appRegistration ={
        clientId:"c4b940aa-0818-4914-aea2-8a3aafbdb8c9",
        secret: "RS28Q~TdnNhPDYLvMoDSjOM.FhZvogY_Ei_Hla9t",
      }

const fullyQualifiedNamespace = `${serviceBusNamespace}.servicebus.windows.net`;

 const config = {
  serviceBusNamespace,
  fullyQualifiedNamespace,
  queueName,
  tenantId,
  appRegistration, 
  downloadDirectory,
};

export default config;