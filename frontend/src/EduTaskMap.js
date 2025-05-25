import { React, useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent
} from '@mui/material'
import { fetchSchools } from './requests/schools.js'
import { fetchCompetencies, addCompetency } from './requests/competencies.js'
import SchoolSelection from './components/SchoolSelection.js'
import CompetencyCard from './components/CompetencyCard.js'
import AddCompetencyDialog from './dialog/AddCompetencyDialog.js'

const grades = [
  { grade: '5 клас', color: '#fb923c' },
  { grade: '6 клас', color: '#facc15' },
  { grade: '7 клас', color: '#f472b6' },
  { grade: '8 клас', color: '#fb923c' },
  { grade: '9 клас', color: '#facc15' },
  { grade: '10 клас', color: '#f472b6' },
  { grade: '11 клас', color: '#fb923c' },
]

const colorPalette = ['#fb923c', '#f472b6', '#facc15']

export default function EduTaskMap () {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [schools, setSchools] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [addCompetencyDialogOpen, setAddCompetencyDialogOpen] = useState(false)
  const [newCompetencyName, setNewCompetencyName] = useState('')

  useEffect(() => {
    fetchSchools((data) => {
      setSchools(data)
      if (data.length > 0) setSelectedSchool(data[0])
    })
  }, [])

  useEffect(() => {
    fetchCompetencies((data) => {
      setCompetencies(data.map((c, i) => ({
        ...c,
        color: colorPalette[i % colorPalette.length]
      })))
    })
  }, [])

  const handleAddCompetency = () => {
    if (!newCompetencyName.trim() || !selectedSchool) return
    addCompetency({ name: newCompetencyName, school_id: selectedSchool.id }, (newComp) => {
      setCompetencies(prev => [
        ...prev,
        { ...newComp, color: colorPalette[prev.length % colorPalette.length] }
      ])
      setNewCompetencyName('')
      setAddCompetencyDialogOpen(false)
    })
  }

  return (
    <Box sx={{ p: 6, backgroundColor: '#f1e3d4', minHeight: '100vh' }}>
      <SchoolSelection schools={schools} selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool}/>

      <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
        КЛАСТЕР ГРОМАДЯНСЬКИХ КОМПЕТЕНТНОСТЕЙ
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'inline-block', backgroundColor: '#facc15', px: 2, py: 0.5, fontWeight: 'bold' }}>МАПА
          ВПРАВ</Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => setAddCompetencyDialogOpen(true)}>Додати компетенцію</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 10 }}>
        {competencies.map(comp => (
          <CompetencyCard key={comp.id} competency={comp}/>
        ))}
      </Box>

      {/* Grades implementation remains unchanged */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
        {grades.map((grade, idx) => (
          <Box key={idx}>
            <Box sx={{ backgroundColor: grade.color, color: '#fff', fontWeight: 'bold', py: 1 }}>{grade.grade}</Box>
            <Card sx={{ mt: 1 }}>
              <Box sx={{ backgroundColor: '#facc15', px: 2, py: 0.5, fontWeight: 'bold' }}>ПРЕДМЕТ</Box>
              <CardContent>
                <Typography fontWeight="bold">ВПРАВА</Typography>
                <a href="#" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>Лінк на вправу</a>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <AddCompetencyDialog
        open={addCompetencyDialogOpen}
        onClose={() => setAddCompetencyDialogOpen(false)}
        onAdd={handleAddCompetency}
        value={newCompetencyName}
        onChange={e => setNewCompetencyName(e.target.value)}
        disabled={!newCompetencyName.trim() || !selectedSchool}
      />
    </Box>
  )
}