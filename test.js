const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function XW(resolver) {
  this.state = PENDING;
  this.value = undefined;
  this.reason = undefined;
  this.onFulfilledCallback = [];
  this.onRejectedCallback = [];
  const resolve = (value) => {
    this.state = FULFILLED;
    this.value = value;
  };

  const reject = (err) => {
    this.state = REJECTED;
    this.reason = err;
  };
  resolver(resolve, reject);
}

XW.prototype.then = function (onFulfilled, onRejected) {
  if (this.state === FULFILLED) {
    onFulfilled(this.value);
  } else if (this.state === REJECTED) {
    onRejected(this.reason);
  } else {
  }
};

const b = new XW((res, rej) => {
  setTimeout(() => {
    rej(33);
  }, 0);
});

b.then(
  (v) => {
    console.log(v);
  },
  (err) => {
    console.log(err);
  }
);

b.then(() => {});
