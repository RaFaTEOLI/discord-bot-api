import { readFile } from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'loaded_routes.json');

export const loadRoutes = async (): Promise<string[]> => {
  return await new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      try {
        const parsedData = JSON.parse(data ?? '[]');
        resolve(parsedData);
      } catch (err) {
        console.error(err);
      }
    });
  });
};

export const isRouteLoaded = async (route: string): Promise<boolean> => {
  try {
    const loadedRoutes = await loadRoutes();
    return loadedRoutes.includes(route);
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const waitForRouteToLoad = async (route: string): Promise<void> => {
  return await new Promise(resolve => {
    const interval = setInterval(async () => {
      const loaded = await isRouteLoaded(route);
      if (loaded) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};
