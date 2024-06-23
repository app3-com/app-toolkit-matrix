'use client'

import React, { useState, useMemo } from 'react';
import { Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const ComparisonMatrix = () => {
    const [aspects, setAspects] = useState([
        { id: 1, name: 'Productivity', weight: 5 },
        { id: 2, name: 'Biz Ops', weight: 3 },
        { id: 3, name: 'Ecosystem', weight: 5 },
        { id: 4, name: 'Stability', weight: 5 },
        { id: 5, name: 'Support', weight: 4 },
        { id: 6, name: 'Devops', weight: 4 },
        { id: 7, name: 'Backend Features', weight: 4 },
        { id: 8, name: 'Learnability', weight: 5 },
        { id: 9, name: 'Current Knowledge Level', weight: 3 },
        { id: 10, name: 'Freedom', weight: 4 },
        { id: 11, name: 'UX', weight: 5 },
        { id: 12, name: 'Performance', weight: 2 },
        { id: 13, name: 'Security', weight: 5 },
    ]);

    const [products, setProducts] = useState([
        { id: 1, name: 'Django', scores: { 1: 4, 2: 4, 3: 4, 4: 5, 5: 4, 6: 4, 7: 4, 8: 5, 9: 2, 10: 5, 11: 3, 12: 5, 13: 4 } },
        { id: 2, name: 'NextJS/Amplify', scores: { 1: 4, 2: 5, 3: 5, 4: 5, 5: 4, 6: 5, 7: 5, 8: 5, 9: 3, 10: 4, 11: 5, 12: 5, 13: 5 } },
        { id: 3, name: 'NextJS/Vercel', scores: { 1: 5, 2: 2, 3: 5, 4: 5, 5: 4, 6: 4, 7: 3, 8: 5, 9: 2, 10: 4, 11: 5, 12: 5, 13: 4 } },
        { id: 4, name: 'Laravel', scores: { 1: 4, 2: 3, 3: 5, 4: 4, 5: 4, 6: 3, 7: 4, 8: 4, 9: 3, 10: 4, 11: 4, 12: 4, 13: 4 } },
        { id: 5, name: 'Rails', scores: { 1: 3, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 2, 10: 4, 11: 4, 12: 4, 13: 4 } },
        { id: 6, name: 'Reflex', scores: { 1: 4, 2: 3, 3: 5, 4: 4, 5: 3, 6: 2, 7: 3, 8: 3, 9: 3, 10: 5, 11: 5, 12: 5, 13: 4 } },
        { id: 7, name: 'SvelteKit/Amplify', scores: { 1: 3, 2: 3, 3: 5, 4: 2, 5: 2, 6: 2, 7: 4, 8: 5, 9: 4, 10: 4, 11: 5, 12: 3, 13: 5 } },
        { id: 8, name: 'SvelteKit/Vercel', scores: { 1: 2, 2: 2, 3: 5, 4: 2, 5: 2, 6: 2, 7: 4, 8: 4, 9: 3, 10: 4, 11: 5, 12: 3, 13: 3 } },
        { id: 9, name: 'Dotnet/Blazor', scores: { 1: 3, 2: 2, 3: 2, 4: 2, 5: 4, 6: 3, 7: 3, 8: 4, 9: 2, 10: 2, 11: 5, 12: 4, 13: 3 } },
    ]);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const addAspect = () => {
        const newId = aspects.length + 1;
        setAspects([...aspects, { id: newId, name: `New Aspect ${newId}`, weight: 3 }]);
        setProducts(products.map(product => ({
            ...product,
            scores: { ...product.scores, [newId]: 3 }
        })));
    };

    const addProduct = () => {
        const newId = products.length + 1;
        const newScores = aspects.reduce((acc, aspect) => ({ ...acc, [aspect.id]: 3 }), {});
        setProducts([...products, { id: newId, name: `New Product ${newId}`, scores: newScores }]);
    };

    const updateAspect = (id, field, value) => {
        if (field === 'weight') {
            const numValue = parseInt(value);
            if (numValue >= 1 && numValue <= 5) {
                setAspects(aspects.map(aspect =>
                    aspect.id === id ? { ...aspect, [field]: numValue } : aspect
                ));
            }
        } else {
            setAspects(aspects.map(aspect =>
                aspect.id === id ? { ...aspect, [field]: value } : aspect
            ));
        }
    };

    const updateProduct = (id, field, value) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, [field]: value } : product
        ));
    };

    const updateScore = (productId, aspectId, value) => {
        const numValue = parseInt(value);
        if (numValue >= 1 && numValue <= 5) {
            setProducts(products.map(product =>
                product.id === productId
                    ? { ...product, scores: { ...product.scores, [aspectId]: numValue } }
                    : product
            ));
        }
    };

    const calculateTotals = useMemo(() => {
        return products.map(product => {
            const total = aspects.reduce((sum, aspect) => {
                return sum + (product.scores[aspect.id] * aspect.weight);
            }, 0);
            return { ...product, total };
        });
    }, [products, aspects]);

    const sortedProducts = useMemo(() => {
        let sortableProducts = [...calculateTotals];
        if (sortConfig.key !== null) {
            sortableProducts.sort((a, b) => {
                if (sortConfig.key === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (sortConfig.key === 'total') {
                    return a.total - b.total;
                } else {
                    return a.scores[sortConfig.key] - b.scores[sortConfig.key];
                }
            });
            if (sortConfig.direction === 'descending') {
                sortableProducts.reverse();
            }
        }
        return sortableProducts;
    }, [calculateTotals, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key === columnKey) {
            return sortConfig.direction === 'ascending' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
        }
        return <ArrowUpDown size={16} />;
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Comparison Matrix</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 table-fixed">
                    <colgroup>
                        <col className="w-1/6" />
                        {aspects.map((aspect) => (
                            <col key={aspect.id} className="w-20" />
                        ))}
                        <col className="w-24" />
                    </colgroup>
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 sticky left-0 bg-gray-100 z-10">Products</th>
                        {aspects.map(aspect => (
                            <th key={aspect.id} className="border p-2">
                                <div className="flex flex-col items-center">
                    <span className="font-bold whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                      {aspect.name}
                    </span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[1-5]"
                                        value={aspect.weight}
                                        onChange={(e) => updateAspect(aspect.id, 'weight', e.target.value)}
                                        className={`mt-1 p-1 border rounded w-full text-center ${
                                            aspect.weight < 1 || aspect.weight > 5 ? 'border-red-500' : ''
                                        }`}
                                    />
                                </div>
                            </th>
                        ))}
                        <th className="border p-2 bg-yellow-100">Totals</th>
                    </tr>
                    <tr className="bg-gray-200">
                        <th className="border p-2 sticky left-0 bg-gray-200 z-10">
                            <button
                                onClick={() => requestSort('name')}
                                className={`font-bold w-full text-left flex items-center justify-between ${sortConfig.key === 'name' ? 'text-blue-600' : ''}`}
                            >
                                Sort {getSortIcon('name')}
                            </button>
                        </th>
                        {aspects.map(aspect => (
                            <th key={aspect.id} className="border p-2">
                                <button
                                    onClick={() => requestSort(aspect.id)}
                                    className={`w-full font-bold flex items-center justify-center ${sortConfig.key === aspect.id ? 'text-blue-600' : ''}`}
                                >
                                    Sort {getSortIcon(aspect.id)}
                                </button>
                            </th>
                        ))}
                        <th className="border p-2 bg-yellow-200">
                            <button
                                onClick={() => requestSort('total')}
                                className={`font-bold w-full text-center flex items-center justify-center ${sortConfig.key === 'total' ? 'text-blue-600' : ''}`}
                            >
                                Sort {getSortIcon('total')}
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedProducts.map(product => (
                        <tr key={product.id}>
                            <td className="border p-2 sticky left-0 bg-white z-10">
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                    className="p-1 border rounded w-full"
                                />
                            </td>
                            {aspects.map(aspect => (
                                <td key={aspect.id} className="border p-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[1-5]"
                                        value={product.scores[aspect.id]}
                                        onChange={(e) => updateScore(product.id, aspect.id, e.target.value)}
                                        className={`w-full p-1 border rounded text-center ${
                                            product.scores[aspect.id] < 1 || product.scores[aspect.id] > 5 ? 'border-red-500' : ''
                                        }`}
                                    />
                                </td>
                            ))}
                            <td className="border p-2 bg-yellow-100 font-bold text-center">
                                {product.total}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <button onClick={addProduct} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Plus size={16} className="inline mr-1" /> Add Product
                </button>
                <button onClick={addAspect} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600">
                    <Plus size={16} className="inline mr-1" /> Add Aspect
                </button>
            </div>
        </div>
    );
};

export default ComparisonMatrix;