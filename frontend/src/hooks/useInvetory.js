import { useState, useEffect } from 'react';
import { productoService, categoriaService } from '../services';

export const useInventory = () => {

    // variables de estado
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener todo el inventario
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const [productosData, categoriasData] = await Promise.all([
                productoService.getAllProductos(),
                categoriaService.getAllCategorias()
            ]);
            setProductos(productosData);
            setCategorias(categoriasData);
            setError(null);
        } catch (err) {
            setError('Error al cargar el inventario');
            console.error('Error fetching inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener productos por categoría
    const getProductosByCategoria = (categoriaId) => {
        return productos.filter(producto =>
            producto.p_categoria_id?.c_id === categoriaId
        );
    };

    // Cargar inventario al montar el hook
    useEffect(() => {
        fetchInventory();
    }, []);


    return {
        productos,
        categorias,
        loading,
        error,
        fetchInventory,
        getProductosByCategoria
    };
};