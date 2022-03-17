import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
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
  previewTextUnread: {
    fontSize: 13,
    fontWeight: "bold",
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
    right: '10%',
    top: '50%',
  }

}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const isTyping  = (typing,cnt) => { // <= turn into function component?
    if(typing === true){
      return (
        <Typography className={classes.typingText}>
          Typing...
        </Typography>
        
    )} else {
      if(cnt && cnt >= 1){
        return (
          <Typography className={classes.previewTextUnread}>
              {latestMessageText}
          </Typography>
        )
      }else{
        return(
          <Typography className={classes.previewText}>
            {latestMessageText}
          </Typography>
        )
      }
    };
  };

  const countUnread = (cnt) =>{ // <= same as above
    return (<Badge name='unreadCount' badgeContent = {cnt} color = "primary" className={classes.unread}/>)
  }

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        {isTyping(otherUser.Typing, otherUser.unreadCount)}
        {countUnread(otherUser.unreadCount)}
      </Box>
    </Box>
  );
};

export default ChatContent;
