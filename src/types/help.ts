
export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface Guide {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}
