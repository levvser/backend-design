import customServicesLoader from "./custom-services";

export default async ({ container }) => {
  await customServicesLoader({ container });
  // other loaders...
};
