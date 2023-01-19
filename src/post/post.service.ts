import fs from "fs";
import dbJson from "../../db.json";

type typeImage = {
  src: string;
  alt: string;
};

type PostRead = {
  id: number;
  slug: string;
  image: typeImage;
  categories: string[];
  title: string;
  publishedAt: number;
  createdAt: number;
  author: string;
  body: string;
  estReadingTime: number;
};

type PostWrite = {
  fileName: string;
  title: string;
  author: string;
  description: string;
  time: string;
  categories: string;
  fileOriginalName: string;
};

export const listPosts = async (
  search?: string,
  limit: number = 6,
  page: number = 2
) => {
  return new Promise((resolve, reject) => {
    let allpost: PostRead[] = dbJson.posts as PostRead[];
    if (allpost.length > 0) {
      let resultPosts = allpost;
      if (search) {
        resultPosts = allpost.filter(
          (post) =>
            post.title.toLowerCase().includes(search) ||
            post.body.toLowerCase().includes(search)
        );
      }
      let startIndex = limit * (page - 1);
      let pagedPosts = resultPosts.slice(startIndex, startIndex + limit);
      resolve({ posts: pagedPosts, total: resultPosts.length });
    } else {
      reject([]);
    }
  });
};

export const getPost = async (slug: string): Promise<PostRead | null> => {
  return new Promise<PostRead>((resolve, reject) => {
    let post: PostRead = dbJson.posts.find(
      (post) => post.slug == slug
    ) as PostRead;
    if (post) {
      resolve(post);
    } else {
      reject([]);
    }
  });
};

export const createPost = async (post: PostWrite) => {
  try {
    const newPost: PostRead = {
      id: dbJson.posts.length + 1,
      slug: post.title.toLowerCase().split(" ").join("-"),
      image: {
        src: post.fileName,
        alt: post.fileOriginalName,
      },
      categories: post.categories.split(","),
      title: post.title,
      publishedAt: Date.now(),
      createdAt: Date.now(),
      author: post.author,
      body: post.description,
      estReadingTime: parseInt(post.time, 10),
    };
    dbJson.posts.push(newPost);
    fs.writeFileSync("db.json", JSON.stringify(dbJson));
    return newPost;
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    const deletedPosts = dbJson.posts.filter((post) => post.id != id);
    fs.writeFileSync("db.json", JSON.stringify(deletedPosts));
  } catch (error) {
    console.error(error);
  }
};
