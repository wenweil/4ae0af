import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
    position:'relative'
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  typingText:{
    fontSize: 12,
    letterSpacing: -0.17,
    fontStyle: "italic",
    animation:"$effect 1s infinite"
  },
  "@keyframes effect":{
    "0%":{color: "#A8A8A8",},
    "50%":{color: "#5e5e5e",},
    "100%":{color: "#A8A8A8",}
  },

  unread:{
    position:'absolute',
    backgroundColor:'#77a3e6',
    right: '10px',
    top: '10px',
    borderRadius:'10px',
    color:'white',
    display:'inline-block',
    minWidth:'20px',
    textAlign:'center',
  }

}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const isTyping  = (typing) => { // <= turn into function component?
    if(typing === true){
      return (
        <Typography className={classes.typingText}>
          Typing...
        </Typography>
        
    )} else {
      return(
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
    )};
  };

  const countUnread = (cnt) =>{ // <= same as above
    if(cnt && cnt >= 1){
      return (
        <Typography name='unreadCount' className={classes.unread}>
          {cnt}
        </Typography>
      );
    }else{
      return null;
    }
  }

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        {isTyping(otherUser.Typing)}
        {countUnread(otherUser.unreadCount)}
      </Box>
    </Box>
  );
};

export default ChatContent;
