import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Send, VolumeUp, Mic, MicOff } from "@mui/icons-material";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";
import { gpt4 } from "../../services/Axios";
import withUserData from '../../components/UserData';
//import settings from "../productPages/Settings";

const getSettings = () => {
  const savedSettings = JSON.parse(localStorage.getItem("settings"));
  return savedSettings || { voiceName: "", rate: 1, pitch: 1 };
};

const Talk = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [settings, setSettings] = useState(getSettings());
  
 
  
  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
  }, []);

  useEffect(() => {
    if (!audioContextRef.current) {
      setupAudio();
    }
    if (!listening && transcript) {
      setInput(transcript);
      const id = setTimeout(() => {
        handleSendMessage();
      }, 5000); // 5 seconds of inactivity
      setTimeoutId(id);
    } else if (listening) {
      setInput(transcript);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [transcript, listening]);

  const setupAudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    audioContextRef.current = context;

    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 256;
    const bufferLength = analyserNode.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    analyserRef.current = analyserNode;
    analyserNode.connect(context.destination); // Connect to the context's destination (i.e., speakers)

    // Set up the canvas drawing
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const draw = () => {
        if (!analyserNode) return;

        analyserNode.getByteFrequencyData(dataArrayRef.current);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArrayRef.current.length; i++) {
          barHeight = dataArrayRef.current[i];
          ctx.fillStyle = `rgb(0, ${barHeight + 100}, 50)`;
          ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }

        requestAnimationFrame(draw);
      };

      draw();
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const newMessages = [...messages, { role: "user", content: input }];
      setMessages(newMessages);
      setInput("");
  
      try {
        const response = await gpt4(input);  // API call to GPT-4
  
        // Log the entire response to see its structure
        console.log("API Response:", response);
  
        // Ensure response.data is a string or provide a default value
        const responseData = typeof response.data === 'string' ? "No response from API" : response;
        
        const updatedMessages = [
          ...newMessages,
          { role: "assistant", content: responseData }, // Ensure the response structure is correct
        ];
        setMessages(updatedMessages);
  
        readAloud(responseData);  // Use responseData directly
      } catch (error) {
        console.error("Error occurred while fetching GPT-4 response:", error);
        // Log more details about the error
        console.error("Error details:", error.response ? error.response.data : error.message);
        // Optionally show an error message to the user
        setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again later." }]);
      }
  
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  };
  

  const readAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
     // Find and set voice if available, else fallback to default
  const selectedVoice = window.speechSynthesis.getVoices().find(voice => voice.name === settings.voiceName);
  utterance.voice = selectedVoice || window.speechSynthesis.getVoices()[0];

  // Validate and set rate (must be between 0.1 and 10)
  const rate = parseFloat(settings.rate);
  utterance.rate = isFinite(rate) && rate >= 0.1 && rate <= 10 ? rate : 1;

  // Validate and set pitch (must be between 0 and 2)
  const pitch = parseFloat(settings.pitch);
  utterance.pitch = isFinite(pitch) && pitch >= 0 && pitch <= 2 ? pitch : 1;
  utterance.lang = settings.language || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleReadLastMessage = () => {
    const lastMessage = messages.slice().reverse().find((msg) => msg.role === "assistant");
    if (lastMessage) {
      readAloud(lastMessage.content);
    }
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <ProductDrawer />
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This adds space for the AppBar */}
      <Container sx={{ mt: 8 }}>
        {/* Adjust the margin top to account for the AppBar height */}
        <Box
          sx={{
            height: "70vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            mt: 2,
            mb: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 2,
          }}
        >
          {messages.map((message, index) => (
            <Paper
              key={index}
              sx={{
                p: 1,
                mb: 1,
                backgroundColor:
                  message.role === "user" ? "#f1f1f1" : "#e0e0e0",
                alignSelf: message.role === "user" ? "flex-start" : "flex-end",
              }}
            >
              <Typography
                component="div"
                sx={{
                  whiteSpace: "pre-wrap", 
                }}
              >
                {typeof message.content === 'string' && message.content.includes("```") ? (
                  <Box
                    sx={{  
                      color: "black",
                      padding: "5px",
                      borderRadius: "5px",
                      overflowX: "auto",
                      fontSize: "0.75rem", 
                      maxWidth: "90%", 
                      wordBreak: "break-all", 
                    }}
                  >
                    <code>{message.content.replace(/```/g, '')}</code>
                  </Box>
                ) : (
                  message.content
                )}
              </Typography>
            </Paper>
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <canvas ref={canvasRef} width="300" height="100" />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
  margin="normal"
  fullWidth
  className="input"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  sx={{
    flexGrow: 1,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--input-border-color)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--input-border-color)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--input-border-color)',
      },
    },
    '& .MuiInputBase-input': {
      color: 'var(--primary-text-color)',
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          sx={{ color: 'var(--icon-color)' }}
          onClick={handleSendMessage}
          edge="end"
        >
          <Send />
        </IconButton>
        <IconButton
          sx={{ color: 'var(--icon-color)' }}
          onClick={handleReadLastMessage}
          edge="end"
          
        >
          <VolumeUp />
        </IconButton>
        <IconButton
          sx={{ color: 'var(--icon-color)' }}
          onClick={handleMicClick}
          edge="end"
          
        >
          {listening ? <Mic /> : <MicOff />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

        </Box>
      </Container>
    </>
  );
}

export default withUserData(Talk);
