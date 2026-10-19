import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AddIngredient from '../AddIngredient/AddIngredient';

const baseURL = 'http://localhost:8080/api/recipes';

function EditRecipe() {
    const { recipeId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        ingredients: [],
    });
    const [listId, setListId] = useState(1);

    useEffect(() => {
        axios.get(`${baseURL}/recipe/${recipeId}`).then((response) => {
            const recipe = response.data;
            const ingredientsWithListId = (recipe.ingredients || []).map((ing, idx) => ({
                ...ing,
                listId: idx + 1,
            }));
            setFormData({ ...recipe, ingredients: ingredientsWithListId });
            setListId(ingredientsWithListId.length + 1);
        });
    }, [recipeId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [
                ...formData.ingredients,
                { listId: listId, ingredient: '', unit: 'PIECE', quantity: '' },
            ],
        });
        setListId(listId + 1);
    };

    const updateIngredient = (ingredientObj) => {
        const updated = formData.ingredients.map((ing) =>
            ing.listId === ingredientObj.listId ? ingredientObj : ing
        );
        setFormData({ ...formData, ingredients: updated });
    };

    const removeIngredient = (ingredientObj) => {
        const updated = formData.ingredients.filter((ing) => ing.listId !== ingredientObj.listId);
        setFormData({ ...formData, ingredients: updated });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        axios.put(`${baseURL}/recipe/${recipeId}`, formData)
            .then(() => {
                alert('Recipe updated successfully!');
                navigate('/');
            })
            .catch((error) => {
                console.error('Error updating recipe:', error);
                alert('Failed to update recipe. Please try again.');
            });
    };

    const renderIngredients = formData.ingredients.map((ingredient) => (
        <AddIngredient
            key={ingredient.listId}
            ingredient={ingredient}
            listId={listId - 1}
            updateIngredient={updateIngredient}
            removeIngredient={removeIngredient}
        />
    ));

    return (
        <>
            <div className="bg">
                <div className="m-3">
                    <h1 className="h3 bg-dark text-bg-primary mt-2">Edit Recipe</h1>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-1" controlId="editName">
                            <Form.Label>Recipe Name:</Form.Label>
                            <Form.Control
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-1" controlId="editDescription">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-1 mb-5" controlId="editImageUrl">
                            <Form.Label>Image URL:</Form.Label>
                            <Form.Control
                                name="imageUrl"
                                placeholder="URL"
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Row>
                            <Col>Ingredient</Col>
                            <Col>Unit</Col>
                            <Col>Quantity</Col>
                            <Col xs={1}></Col>
                        </Row>
                        <hr />
                        <Row><br /></Row>
                        {renderIngredients}
                        <Row>
                            <br />
                            <Button
                                variant="warning"
                                onClick={addIngredient}
                                className="mt-1"
                                type="button"
                            >Add Ingredient</Button>
                        </Row>
                        <Button variant="success" type="submit" className="mb-5 mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default EditRecipe;
