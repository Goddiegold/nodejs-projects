const API_URL = 'http://localhost:8000'

// Load planets and return as JSON.
async function httpGetPlanets() {
  try {
    const response = await fetch(`${API_URL}/planets`);
    const fetchedResponse = await response.json();
    return fetchedResponse.sort((a, b) => {
      return a.flightNumber - b.flightNumber;
    });
  } catch (error) {
    console.log(error);
  }
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  try {
    const response = await fetch(`${API_URL}/launches`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }  
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};