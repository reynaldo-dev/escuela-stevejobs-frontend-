import React, { useEffect, useState } from 'react'
import { Button, Container, Fab, makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import {AlumnoCard} from './AlumnoCard'
import AddIcon from '@material-ui/icons/Add';
import { CrearAlumno } from './CrearAlumno';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { fetchWithNotoken } from '../../Helpers/Fetch';
import { loadAlumnos } from '../../Redux/actions/alumnos';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',

  },

  title: {
    marginTop: theme.spacing(2),

  },

  text: {
    fontWeight: theme.typography.fontWeightLight,
  },

  grid: {

    padding: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(2),

  },
  text2: {
    fontWeight: theme.typography.fontWeightLight,
  },


  fab: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3),

    width: '20%',
  },

}))

export const Alumnos = () => {
  const [isOpen, setIsOpen] = useState(false);
  const classess = useStyles()
  const dispatch = useDispatch()
  const { alumnos } = useSelector(state => state.alumnosReducer);
  const [grados, setGrados] = useState(null);
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [filterResults, setFilterResults] = useState(null);


  const formik = useFormik({
    initialValues: {
      grado: '',
    }
  });

  const loadGrados = async () => {
    const res = await fetchWithNotoken({}, 'GET', 'grados');
    const data = await res.json()
    setGrados(data)
  }

  useEffect(() => {
    loadGrados()
  }, []);
  
  useEffect(() => {
    setIsActiveFilter(true)
    dispatch(loadAlumnos())
    const results = alumnos?.data.filter(alumno => alumno.nombre === formik.values.grado)
    console.log(results)
    setFilterResults(results)
  }, [formik.values.grado]);


  const handleOpenModal = () => {
    setIsOpen(true);
  }

  return (
    <div className={classess.root}>
      <Container className={classess.title}>
        <Typography variant='h6' className={classess.text} color='primary'>Alumnos</Typography>
        <Typography variant='p' className={classess.text2} color='primary'>Filtrado porgrado</Typography>

        <Select
          name='grado'
          onChange={formik.handleChange}
          value={formik.values.grado}
          className={classess.textField}
          label="Filtrado por grado"

        >


          {
            grados && grados.map((grado) => (
              <MenuItem value={grado.nombre} key={grado.id_grado}>{grado.nombre}</MenuItem>
            ))
          }
        </Select>
        <Button variant='contained' style={{marginLeft:'20px'}} size='small' color='primary' onClick={() => setIsActiveFilter(false)} >Ver resultados por defecto</Button>
      </Container>



        {
          isActiveFilter ?
            <Container className={classess.grid}>
              {
                filterResults && filterResults.map((alumno, index) => (
                  <AlumnoCard alumno={alumno} key={index} />

                ))
              }
            </Container>
            :
            <Container className={classess.grid}>
              {
                alumnos.data && alumnos.data.map((alumno, index) => (
                  <AlumnoCard alumno={alumno} key={index} />

                ))
              }
            </Container>

        }

     

      <Fab color="primary" aria-label="add" className={classess.fab} onClick={handleOpenModal}>
        <AddIcon />
      </Fab>

      {
        isOpen &&
        <CrearAlumno isOpen={isOpen} setIsOpen={setIsOpen} />
      }


    </div>
  )
}
