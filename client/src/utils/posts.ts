export interface PostData {
  title: string;
  author: string;
  description: string;
  links: string;
  id?: string;
}

// TODO: Delete Post => Cloud Function to delete associated comments
