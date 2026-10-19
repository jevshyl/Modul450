import React, {useState} from 'react';
import './AddRecipe.css';
import {Form, Button, Col, Row} from 'react-bootstrap';
import axios from "axios";
import AddIngredient from "../AddIngredient/AddIngredient";

const baseURL = "http://localhost:8080/api/recipes";

function AddRecipe() {
    const [formData, setFormData] = useState({
        "name": '',
        "description": '',
        "imageUrl": '',
        "ingredients": [],
    })

    const [listId, setListId] = useState(1)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const addIngredient = () => {
        setFormData({...formData, ingredients: [
            ...formData.ingredients, {
                listId: listId,
                ingredient: '',
                unit: 'PIECE',
                quantity: ''
            }
        ]})
        setListId(listId + 1)
    }

    const updateIngredient = (ingredientObj) => {
        const updatedIngredients = formData.ingredients.map((ingredient) => {
            if (ingredient.listId === ingredientObj.listId) {
                return ingredientObj
            }
            return ingredient
        })
        setFormData({...formData, ingredients: updatedIngredients})
    }

    const removeIngredient = (ingredientObj) => {
        const updatedIngredients = formData.ingredients.filter((ingredient) => ingredient.listId !== ingredientObj.listId)
        setFormData({...formData, ingredients: updatedIngredients})
    }

    const onSubmit = (e) => {
        e.preventDefault()
        axios.post(baseURL, formData)
            .then(() => {
                alert("Recipe added successfully!")
                setFormData({ name: '', description: '', imageUrl: '', ingredients: [] })
                setListId(1)
            })
            .catch((error) => {
                console.error("Error adding recipe:", error)
                alert("Failed to add recipe. Please try again.")
            })
    }

    const renderIngredients = formData.ingredients.map(ingredient => <AddIngredient
        key={ingredient.listId}
        ingredient={ingredient}
        listId={listId - 1}
        updateIngredient={updateIngredient}
        removeIngredient={removeIngredient}
    />)

    return (
        <>
            <div className="bg">
                <div className="m-3">
                    <h1 className="h3 bg-dark text-bg-primary mt-2">Add Recipe</h1>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-1" controlId="formBasicName">
                            <Form.Label>Recipe Name:</Form.Label>
                            <Form.Control
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-1" controlId="formBasicDescription">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-1 mb-5" controlId="formBasicImageUrl">
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
                            <Col>Quanity</Col>
                            <Col xs={1}></Col>
                        </Row>
                        <hr/>
                        <Row>
                            <br></br>
                        </Row>
                        {renderIngredients}
                        <Row>
                            <br></br>
                            <Button
                                variant='warning'
                                onClick={addIngredient}
                                className="mt-1"
                                type="button"
                            >Add Ingredient</Button>
                        </Row>
                        <Button variant="primary" type="submit" className="mb-5 mt-3">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default AddRecipe;
