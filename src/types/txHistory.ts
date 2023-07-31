import axios from 'axios';

export const recursivelyFetchPaginatedResults = async (apiUrl: string, data: any) => {
  const dataList: any[] = [...data];

  while (apiUrl) {
    const response = await axios.get(apiUrl);
    const response_data = response.data;
    dataList.push(...response_data.results);
    apiUrl = response_data.next;
  }

  return dataList;
}