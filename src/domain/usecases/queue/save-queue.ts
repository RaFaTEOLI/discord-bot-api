export type SaveQueueParams = [
  {
    name: string;
    author: string;
    url: string;
    thumbnail: string;
    duration: string;
  }
];

export interface SaveMusic {
  save: (songs: SaveQueueParams) => Promise<void>;
}
