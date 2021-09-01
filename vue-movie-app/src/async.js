// 순서대로 동작하는 동기 방식
function a() {
  console.log('a');
}

function b() {
  console.log('b');
}

a();
b();
/*
a
b
*/

// 동기 방식에서 시간 지연에 따른 문제 발생
function a() {
  setTimeout(function() {
    console.log('a');
  }, 1000); // 1초
}

function b() {
  console.log('b');
}

a();
b();
/*
b
a
*/

// 콜백(Callback) 함수를 사용하여 해결 (실행 순서 보장)
function a(cb) {
  setTimeout(function() {
    console.log('a');
    cb();
  }, 1000);
}

function b() {
  console.log('b');
}

a(function() {
  b();
});
/*
a
b
*/

// 콜백 함수는 콜백 지옥(Callback Hell)이 될 수 있음
function a(cb) {
  setTimeout(function() {
    console.log('a');
    cb();
  }, 1000);
}

function b(cb) {
  setTimeout(function() {
    console.log('b');
    cb();
  }, 1000);
}

function c(cb) {
  setTimeout(function() {
    console.log('c');
    cb();
  }, 1000);
}

function d(cb) {
  setTimeout(function() {
    console.log('d');
    cb();
  }, 1000);
}

a(function() {
  b(function() {
    c(function() {
      d(function() {
        // ...
      });
    });
  });
});

// Promise 객체(생성자)를 사용
// Then을 사용
function a() {
  return new Promise(resolve => {
    setTimeout(function() {
      console.log('a');
      resolve();
    }, 1000);
  });
}

function b() {
  return new Promise(resolve => {
    setTimeout(function() {
      console.log('b');
      resolve();
    }, 1000);
  });
}

function c() {
  return new Promise(resolve => {
    setTimeout(function() {
      console.log('c');
      resolve();
    }, 1000);
  });
}

function d() {
  return new Promise(resolve => {
    setTimeout(function() {
      console.log('d');
      resolve();
    }, 1000);
  });
}

a()
  .then(() => b()) // return 필수! `.then(function () { return b(); })`와 같음!
  .then(() => c())
  .then(() => d());
// ...

// Async/Await를 사용
async function asyncFunc() {
  await a();
  await b();
  await c();
  await d();
  // ...
}
asyncFunc();

// Then을 사용해서 Try/Catch/Finally
function a() {
  return new Promise((resolve, reject) => {
    if (isError) {
      reject(ERROR_OBJECT);
    }
    setTimeout(() => {
      console.log('a');
      resolve(MY_DATA);
    }, 1000);
  });
}

a()
  .then(res => {
    console.log(res); // res is MY_DATA
  })
  .catch(err => {
    console.log(err.message); // err is ERROR_OBJECT
  })
  .finally(() => {
    console.log('done');
  });

// Async/Await를 사용해서 Try/Catch/Finally
async function asyncFunc() {
  try {
    const res = await a();
    console.log(res); // res is MY_DATA
  } catch (err) {
    console.log(err.message); // err is ERROR_OBJECT
  } finally {
    console.log('done');
  }
}
asyncFunc();
