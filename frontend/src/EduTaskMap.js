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
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material'
import { fetchSchools } from './requests/schools.js'
import { addCompetency } from './requests/competencies.js'
import { fetchSchoolFullData } from './requests/schoolFullData.js'
import SchoolSelection from './components/SchoolSelection.js'
import CompetencyCard from './components/CompetencyCard.js'
import AddCompetencyDialog from './dialog/AddCompetencyDialog.js'
import GradeClasses from './components/GradeClasses'
import { saveSelectedSchoolId, getSavedSchoolId } from './utils/schoolStorage.js'
import { useThemeMode } from './theme/ThemeContext'

const EMPTY_CLASSES = [];

const grades = [
  { grade: 1, color: '#ff4757' },
  { grade: 2, color: '#ff6b35' },
  { grade: 3, color: '#ffd32a' },
  { grade: 4, color: '#00d2d3' },
  { grade: 5, color: '#ff6348' },
  { grade: 6, color: '#ff9f43' },
  { grade: 7, color: '#eccc68' },
  { grade: 8, color: '#00ff88' },
  { grade: 9, color: '#00d4ff' },
  { grade: 10, color: '#a55eea' },
  { grade: 11, color: '#ff6b9d' },
];

const colorPalette = ['#00d4ff', '#a55eea', '#00ff88', '#ff6b9d', '#ffd32a', '#ff6348', '#00d2d3', '#ff9f43', '#eccc68', '#ff4757', '#ff6b35'];

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
  const { mode, toggleTheme, t } = useThemeMode();

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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const cached = schoolDataCacheRef.current[schoolId];
    if (cached) {
      applySchoolData(cached);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(!cached);
    try {
      const data = await fetchSchoolFullData(schoolId, { signal: controller.signal });
      schoolDataCacheRef.current[schoolId] = data;
      applySchoolData(data);
    } catch (err) {
      if (err.name === 'AbortError') return;
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
      background: t.bgGradient,
      py: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: t.bgRadial,
        pointerEvents: 'none',
        zIndex: 0,
      }
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
          {/* Theme toggle */}
          <Tooltip title={mode === 'dark' ? 'Світла тема' : 'Темна тема'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                position: 'absolute',
                right: 0,
                top: 0,
                color: t.textMuted,
                border: `1px solid ${t.borderSubtle}`,
                backdropFilter: 'blur(10px)',
                background: t.bgSurface,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: t.accentPrimary,
                  borderColor: t.accentPrimary,
                  boxShadow: t.shadowGlow,
                }
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Typography
            variant="h3"
            fontWeight="800"
            gutterBottom
            sx={{
              color: t.textPrimary,
              mb: 1,
              letterSpacing: '0.15em',
              textShadow: t.titleGlow,
            }}
          >
            МАПА ВПРАВ
          </Typography>
          <Box sx={{
            width: 80,
            height: 3,
            background: t.accentGradient,
            mx: 'auto',
            borderRadius: 2,
            boxShadow: t.accentLineGlow,
          }} />
        </Box>
        <Paper elevation={0} sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: t.bgSurface,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: t.shadowCard,
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
        <Paper elevation={0} sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: t.bgSurface,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: t.shadowCard,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="700" sx={{ color: t.textPrimary, letterSpacing: '0.03em' }}>
              Кластер громадянських компетентностей
            </Typography>
            <Button
              variant="contained"
              onClick={() => setAddCompetencyDialogOpen(true)}
              sx={{
                background: t.btnGradient,
                color: '#fff',
                fontWeight: 600,
                letterSpacing: '0.03em',
                border: 'none',
                boxShadow: t.shadowGlow,
                '&:hover': {
                  background: t.btnGradientHover,
                  boxShadow: t.shadowGlowHover,
                }
              }}
            >
              Додати компетентність
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: t.accentPrimary }} />
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
        <Paper elevation={0} sx={{
          p: 4,
          borderRadius: 3,
          background: t.bgSurface,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: t.shadowCard,
        }}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: t.textPrimary, letterSpacing: '0.03em' }}>
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
                mb: 2,
                color: t.textPrimary,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: t.textDim }} />}
                sx={{
                  px: 0,
                  minHeight: 'auto',
                  '& .MuiAccordionSummary-content': { my: 1 }
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ color: t.textMuted }}>
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
