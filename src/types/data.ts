interface AcfImage {
  ID: number;
  id: number;
  title: string;
  url: string;
  alt: string;
}

export interface Page {
  acf:{hero?: AcfImage;};
}

export interface AboutPageData {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
  };
}