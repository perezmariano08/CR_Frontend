import { useDispatch, useSelector } from 'react-redux'
import Content from '../../../components/Content/Content'
import { ContentTitle } from '../../../components/Content/ContentStyles'
import { useEffect } from 'react'
import { fetchSedes } from '../../../redux/ServicesApi/sedesSlice'
import { fetchCategorias } from '../../../redux/ServicesApi/categoriasSlice'
import { fetchTemporadas } from '../../../redux/ServicesApi/temporadasSlice'
import { fetchAños } from '../../../redux/ServicesApi/añosSlice'
import { fetchTorneos } from '../../../redux/ServicesApi/torneosSlice'

const Admin = () => {
    const dispatch = useDispatch()
    const sedesList = useSelector((state) => state.sedes.data);
    const temporadasList = useSelector((state) => state.temporadas.data);
    const añosList = useSelector((state) => state.años.data);
    const categoriasList = useSelector((state) => state.categorias.data);
    const torneosList = useSelector((state) => state.torneos.data);

    useEffect(() => {
        dispatch(fetchTemporadas());
        dispatch(fetchCategorias());
        dispatch(fetchSedes());
        dispatch(fetchAños());
        dispatch(fetchTorneos());
    }, []);

    return (
        <Content>
            <ContentTitle>
                <p>Sedes: {sedesList.length}</p>
                <p>Categorias: {categoriasList.length}</p>
                <p>Torneos: {torneosList.length}</p>
                <p>Años: {añosList.length}</p>
                <p>Temporadas: {temporadasList.length}</p>
            </ContentTitle>
        </Content>
    )
}

export default Admin