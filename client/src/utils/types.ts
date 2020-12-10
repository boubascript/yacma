export interface CourseData {
  id?: string;
  code: string;
  name: string;
  description: string;
  educator: string;
}

export interface PostData {
  title: string;
  author: string;
  description: string;
  links: string;
  id?: string;
}

export interface CommentData {
  author: string;
  comment: string;
  id?: string;
}
