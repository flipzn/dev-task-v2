
import fetch from 'node-fetch';

const TRIGGER_API_URL = 'https://contactapi.static.fyi/lead/trigger/fake/cran/';
const SERVER_URL =  process.env.TUNNEL_URL ?? 'http://localhost:3000';

console.log(SERVER_URL);

async function testEndToEnd() {
  console.log('--- Starting End-to-End Test ---');
  console.log('Triggering API to send a lead to our server...');

  try {
    const response = await fetch(TRIGGER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer FakeCustomerToken',
      },
      body: JSON.stringify({ url: SERVER_URL }),
    });

    const responseData = await response.json();

    console.log('Response from Trigger API:');
    console.log(responseData);

    if (response.ok) {
      console.log('\nSuccessfully triggered the API. Check the server logs to see how the lead was processed.');
      console.log('The server will log if the lead met the criteria (zipcode 66*** and house owner) and was sent, or if it was filtered out.');
    } else {
      console.error('\nFailed to trigger the API. The test server may not have been able to reach your local server.');
    }

  } catch (error) {
    console.error('\nAn error occurred during the test:', error);
  }
  console.log('--- End-to-End Test Complete ---');
}

testEndToEnd();
