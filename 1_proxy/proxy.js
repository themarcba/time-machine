console.log("Hello DevWorld 👋");

const product = { price: 6, quantity: 2 };
const proxy = new Proxy(product, {
  get(target, property) {
    console.log("🔎 get", property);
    return target[property];
  },

  set(target, property, value) {
    console.log("🔥 set", property, value);
    target[property] = value;
  },
});

console.log("💰", proxy.price);
proxy.price = 999;
console.log("💰", proxy.price);
