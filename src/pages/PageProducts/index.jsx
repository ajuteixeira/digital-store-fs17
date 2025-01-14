import { styled } from "styled-components";

import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { useEffect, useMemo, useState } from "react";
import { API } from "../../services";
import Product from "../../components/Product";



const PageProductsContainer = styled.div`
    padding: 40px 100px;
    background-color: #f9f8fe;
    & h6{
        font-size: 16px;
    }
    & .content{
        margin-top: 40px;
    }
    & label{
        cursor: pointer;
    }
    
`;

const PageProducts = () => {
    const [ordenacao, setOrdenacao] = useState(1);
    const tiposDeOrdenacao = [
        {
            name: 'mais relevantes',
            value: 1
        },
        {
            name: 'menor valor',
            value: 2
        },
        {
            name: 'maior valor',
            value: 3
        }
    ];
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genders, setGenders] = useState([]);
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState([]);
    const [itensFiltrados, setItensFiltrados] = useState([]);
    const [estado, setEstado] = useState('');

    async function getBrands() {
        const response = await API.get('brands');
        setBrands(response.data);
    }

    async function getCategories() {
        const response = await API.get('categories');
        setCategories(response.data);
    }

    async function getGenders() {
        const response = await API.get('genders');
        setGenders(response.data);
    }

    async function getProducts() {
        const response = await API.get('products');
        setProducts(response.data);
        setItensFiltrados([...response.data.sort((a, b) => b.review_rate - a.review_rate)]);
    }

    function checkSelectedItems(e) {
        let isSelected = e.target.checked;
        let value = e.target.value;
        if (!isSelected) {
            setFilters((prevData) => {
                return prevData.filter((item) => item != value);
            });
            return;
        }
        setFilters([...filters, value]);
    }

    useEffect(() => {
        getBrands();
        getCategories();
        getGenders();
        getProducts();
    }, []);

    useEffect(() => {
        switch (ordenacao) {
            case 1:
                setItensFiltrados([...itensFiltrados.sort((a, b) => b.review_rate - a.review_rate)]);
                break;
            case 2:
                setItensFiltrados([...itensFiltrados.sort((a, b) => a.product_price - b.product_price)]);
                break;
            case 3:
                setItensFiltrados([...itensFiltrados.sort((a, b) => b.product_price - a.product_price)]);
                break;
        }
    }, [ordenacao, setItensFiltrados]);

    useEffect(() => {
        if (filters.length > 0) {
            const busca = products.filter(p => filters.some(f => f === p.brand_name));
            setItensFiltrados([...busca])
        }
    }, [filters, products, setItensFiltrados])

    return (
        <PageProductsContainer>
            <div className="flex justify-content-between align-items-center">
                <h6 className="font-normal">
                    <b>Resultados para "Tenis"</b> - 389 produtos
                </h6>
                <div>
                    <h6 className="p-3 border-1 border-round">
                        <b>Ordenar por mais relevantes:</b>
                        <Dropdown
                            value={ordenacao}
                            options={tiposDeOrdenacao}
                            optionLabel="name"
                            optionValue="value"
                            onChange={e => setOrdenacao(e.target.value)}
                            className="border-0 bg-transparent"
                        />
                    </h6>
                </div>
            </div>
            <div className="content flex gap-3">
                <div className="w-3">
                    <div className="bg-white p-4 border-round">
                        <h4 className="mb-3">Filtrar por:</h4>
                        <hr className="mb-3" />
                        <h6 className="mb-2">Marca</h6>
                        <ul className="list-style-none">
                            {
                                brands.map((marca) => (
                                    <li key={marca.brand_id} className="flex gap-3 mb-2">
                                        <Checkbox
                                            id={marca.brand_name}
                                            value={marca.brand_name}
                                            onChange={(e) => checkSelectedItems(e)}
                                            checked={filters.includes(marca.brand_name)}
                                        />
                                        <label htmlFor={marca.brand_name}>{marca.brand_name}</label>
                                    </li>
                                ))
                            }
                        </ul>
                        <h6 className="mb-2 mt-3">Categoria</h6>
                        <ul className="list-style-none">
                            {
                                categories.map((c) => (
                                    <li key={c.category_id} className="flex gap-3 mb-2">
                                        <Checkbox
                                            id={c.category_name}
                                            value={c.category_name}
                                            onChange={(e) => checkSelectedItems(e)}
                                            checked={filters.includes(c.category_name)}
                                        />
                                        <label htmlFor={c.category_name}>{c.category_name}</label>
                                    </li>
                                ))
                            }
                        </ul>
                        <h6 className="mb-2 mt-3">Gênero</h6>
                        <ul className="list-style-none">
                            {
                                genders.map((g) => (
                                    <li key={g.gender_id} className="flex gap-3 mb-2">
                                        <Checkbox
                                            id={g.gender_name}
                                            value={g.gender_name}
                                            onChange={(e) => checkSelectedItems(e)}
                                            checked={filters.includes(g.gender_name)}
                                        />
                                        <label htmlFor={g.gender_name}>{g.gender_name}</label>
                                    </li>
                                ))
                            }
                        </ul>
                        <h6 className="mb-2 mt-3">Estado</h6>
                        <ul className="list-style-none">
                            <li className="flex gap-3 mb-2">
                                <RadioButton
                                    id="novo"
                                    onChange={() => setEstado('novo')}
                                    checked={estado == 'novo'}
                                />
                                <label htmlFor="novo" onClick={() => setEstado('novo')}>Novo</label>
                            </li>
                            <li className="flex gap-3 mb-2">
                                <RadioButton
                                    id="usado"
                                    onChange={() => setEstado('usado')}
                                    checked={estado == 'usado'}
                                />
                                <label htmlFor="usado" onClick={() => setEstado('usado')}>Usado</label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-9 flex flex-wrap gap-3">
                    {
                        itensFiltrados.map(p => (
                            <Product
                                key={p.product_id}
                                name={`${p.brand_name} ${p.product_name}`}
                                image={p.product_image}
                                categoryName={p.category_name}
                                discount={p.product_discount}
                                price={p.product_price}
                            />
                        ))
                    }
                </div>
            </div>
        </PageProductsContainer>
    );
}

export default PageProducts;