import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import "./../App.css"

export default function Cards({ title, content, customStyles, children }) {
  return (
    
    <Card className="card" sx={{ ...customStyles }} >
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">
          {content}
        </Typography>
        {children}
      </CardContent>
    </Card>
    
  );
}
