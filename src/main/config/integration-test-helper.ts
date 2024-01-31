import { unlink, readFile } from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'loaded_routes.json');

export const cleanUpLoadedRoutes = async (): Promise<void> => {
  return await new Promise((resolve, reject) => {
    unlink(filePath, err => {
      if (err) {
        console.error(`Error deleting loaded_routes.json: ${err?.message}`);
        reject(err);
      }
      resolve();
    });
  });
};

export const loadRoutes = async (): Promise<string[]> => {
  return await new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      const parsedData = JSON.parse(data ?? '[]');
      resolve(parsedData);
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
