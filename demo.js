const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const fetch = (num) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('请求完成');
      resolve(num);
    }, 5000);
  });
};
arr.forEach(async (item, index) => {
  await fetch(item);
  console.log('循环', index);
});
