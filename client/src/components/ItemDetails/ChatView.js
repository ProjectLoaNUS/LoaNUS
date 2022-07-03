import { DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL, SOCKET_URL } from "../../database/const";
import { io } from "socket.io-client";
import ChatBox from "../ChatComps/ChatBox";

const DialogContainer = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    gap: 0.5ch;
    align-items: stretch;
    padding: 1rem;
    overflow-y: hidden;
`;

export default function ChatView(props) {
    const { user, owner, chat, backToDetails, handleClose } = props;
    const [ messages, setMessages ] = useState([]);
    const [ arrivalMessage, setArrivalMessage ] = useState(null);
    const socket = useRef();
    const scrollRef = useRef(null);

    const openSocket = async () => {
        socket.current = io(SOCKET_URL);
        socket.current.on("getMessage", (data) => {
          setArrivalMessage({
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
          });
        });
    
        return () => {
          socket.current.disconnect();
        }
    };

    const fetchMessages = async () => {
        try {
            axios.get(
                `${BACKEND_URL}/api/messages/` + chat?._id
            )
            .then(res => {
                setMessages(res.data);
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchMessages();
        openSocket();
    }, []);

    useEffect(() => {
        arrivalMessage &&
          chat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, chat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <DialogTitle align="center">
                <IconButton
                  aria-label="back"
                  onClick={backToDetails}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: 8,
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                    <ArrowBackIcon />
                </IconButton>
                {owner && owner.name}
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'rgba(0, 0, 0, 0.87)',
                  }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContainer ref={scrollRef}>
                <ChatBox
                  currentChat={chat}
                  messages={messages}
                  setMessages={setMessages}
                  scrollRef={scrollRef}
                  socket={socket}
                  user={user} />
            </DialogContainer>
        </>
    )
}