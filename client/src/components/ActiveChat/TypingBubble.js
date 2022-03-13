import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
    },
    avatar: {
      height: 30,
      width: 30,
      marginRight: 11,
      marginTop: 6,
    },
    usernameDate: {
      fontSize: 11,
      color: '#BECCE2',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    bubble: {
      backgroundImage: 'linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)',
      borderRadius: '0 10px 10px 10px',
    },
    text: {
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: -0.2,
      padding: 8,
      fontStyle:'italic',
      animation:'$effect 2s infinite',
    },
    "@keyframes effect":{
      "0%":{color: "#A8A8A8",},
      "50%":{color: "#5e5e5e",},
      "100%":{color: "#A8A8A8",}
    }
  }));

export const TypingBubble = ( {otherUser} ) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
        <Avatar
        alt={otherUser.username}
        src={otherUser.photoUrl}
        className={classes.avatar}
        />
        <Box>
            <Typography className={classes.usernameDate}>
                {otherUser.username}
            </Typography>
            <Box className={classes.bubble}>
                <Typography className={classes.text}>{otherUser.username} is typing....</Typography>
            </Box>
        </Box>
    </Box>
  )
}

export default TypingBubble;
