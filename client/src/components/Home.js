import React, { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { SocketContext } from '../context/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const socket = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post('/api/messages', body);
    return data;
  };


  const updateRead = useCallback( async (req) => {
    console.log(req)
    socket.emit('send-last-read',{
      id: req.id,
      message: req.message,
    });
    const body = {
      id:req.id,
      user:req.user,
      date:new Date(),
    }
    const { data } = await axios.post('/api/conversations', body);
    return data;
  },[socket])

  const sendMessage = (data, body) => {
    socket.emit('new-message', {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };

  const postMessage =async (body) => {
    try {
      const data =await saveMessage(body);
      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }

      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewConvo = useCallback(
    (recipientId, message) => {
      setConversations((prev) =>(
        prev.map( (convo) =>{
          if(convo.otherUser.id === recipientId){
            const convoCopy = {...convo};
            convoCopy.messages = [...convoCopy.messages,message];
            convoCopy.latestMessageText = message.text;
            convoCopy.id = message.conversationId;
            return convoCopy;
          }else{
            return convo;
          }
        })
      ));
    },
    [setConversations]
  );

  const addMessageToConversation = useCallback(
    (data) => {
      // if sender isn't null, that means the message needs to be put in a brand new convo
      const { message, sender = null } = data;
      if (sender !== null) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
        };
        if(message.senderId !== user.id)
          newConvo.lastReceived = message;
        newConvo.otherUser.unreadCount = 1;
        newConvo.latestMessageText = message.text;
        setConversations((prev) => [newConvo, ...prev]);
      }else{
        setConversations((prev) =>
          prev.map((convo) =>{
            if (convo.id === message.conversationId) {
              const convoCopy = { ...convo};
              convoCopy.messages = [...convoCopy.messages,message];
              convoCopy.latestMessageText = message.text;              
              if(message.senderId !== user.id)
                convoCopy.lastReceived = message;
              if(convoCopy.otherUser.username ===  activeConversation && user){
                const user = convoCopy.hasOwnProperty('user1') ? 1 : 2;
                const req = {
                  id:convoCopy.id,
                  user:user,
                  message:convoCopy.lastReceived,
                }
                updateRead(req);
              }
              convoCopy.otherUser.unreadCount = convoCopy.otherUser.username ===  activeConversation ? 0 : convoCopy.otherUser.unreadCount + 1;
              return convoCopy;
            }else{
              return convo
            }
          })
        );
      }
    },
    [setConversations, updateRead, user, activeConversation]
  );

  const setActiveChat = (convo) => {
    const user = convo.hasOwnProperty('user1') ? 1 : 2;
    const req = {
      id:convo.id,
      user:user,
      message:convo.lastReceived,
    };
    updateRead(req);
    convo.otherUser.unreadCount = 0;
    setActiveConversation(convo.otherUser.username);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const setLastRead = useCallback((data) => {
    console.log(data)
    setConversations((prev) =>
      prev.map((convo) => {
        if(convo !== null & convo.id === data.id){
          const convoCopy = {...convo};
          convoCopy.otherUser = {...convoCopy.otherUser, lastRead:data.message};
          console.log(convoCopy);
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  },[]);


  // Lifecycle

  useEffect(() => {
    // Socket init
    socket.on('add-online-user', addOnlineUser);
    socket.on('remove-offline-user', removeOfflineUser);
    socket.on('new-message', addMessageToConversation);
    socket.on('send-last-read',setLastRead);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('add-online-user', addOnlineUser);
      socket.off('remove-offline-user', removeOfflineUser);
      socket.off('new-message', addMessageToConversation);
      socket.off('send-last-read',setLastRead);
    };
  }, [addMessageToConversation, addOnlineUser, removeOfflineUser, setLastRead, socket]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push('/login');
      else history.push('/register');
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/conversations');
        data.map((convo) =>{
          convo.messages.reverse();
          const date = convo.hasOwnProperty('user1') ? convo.lastReadU1 : convo.lastReadU2;
          const date2 = convo.hasOwnProperty('user1') ? convo.lastReadU2 : convo.lastReadU1;
          let cnt = 0;
          let last = -1;
          let read = -1;
          convo.messages.map((message, index) =>{
            if(user.id !== message.senderId){
              if(!(date !== null & message.createdAt <= date))
                cnt = cnt + 1;
              last = last > index ? last : index;
            }else{
              if(date2 !== null & message.createdAt <= date2)
                read = read > index ? read : index;
            }
            return message;
          });
          convo.lastReceived = last !== -1 && convo.messages[last];
          convo.otherUser.lastRead = read !== -1 && convo.messages[read];
          convo.otherUser.unreadCount = cnt;
          return convo;
        })
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
        />
      </Grid>
    </>
  );
};

export default Home;
