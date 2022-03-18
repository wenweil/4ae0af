import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme, prop) => ({
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
  previewText:(prop) =>({
        fontSize: (prop.unreadCount && prop.unreadCount >= 1) ? 13 : 12,
        color: (prop.unreadCount && prop.unreadCount >= 1) ? "black" : "#9CADC8",
        fontWeight: (prop.unreadCount && prop.unreadCount >= 1) ? "bold" : "normal",
        letterSpacing: -0.17,
  }), 
  unread:{
    position:'absolute',
    right: '10%',
    top: '50%',
  }

}));

const ChatContent = ({ conversation }) => {
  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  const prop = {
    unreadCount:otherUser.unreadCount,
  };

  const classes = useStyles(prop);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>{latestMessageText}</Typography>
        <Badge name='unreadCount' badgeContent = {otherUser.unreadCount} color = "primary" className={classes.unread}/>
      </Box>
    </Box>
  );
};

export default ChatContent;
