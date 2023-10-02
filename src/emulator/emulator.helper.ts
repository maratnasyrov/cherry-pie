const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const randomName = () => {
  const nameLength = Math.floor(Math.random() * 6) + 5;
  let result = '';
  for (let i = 0; i < nameLength; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return 'result';
};
