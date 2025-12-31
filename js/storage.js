// Storage utility using localStorage
window.storage = {
  get: async (key) => {
    const value = localStorage.getItem(key);
    return value ? { key, value, shared: false } : null;
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  delete: async (key) => {
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },
};
