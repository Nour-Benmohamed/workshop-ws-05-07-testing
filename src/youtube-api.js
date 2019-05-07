import axios from 'axios';
import { each } from 'async';

const STATISTICS_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

const API_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyBOzttTd95DoFsb-I9ID6iGfsX0-p2af-M';

export const viewCountByVideo = (videoId) => {
  const params = {
    key: API_KEY,
    id: videoId,
    part: 'statistics',
  };
  return new Promise((resolve, reject) => {
    axios.get(STATISTICS_API_URL, { params })
      .then((response) => {
        resolve(Number(response.data.items[0].statistics.viewCount));
      })
      .catch((error) => {
        console.log(`youtube statistics api error: ${error}`);
        reject(error);
      });
  });
};

export const youtubeSearch = (term) => {
  const params = {
    key: API_KEY,
    q: term,
    type: 'video',
    part: 'snippet',
  };
  return new Promise((resolve, reject) => {
    axios.get(API_URL, { params })
      .then((response) => {
        let totalViewCounter = 0;
        each(response.data.items, (item, callback) => {
          viewCountByVideo(item.id.videoId).then((views) => {
            totalViewCounter += Number(views);
            callback();
          });
        },
        (err) => {
          resolve({
            all: response.data.items,
            totalViews: totalViewCounter,
          });
        });
      });
  });
};

