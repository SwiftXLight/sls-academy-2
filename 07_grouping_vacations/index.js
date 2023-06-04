const axios = require('axios');

async function fetchData() {
  try {
    const response = await axios.get('https://jsonbase.com/sls-team/vacations');
    const originalData = response.data;
    
    const transformedData = originalData.reduce((result, vacation) => {
      const { user, startDate, endDate } = vacation;
      const existingUser = result.find((entry) => entry.userId === user._id);

      if (existingUser) {
        existingUser.vacations.push({ startDate, endDate });
      } else {
        result.push({
          userId: user._id,
          userName: user.name,
          vacations: [{ startDate, endDate }],
        });
      }

      return result;
    }, []);
    
    console.log(JSON.stringify(transformedData, null, 2));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
