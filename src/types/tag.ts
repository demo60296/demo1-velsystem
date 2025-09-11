export interface Tags {
  tag: Tag;
  transactions: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface UpdateTagData {
  name: string;
}

export interface MergeTagData {
  tagId: string;
}