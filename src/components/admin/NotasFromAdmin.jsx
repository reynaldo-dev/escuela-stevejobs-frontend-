import { Box, Button, CircularProgress, Container, makeStyles, Typography } from '@material-ui/core'
import { PDFViewer } from '@react-pdf/renderer'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchWithtoken } from '../../Helpers/Fetch'
import { TableNotas } from '../docente/TableNotas'
import { NotasAdminPDF } from './NotasAdminPDF'


const useStyles = makeStyles((theme) => ({

    root:{
      width: '100%',
    },
  
    text:{
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
  
    tableContainer:{
      marginTop: theme.spacing(2)
    },
  
    mainContainer:{
      display: 'flex',
      flexDirection: 'column',
    },
  

    btn:{
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        float: 'right',
        padding: theme.spacing(1),
       
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: '0.5rem',
        
      }
  
  }))


export const NotasFromAdmin = () => {
   
    const { user, isLogged } = useSelector(state => state.authReducer);
    const { id } = useParams()
    const id_alumno = parseInt(id)
    const classess = useStyles()

    const [openNotasP1, setOpenNotasP1] = useState(false);
    const [openNotasP2, setOpenNotasP2] = useState(false);
    const [openNotasP3, setOpenNotasP3] = useState(false);
    const [openNotasP4, setOpenNotasP4] = useState(false);


    const loadInfo = async () =>{
        const res = await fetchWithtoken({}, 'GET', `notas/${id_alumno}`)
        const data = await res.json()
       return data
      }

      const loadAlumnoInfo = async () =>{
        const res = await fetchWithtoken({}, 'GET', `alumno/${id_alumno}`)
        const data = await res.json()
        
       return data
      }
     
     

      const {data, isError, isLoading,refetch } = useQuery(['notas'], loadInfo)
      const {data : alumno } = useQuery(['alumnoById'], loadAlumnoInfo)
    


  return (
    
      <div className={classess.root}>
          {
        isLoading && <CircularProgress />
      }

      <Container>
        <Typography color="primary" variant='h6' className={classess.text}>
          {data ? data?.data?.primer_periodo[0].alumno : ''}
        </Typography>
      </Container>


      <Container className={classess.mainContainer}>

        <Box className={classess.tableContainer}>
          <Typography variant='h6' color='secondary'>{ alumno?.data[0].nombre == 'Bachillerato general' ? 'Periodo 1' : 'Primer trimestre' }</Typography>
          <TableNotas notas={data ? data?.data?.primer_periodo : null} />
          <Button variant='contained' color='primary' className={classess.btn} onClick={() => setOpenNotasP1(!openNotasP1)} >
            Descargar reporte del periodo 1
          </Button>

          {
            openNotasP1 &&
          
            <PDFViewer height={1000} width={1000} style={{margin:'0 auto'}} >
            <NotasAdminPDF notas={data ? data?.data?.primer_periodo : ''} alumno={alumno?.data[0]} periodo={ alumno?.data[0].nombre == 'Bachillerato general' ? 'Periodo 1' : 'Primer trimestre' } />
          </PDFViewer>
          
          }
        </Box>

        <Box className={classess.tableContainer}>
          <Typography variant='h6' color='secondary'>{ alumno?.data[0].nombre == 'Bachillerato general' ? 'Periodo 2' : 'Segundo trimestre' }</Typography>
          <TableNotas notas={data ? data?.data?.segundo_periodo : []} />
          <Button variant='contained' color='primary' className={classess.btn} onClick={() => setOpenNotasP2(!openNotasP2)}>Descargar reporte del periodo 2</Button>

          {
            openNotasP2 &&
            <PDFViewer height={1000} width={1000} style={{ margin: '0 auto' }} >
              <NotasAdminPDF notas={data ? data?.data?.segundo_periodo : []} alumno={alumno?.data[0]} periodo={ alumno?.data[0].nombre == 'Bachillerato general' ? 'Periodo 2' : 'Segundo trimestre' } />

            </PDFViewer>
          }
        </Box>

        <Box className={classess.tableContainer}>
          <Typography variant='h6' color='secondary'>{ alumno?.data[0].nombre == 'Bachillerato general' ? 'Periodo 3' : 'Tercer trimestre' }</Typography>
          <TableNotas notas={data ? data?.data?.tercer_periodo : null} />
          <Button variant='contained' color='primary' className={classess.btn} onClick={ ()=> setOpenNotasP3(!openNotasP3)}>Descargar reporte del periodo 3</Button>

          {
            openNotasP3 &&
            <PDFViewer height={1000} width={1000} style={{margin:'0 auto'}} >
                          <NotasAdminPDF notas={data ? data?.data?.tercer_periodo : []} alumno={alumno?.data[0]} periodo={ alumno?.data[0].nombre == 'Bachillerato general' ? 'Periodo 3' : 'Tercer trimestre' }/>

            </PDFViewer>
          }
        </Box>

        {
          alumno?.data[0]?.nombre === 'Bachillerato general' &&

          <Box className={classess.tableContainer}>
            <Typography variant='h6' color='secondary'>Periodo 4</Typography>
            <TableNotas notas={data ? data?.data?.cuarto_periodo : null} />
            <Button variant='contained' color='primary' className={classess.btn} onClick={() => setOpenNotasP4(!openNotasP4)}>Descargar reporte del periodo 4</Button>

            {
              openNotasP4 &&
              <PDFViewer height={1000} width={1000} style={{ margin: '0 auto' }} >
                <NotasAdminPDF notas={data ? data?.data?.cuarto_periodo : []} alumno={alumno?.data[0]} periodo='4' />

              </PDFViewer>
            }
          </Box>
        }

      </Container>


      </div>
  )
}
