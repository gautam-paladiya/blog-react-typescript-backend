import express from "express";
import type { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import * as PostService from "./post.service";
import multer from "multer";

var upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const { originalname } = file;
      const fileExtension = (originalname.match(/\.+[\S]+$/) || [])[0];
      cb(null, `image_${Date.now()}${fileExtension}`);
    },
  }),
});
const postRouter = express.Router();

// GET: List all the posts
postRouter.get("/", async (request: Request, response: Response) => {
    try {
    // const errors = validationResult(request);
    // if (!errors.isEmpty()) {
    //   return response.status(400) .json({ errors: errors.array() });
    // }
    const search: string = request.query.search as string
    const limit:string  = request.query.limit as string
    const page:string  = request.query.page as string 
    console.log(search)    
    const data = await PostService.listPosts(search?.toLowerCase(),parseInt(limit),parseInt(page));
    return response.status(200).json(data);
  } catch (error: any) {
    return response.status(500).json({message:error.message});
  }
});

// GET: A post based on the slug
postRouter.get("/:slug", async (request: Request, response: Response) => {
  const slug: string = request.params.slug;
console.log(slug)
  try {
    const post = await PostService.getPost(slug);
    if (post) {
      return response.status(200).json(post);
    }
  } catch (error: any) {
    return response.status(500).json({message:error.message});
  }
});

// POST : create post

postRouter.post(
  "/",
  upload.single("file"),
  body("title").isString(),
  async (request: any, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
      try {
        const post = {...request.body,fileName:request.file.filename};
     const newPost = await PostService.createPost(post);
      return response.status(201).json(newPost);
    } catch (error: any) {
      return response.status(500).json({message:error.message});
    }
  }
);

// DELETE: delete post

postRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    await PostService.deletePost(id);
    return response.status(204).json("Book was successfully deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

export { postRouter}