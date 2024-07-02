import axios from 'axios';

export const fetchNotionPages = async () => {
  try {
    const response = await axios.get('https://port-0-myfunction-ly3nu14643e28c63.sel5.cloudtype.app/getNotion');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching pages from Notion:', error);
    return [];
  }
};
