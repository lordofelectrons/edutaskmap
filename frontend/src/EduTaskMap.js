import { React, useState, useEffect, useCallback, useRef } from 'react'
import {
  Typography,
  Box,
  Button,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { fetchSchools } from './requests/schools.js'
import { addCompetency } from './requests/competencies.js'
import { fetchSchoolFullData } from './requests/schoolFullData.js'
import SchoolSelection from './components/SchoolSelection.js'
import CompetencyCard from './components/CompetencyCard.js'
import AddCompetencyDialog from './dialog/AddCompetencyDialog.js'
import GradeClasses from './components/GradeClasses'
import { saveSelectedSchoolId, getSavedSchoolId } from './utils/schoolStorage.js'

const EMPTY_CLASSES = [];

const grades = [
  { grade: 1, color: '#dc2626' },
  { grade: 2, color: '#ea580c' },
  { grade: 3, color: '#ca8a04' },
  { grade: 4, color: '#16a34a' },
  { grade: 5, color: '#ef4444' },
  { grade: 6, color: '#f97316' },
  { grade: 7, color: '#eab308' },
  { grade: 8, color: '#22c55e' },
  { grade: 9, color: '#3b82f6' },
  { grade: 10, color: '#8b5cf6' },
  { grade: 11, color: '#ec4899' },
];

const colorPalette = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

const gradeGroups = [
  { label: 'Початкова школа (1-4)', grades: [1, 2, 3, 4] },
  { label: 'Основна школа (5-9)', grades: [5, 6, 7, 8, 9] },
  { label: 'Старша школа (10-11)', grades: [10, 11] },
];

const gradeColorMap = Object.fromEntries(grades.map(g => [g.grade, g.color]));

export default function EduTaskMap () {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [schools, setSchools] = useState([])
  const [competencies, setCompetencies] = useState([])
  const [classesByGrade, setClassesByGrade] = useState({})
  const [addCompetencyDialogOpen, setAddCompetencyDialogOpen] = useState(false)
  const [newCompetencyName, setNewCompetencyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [addingCompetency, setAddingCompetency] = useState(false)
  const [loadingSchools, setLoadingSchools] = useState(true)
  const abortControllerRef = useRef(null)
  const schoolDataCacheRef = useRef({})

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const applySchoolData = useCallback((data) => {
    setCompetencies(data.competencies.map((c, i) => ({
      ...c,
      color: colorPalette[i % colorPalette.length]
    })))

    const classesByGradeMap = {};
    data.classes.forEach(cls => {
      if (!classesByGradeMap[cls.grade]) {
        classesByGradeMap[cls.grade] = [];
      }
      classesByGradeMap[cls.grade].push(cls);
    });
    setClassesByGrade(classesByGradeMap);
  }, [])

  const fetchFullSchoolData = useCallback(async (schoolId) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Show cached data immediately if available
    const cached = schoolDataCacheRef.current[schoolId];
    if (cached) {
      applySchoolData(cached);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(!cached); // Only show loading spinner if no cache
    try {
      const data = await fetchSchoolFullData(schoolId, { signal: controller.signal });
      // Cache the result
      schoolDataCacheRef.current[schoolId] = data;
      applySchoolData(data);
    } catch (err) {
      if (err.name === 'AbortError') return; // Cancelled, ignore
      console.error('Error fetching school data:', err);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [applySchoolData])

  const syncSchoolList = useCallback(async () => {
    setLoadingSchools(true)
    try {
      const data = await fetchSchools();
      setSchools(data)

      const savedSchoolId = getSavedSchoolId()
      const savedSchool = savedSchoolId
        ? data.find(school => school.id === savedSchoolId)
        : null

      const schoolToSelect = savedSchool || (data.length > 0 ? data[0] : null)

      setSelectedSchool((prev) => {
        if (schoolToSelect && !prev) {
          fetchFullSchoolData(schoolToSelect.id)
          return schoolToSelect
        }
        if (savedSchool && (!prev || prev.id !== savedSchool.id)) {
          fetchFullSchoolData(savedSchool.id)
          return savedSchool
        }
        return prev || schoolToSelect
      })
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setLoadingSchools(false)
    }
  }, [fetchFullSchoolData])

  useEffect(() => {
    syncSchoolList();
  }, [syncSchoolList])

  useEffect(() => {
    if (selectedSchool) {
      fetchFullSchoolData(selectedSchool.id)
      saveSelectedSchoolId(selectedSchool.id)
    }
  }, [selectedSchool, fetchFullSchoolData])

  // Invalidate cache on mutation
  const handleDataChange = useCallback(() => {
    if (selectedSchool) {
      delete schoolDataCacheRef.current[selectedSchool.id];
      fetchFullSchoolData(selectedSchool.id);
    }
  }, [selectedSchool, fetchFullSchoolData])

  const handleAddCompetency = async () => {
    if (!newCompetencyName.trim() || !selectedSchool) return
    setAddingCompetency(true)
    try {
      await addCompetency({ name: newCompetencyName, school_id: selectedSchool.id });
      handleDataChange();
      setNewCompetencyName('')
      setAddCompetencyDialogOpen(false)
    } catch (err) {
      console.error('Error adding competency:', err);
    } finally {
      setAddingCompetency(false)
    }
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
              color: 'white',
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

          {gradeGroups.map((group) => (
            <Accordion
              key={group.label}
              defaultExpanded
              disableGutters
              sx={{
                boxShadow: 'none',
                '&:before': { display: 'none' },
                background: 'transparent',
                mb: 2
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 0,
                  minHeight: 'auto',
                  '& .MuiAccordionSummary-content': { my: 1 }
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                  {group.label}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 2 }}>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 3
                }}>
                  {group.grades.map((gradeNum) => (
                    <GradeClasses
                      key={gradeNum}
                      grade={gradeNum}
                      color={gradeColorMap[gradeNum]}
                      school={selectedSchool}
                      preloadedClasses={classesByGrade[gradeNum] || EMPTY_CLASSES}
                      onDataChange={handleDataChange}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
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
