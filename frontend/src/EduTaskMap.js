import { React, useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button
} from '@mui/material'
import { fetchSchools } from './requests/schools.js'
import { fetchCompetenciesBySchoolId, addCompetency } from './requests/competencies.js'
import SchoolSelection from './components/SchoolSelection.js'
import CompetencyCard from './components/CompetencyCard.js'
import AddCompetencyDialog from './dialog/AddCompetencyDialog.js'
import GradeClasses from './components/GradeClasses'

const grades = [
  { grade: 5, color: '#fb923c' },
  { grade: 6, color: '#facc15' },
  { grade: 7, color: '#f472b6' },
  { grade: 8, color: '#fb923c' },
  { grade: 9, color: '#facc15' },
  { grade: 10, color: '#f472b6' },
  { grade: 11, color: '#fb923c' },
];

const colorPalette = ['#fb923c', '#f472b6', '#facc15'];

export default function EduTaskMap () {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [schools, setSchools] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [addCompetencyDialogOpen, setAddCompetencyDialogOpen] = useState(false)
  const [newCompetencyName, setNewCompetencyName] = useState('')

  const syncSchoolList = () => {
    fetchSchools((data) => {
      setSchools(data)
      if (data.length > 0 && !selectedSchool) setSelectedSchool(data[0])
    })
  }

  const setSelectedSchoolByName = (name) => {
    const school = schools?.find(school => school.name = name)
    if (school) {
      setSelectedSchool(school)
    }
  }

  useEffect(() => {
    syncSchoolList();
  }, [])

  useEffect(() => {
    fetchCompetenciesBySchoolId(selectedSchool?.id, (data) => {
      setCompetencies(data.map((c, i) => ({
        ...c,
        color: colorPalette[i % colorPalette.length]
      })))
    })
  }, [selectedSchool])

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
      <SchoolSelection schools={schools} selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchoolByName} syncSchoolList={syncSchoolList}/>

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
        {grades.map((gradeObj, idx) => (
          <GradeClasses
            key={gradeObj.grade}
            grade={gradeObj.grade}
            color={gradeObj.color}
            school={selectedSchool}
          />
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