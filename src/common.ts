export enum PublishType {
  VIDEO = 'video', // 视频
  ARTICLE = 'article',
}

export interface NewPublishData {
  flowId?: string;
  accountId: string;
  title: string;
  desc?: string;
  type: PublishType;
  videoUrl?: string;
  coverUrl: string;
  imgUrlList?: string[];
  publishTime?: string;
  topics: string;
}


export interface SkKeyRefAccount {
  key: string;
  accountId: string;
  accountType: string;
  id: string;
}