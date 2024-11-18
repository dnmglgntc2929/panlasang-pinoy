import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Container, Box, Typography, Slider, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import ProductDrawer from "../../components/prodoctComponents/ProductDrawer";

const Settings = ({ onSettingsChange }) => {
  const [language, setLanguage] = useState("en-US");
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const [voices, setVoices] = useState([]);

  // Load settings from local storage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settings"));
    if (savedSettings) {
      setLanguage(savedSettings.language || "en-US");
      setVoiceName(savedSettings.voiceName || "");
      setRate(savedSettings.rate || 1);
      setPitch(savedSettings.pitch || 1);
    }
  }, []);

  // Update voices based on the selected language
  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(language));
      setVoices(availableVoices);

      if (!availableVoices.some(voice => voice.name === voiceName)) {
        setVoiceName(availableVoices[0]?.name || "");
      }
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged();

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [language]);

  const handleSave = () => {
    const settings = { language, voiceName, rate, pitch };
    localStorage.setItem("settings", JSON.stringify(settings));
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    const newVoice = voices.find(voice => voice.lang.startsWith(newLanguage))?.name || "";
    setVoiceName(newVoice);
  };

  const handleVoiceChange = (event) => {
    const newVoiceName = event.target.value;
    setVoiceName(newVoiceName);
  };

  const handleRateChange = (event, newValue) => {
    setRate(newValue);
  };

  const handlePitchChange = (event, newValue) => {
    setPitch(newValue);
  };

  return (
    <div>
      <AppBar>
        <Toolbar>
          <ProductDrawer />
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ color: 'var(--primary-text-color)' }}>Settings</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: 'var(--primary-text-color)' }}>Language</InputLabel>
          <Select
            value={language}
            onChange={handleLanguageChange}
            sx={{
              color: 'var(--primary-text-color)',
              borderColor: 'var(--input-border-color)',
              '& .MuiSelect-icon': {
                color: 'var(--icon-color)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--input-border-color)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--icon-color)',
              },
            }}
          >
            <MenuItem value="en-US">English (US)</MenuItem>
            <MenuItem value="en-GB">English (UK)</MenuItem>
            <MenuItem value="es-ES">Spanish</MenuItem>
            {/* Add more languages as needed */}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel sx={{ color: 'var(--primary-text-color)' }}>Voice</InputLabel>
          <Select
            value={voiceName}
            onChange={handleVoiceChange}
            sx={{
              color: 'var(--primary-text-color)',
              borderColor: 'var(--input-border-color)',
              '& .MuiSelect-icon': {
                color: 'var(--icon-color)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--input-border-color)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--icon-color)',
              },
            }}
          >
            {voices.map((voice) => (
              <MenuItem key={voice.name} value={voice.name}>
                {voice.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ color: 'var(--primary-text-color)' }}>Rate</Typography>
          <Slider
            value={rate}
            onChange={handleRateChange}
            min={0.1}
            max={2}
            step={0.1}
            valueLabelDisplay="auto"
            sx={{
              color: 'var(--secondary-color)',
              '& .MuiSlider-thumb': {
                backgroundColor: 'var(--secondary-color)',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ color: 'var(--primary-text-color)' }}>Pitch</Typography>
          <Slider
            value={pitch}
            onChange={handlePitchChange}
            min={0}
            max={2}
            step={0.1}
            valueLabelDisplay="auto"
            sx={{
              color: 'var(--secondary-color)',
              '& .MuiSlider-thumb': {
                backgroundColor: 'var(--secondary-color)',
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={handleSave} sx={{
              color: 'var(--primary-text-color)',
              backgroundColor: 'var(--button-color)',
              '&:hover': {
                backgroundColor: 'var(--button-color)',
              },
            }} >Save Settings</Button>
        </Box>
      </Container>
    </div>
  );
};

export default Settings;
