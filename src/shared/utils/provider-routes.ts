/** Trang chủ của Provider theo type — dùng ở login redirect và mọi gate route theo role. */
export function getProviderHomePath(providerType?: string): string {
  if (providerType === "TOUR") return "/my-tours";
  if (providerType === "ACTIVITY") return "/my-experiences";
  if (providerType === "TRANSPORT") return "/my-vehicles";
  return "/my-properties";
}
