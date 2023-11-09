const Routes : Record<string, Record<string, string>> = {
  person: {
    base: "/persons",
    create: "/create",
    get: "/get",
    update: "/update",
    remove: "/remove",
  },
  user: {
    base: "/users",
    create: "/create",
    get: "/get",
    update: "/update",
    remove: "/remove",
    changePassword: "/change-password",
  },
  businesses: {
    base: "/businesses",
    create: "/create",
    get: "/get",
    update: "/update",
    remove: "/remove",
  },
  branches: {
    base: "/branches",
    create: "/create",
    get: "/get",
    update: "/update",
    remove: "/remove",
  },
  employees: {
    base: "/employees",
    create: "/create",
    get: "/get",
    update: "/update",
    remove: "/remove",
  },
  permissions: {
    base: "/permissions",
    create: "/create",
    get: "/get",
    update: "/update",
    remove: "/remove",
  },
  products: {
    base: "/products",
    create: "/create",
    get: "/get",
    update: "/update",
  },
  inventory: {
    base: "/inventory",
    create: "/create",
    get: "/get",
    update: "/update",
  },
  operation: {
    base: "/operation",
    create: "/create",
    get: "/get",
    update: "/update",
  },
};

export default Routes;
