
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Category } from '../../../types';
import AdminCategoryModal from './AdminCategoryModal';

const AdminCategoriesPage: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

    const handleOpenAddModal = () => {
        setCategoryToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category: Category) => {
        setCategoryToEdit(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCategoryToEdit(null);
    };

    const handleSaveCategory = (categoryData: Omit<Category, 'id'>) => {
        if (categoryToEdit) {
            updateCategory(categoryToEdit.id, categoryData);
        } else {
            addCategory(categoryData);
        }
        handleCloseModal();
    };

    const handleDelete = (categoryId: number, categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
            deleteCategory(categoryId);
        }
    };

    return (
        <>
            <AdminCategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                categoryToEdit={categoryToEdit}
            />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Manage Categories</h1>
                    <button onClick={handleOpenAddModal} className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                        <i className="fas fa-plus mr-2"></i>Add Category
                    </button>
                </div>

                {categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Image</th>
                                    <th scope="col" className="px-6 py-3">Category Name</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded-md" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 flex space-x-2">
                                            <button onClick={() => handleOpenEditModal(category)} className="text-blue-500 hover:text-blue-700" title="Edit Category">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button onClick={() => handleDelete(category.id, category.name)} className="text-red-500 hover:text-red-700" title="Delete Category">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <i className="fas fa-tags text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-700">No categories found</h3>
                        <p className="text-gray-500 mt-1">Get started by adding your first product category.</p>
                        <button onClick={handleOpenAddModal} className="mt-4 bg-amber-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                            Add First Category
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminCategoriesPage;
