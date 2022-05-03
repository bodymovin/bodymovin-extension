async function callApi() {
  const response = await fetch(
    // 'http://192.168.1.8:8080/api/index.json',
    'https://lottie-animation-community.web.app/api/index.json',
    {
      mode: 'no-cors',
    }
  );
  const jsonResponse = await response.json();
  return jsonResponse;
}

export default callApi;