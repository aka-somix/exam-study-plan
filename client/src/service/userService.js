const BASE_URL = new URL('http://localhost:3001/api');


async function logIn(credentials) {
  let response = await fetch(`${BASE_URL}/session`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(`${BASE_URL}/session/current`, { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
  const response = await fetch(`${BASE_URL}/session/current`, { credentials: 'include' });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}

const userService = { logIn, logOut, getUserInfo }

export default userService;