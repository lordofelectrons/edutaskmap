import { React, useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import { fetchSchools } from './requests/schools.js'
import { fetchCompetenciesBySchoolId, addCompetency } from './requests/competencies.js'
import SchoolSelection from './components/SchoolSelection.js'
import CompetencyCard from './components/CompetencyCard.js'
import AddCompetencyDialog from './dialog/AddCompetencyDialog.js'
import GradeClasses from './components/GradeClasses'

const grades = [
  { grade: 5, color: '#ef4444' },
  { grade: 6, color: '#f97316' },
  { grade: 7, color: '#eab308' },
  { grade: 8, color: '#22c55e' },
  { grade: 9, color: '#3b82f6' },
  { grade: 10, color: '#8b5cf6' },
  { grade: 11, color: '#ec4899' },
];

const colorPalette = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function EduTaskMap () {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [schools, setSchools] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [addCompetencyDialogOpen, setAddCompetencyDialogOpen] = useState(false)
  const [newCompetencyName, setNewCompetencyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingCompetency, setAddingCompetency] = useState(false)
  const [loadingSchools, setLoadingSchools] = useState(true)

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const syncSchoolList = () => {
    setLoadingSchools(true)
    fetchSchools((data) => {
      setSchools(data)
      if (data.length > 0 && !selectedSchool) setSelectedSchool(data[0])
      setLoadingSchools(false)
    })
  }

  useEffect(() => {
    syncSchoolList();
  }, [])

  useEffect(() => {
    if (selectedSchool) {
      setLoading(true);
      fetchCompetenciesBySchoolId(selectedSchool?.id, (data) => {
        setCompetencies(data.map((c, i) => ({
          ...c,
          color: colorPalette[i % colorPalette.length]
        })))
        setLoading(false);
      })
    }
  }, [selectedSchool])

  const handleAddCompetency = () => {
    if (!newCompetencyName.trim() || !selectedSchool) return
    setAddingCompetency(true)
    addCompetency({ name: newCompetencyName, school_id: selectedSchool.id }, (newComp) => {
      setCompetencies(prev => [
        ...prev,
        { ...newComp, color: colorPalette[prev.length % colorPalette.length] }
      ])
      setNewCompetencyName('')
      setAddCompetencyDialogOpen(false)
      setAddingCompetency(false)
    })
  }

  const handleCompetencyDeleted = (deletedCompetencyId) => {
    setCompetencies(prev => prev.filter(comp => comp.id !== deletedCompetencyId))
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            МАПА ВПРАВ
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <SchoolSelection 
            schools={schools} 
            selectedSchool={selectedSchool} 
            setSelectedSchool={setSelectedSchool} 
            syncSchoolList={syncSchoolList}
            loadingSchools={loadingSchools}
          />
        </Paper>

        {/* Competencies Section */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Кластер громадянських компетентностей
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setAddCompetencyDialogOpen(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)'
                }
              }}
            >
              Додати компетентність
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 3 
            }}>
              {competencies.map(comp => (
                <CompetencyCard 
                  key={comp.id} 
                  competency={comp}
                  onCompetencyDeleted={handleCompetencyDeleted}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* Grades Section */}
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
            Класи та предмети
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 3 
          }}>
            {grades.map((gradeObj, idx) => (
              <GradeClasses
                key={gradeObj.grade}
                grade={gradeObj.grade}
                color={gradeObj.color}
                school={selectedSchool}
              />
            ))}
          </Box>
        </Paper>

        <AddCompetencyDialog
          open={addCompetencyDialogOpen}
          onClose={() => setAddCompetencyDialogOpen(false)}
          onAdd={handleAddCompetency}
          value={newCompetencyName}
          onChange={e => setNewCompetencyName(e.target.value)}
          disabled={!newCompetencyName.trim() || !selectedSchool || addingCompetency}
          loading={addingCompetency}
        />
      </Container>
    </Box>
  )
}