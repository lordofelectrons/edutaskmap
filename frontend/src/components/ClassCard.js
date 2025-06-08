// frontend/src/components/ClassCard.js
import { Card, CardContent, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react'

export default function ClassCard({ classItem }) {
  return (
    <Card sx={{ mt: 1 }}>
      <Box sx={{ backgroundColor: '#facc15', px: 2, py: 0.5, fontWeight: 'bold' }}>ПРЕДМЕТ</Box>
      <CardContent>
        <Typography fontWeight="bold">{classItem.name}</Typography>
        <TaskList classId={classItem.id} />
      </CardContent>
    </Card>
  );
}