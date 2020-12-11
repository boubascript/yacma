import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { PostData } from "utils/posts"; // TODO: Put Interfaces in single file?
import { CommentData } from "utils/comments";
import { Button, Card, CardHeader, Container, IconButton, Typography} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {makeStyles} from '@material-ui/core/styles';
import Comment from "pages/Comment";
import NewComment from "pages/NewComment";
import NewPost from "pages/NewPost";
import { UserContext } from "utils/auth";
import "App.css";

const useStyles = makeStyles({
  button: {
    marginLeft: '15%',
    marginRight: '15%',
    marginTop:'20px'
  },
  postCard: {
    width:'80%',
    minWidth: 350,
    margin:'auto',
    marginTop: '25px',
    padding:'30px',
    paddingTop:'10px',
    textAlign:'left'
  },
})

interface PostProps {
  courseId: string;
  post: PostData;
  refresh: Function;
  onDelete: () => void;
}

const Post: React.FunctionComponent<PostProps> = ({
  courseId,
  post,
  refresh,
  onDelete,
}) => {
  const { user, userData } = useContext(UserContext);
  const { author, title, description, links, id } = post;
  const [comments, setComments] = useState<CommentData[]>([]);
  const [addingComment, setAddingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingPost, setUpdatingPost] = useState(false);

  const getAllComments = async () => {
    if (id) {
      const { data: commentsData } = await axios.get(
        `comments/${courseId}/posts/${id}/comments`,
        {
          params: {
            courseId: courseId,
            postId: id,
          },
        }
      );
      setComments(commentsData);
    }
  };

  const remove = async () => {
    setIsDeleting(true);
    onDelete();
  };

  useEffect(() => {
    if (id) {
      getAllComments();
    }
  }, [id]);

  const handleNewComment = () => {
    setAddingComment(true);
  };

  const toggleUpdatePost = (exit: boolean) => {
    setUpdatingPost(exit);
  };

  const toggleNewComment = (exit: boolean) => {
    setAddingComment(exit);
  };

  // TODO: Find a better way to do this
  const refreshComments = async () => {
    getAllComments();
  };

  const classes = useStyles();

  const FileDisplay = (links:string) => {
    if(!links){
      return;
    }
    const extension = links.split('.').pop();
    if(!extension){
      return;
    }
    const images = ['jpg', 'jpeg', 'png']
    if(images.includes(extension)){
      return (
        <div style={{textAlign:'center'}}>
          <img src={links} title={`image${links}`}></img>
        </div>
      )
    }
    const videos = ['mp4', 'mov']
    if(videos.includes(extension)){
      return (
        <div style={{textAlign:'center'}}>
        <video width="80%" controls>
          <source src={links} type="video/mp4" />
          Your browser does not support HTML video.
        </video>
        </div>
      )
    }
    return (
      <>
        <Typography variant="subtitle1">
            Attached:
        </Typography>
        <Typography variant="subtitle1">
          <a href={links}>{links}</a>
        </Typography>
      </>
    )
  }


  return (
    <>
      <Container>
        {!updatingPost ? (
          <>
            <Card className={classes.postCard}>
              <div style={{marginTop: '20px', borderColor:'#3f51b5', borderStyle:'solid', borderWidth:'2px', borderRadius:'5px', height:'50px'}}>
                  <div style={{float:'left', display:'flex', marginTop:'5px', marginLeft:'10px'}}>
                    <Typography variant="h4">
                      {title}
                    </Typography>
                    <Typography style={{marginTop:'13px', marginLeft:'10px'}} variant="subtitle1" color="textSecondary">
                      By {author}
                    </Typography>
                  </div>
                  {userData?.firstName + " " + userData?.lastName === author && (
                    <>
                      <IconButton aria-label="settings"  onClick={remove} style={{float:'right'}}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton aria-label="settings" onClick={() => toggleUpdatePost(true)}style={{float:'right'}}>
                        <EditIcon />
                      </IconButton>
                    </>
                  )}
              </div>
              <p>{description}</p>
              
              {FileDisplay(links)}

              <div className="comments">
                {id &&
                  comments &&
                  comments.map((doc, index) => (
                    <Comment
                      key={index}
                      courseId={courseId}
                      postId={id}
                      commentData={doc}
                      refresh={refreshComments}
                    />
                  ))}
              </div>
              {!addingComment ? (
                <div style={{textAlign:'center'}}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNewComment}
                  >
                    Add Comment
                  </Button>
                </div>
              ) : (
                id && (
                  <NewComment
                    courseId={courseId}
                    postId={id}
                    exit={toggleNewComment}
                    refresh={refreshComments}
                  />
                )
              )}
            </Card>
          </>
        ) : (
          <NewPost
            courseId={courseId}
            exit={toggleUpdatePost}
            refresh={refresh}
            postId={id}
            post={post}
          />
        )}
      </Container>
    </>
  );
};

export default Post;
