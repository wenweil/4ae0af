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

  const previewText  = (cnt) => { // <= turn into function component?
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

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        {previewText( otherUser.unreadCount)}
        <Badge name='unreadCount' badgeContent = {otherUser.unreadCount} color = "primary" className={classes.unread}/>
      </Box>
    </Box>
  );
};

export default ChatContent;
