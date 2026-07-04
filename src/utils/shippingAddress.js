export const buildFullShippingAddress = (streetAddress, wardName, provinceName) =>
  `${streetAddress.trim()},\n${wardName},\n${provinceName}`;

export const getShippingAddressStorageKey = (userId) =>
  `shippingAddress_${userId}`;

export const getSavedShippingAddress = (userId) => {
  if (!userId) return null;

  try {
    const saved = localStorage.getItem(getShippingAddressStorageKey(userId));
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveShippingAddress = (userId, address) => {
  if (!userId || !address) return;

  localStorage.setItem(
    getShippingAddressStorageKey(userId),
    JSON.stringify(address)
  );
};

export const resolveShippingAddress = (user) => {
  if (user?.shippingAddress?.provinceCode) {
    return user.shippingAddress;
  }

  return getSavedShippingAddress(user?.id);
};

export const formatShippingAddressDisplay = (customerInfo) => {
  if (!customerInfo) return "";

  if (customerInfo.fullShippingAddress) {
    return customerInfo.fullShippingAddress;
  }

  if (customerInfo.address) {
    return customerInfo.address;
  }

  const parts = [
    customerInfo.streetAddress,
    customerInfo.wardName,
    customerInfo.provinceName,
  ].filter(Boolean);

  return parts.join(", ");
};

export const emptyShippingAddress = () => ({
  provinceCode: "",
  provinceName: "",
  wardCode: "",
  wardName: "",
  streetAddress: "",
});
