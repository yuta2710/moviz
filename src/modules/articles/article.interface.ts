interface Multimedia {
  rank: number;
  subtype: string;
  caption: null | string;
  credit: null | string;
  type: string;
  url: string;
  height: number;
  width: number;
  legacy: {
    xlarge: string;
    xlargewidth: number;
    xlargeheight: number;
  };
  subType: string;
  crop_name: string;
}

interface BylinePerson {
  firstname: string;
  middlename: null | string;
  lastname: string;
  qualifier: null | string;
  title: null | string;
  role: string;
  organization: null | string;
  rank: number;
}

interface Byline {
  original: string;
  person: BylinePerson[];
  organization: null | string;
}

export interface ArticleProps {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  print_section: string;
  print_page: string;
  source: string;
  multimedia: Multimedia[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  byline: Byline;
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}
