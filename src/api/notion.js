import axios from 'axios';

export const fetchNotionPages = async () => {
  try {
    const response = await axios.get('http://localhost:8010/getNotion');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching pages from Notion:', error);
    return [];
  }
};
