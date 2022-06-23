import { Button, Container, Fab, makeStyles, MenuItem, Select, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DocenteCard } from './DocenteCard'
import AddIcon from '@material-ui/icons/Add';
import { CreateDocenteModal } from './CreateDocenteModal';
import { loadDocentes } from '../../Redux/actions/docentes';
import { useFormik } from 'formik';
import { fetchWithNotoken } from '../../Helpers/Fetch';



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
  text2: {
    fontWeight: theme.typography.fontWeightLight,
  },

  grid: {
    padding: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(2),
    marginTop: theme.spacing(3)
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

export const Docentes = () => {
  const classess = useStyles()

  const dispatch = useDispatch()
  const { user, isLogged } = useSelector(state => state.authReducer);
  const { docentes } = useSelector(state => state.docentesReducer);
  const [isOpen, setIsOpen] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [filterResults, setFilterResults] = useState(null);
  const [grados, setGrados] = useState(null);


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
    const results = docentes?.data.filter(docente => docente.grado === formik.values.grado)
    setFilterResults(results)
  }, [formik.values.grado]);



  const handleOpenModal = () => {
    setIsOpen(true);
  }

  return (
    <div className={classess.root}>

      <Container className={classess.title}>
        <Typography variant='h6' className={classess.text} color='primary'>Docentes</Typography>
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
              filterResults && filterResults.map((docente, index) => (
                <DocenteCard docente={docente} key={index} />

              ))
            }
          </Container>
          :
          <Container className={classess.grid}>
            {
              docentes.data && docentes.data.map((docente, index) => (
                <DocenteCard docente={docente} key={index} />

              ))
            }
          </Container>

      }

      <Fab color="primary" aria-label="add" className={classess.fab} onClick={handleOpenModal}>
        <AddIcon />
      </Fab>

      {
        isOpen &&
        <CreateDocenteModal isOpen={isOpen} setIsOpen={setIsOpen} />
      }



    </div>
  )
}
