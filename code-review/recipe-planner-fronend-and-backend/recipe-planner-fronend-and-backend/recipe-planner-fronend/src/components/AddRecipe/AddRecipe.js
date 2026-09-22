import React, {useState} from 'react';
import './AddRecipe.css';
import {useForm} from "react-hook-form";
import {Form, Button, Col, Row, Alert} from 'react-bootstrap';

import axios from "axios";
import AddIngredient from "../AddIngredient/AddIngredient";

const isValidUrl = (value) => {
    if (!value) return true;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const getErrorMessage = (error) => {
    if (error.code === 'ECONNABORTED') {
        return 'The request timed out. Please try again.';
    }
    if (error.response) {
        const serverMessage = error.response.data?.message || error.response.data?.error;
        if (serverMessage) return serverMessage;
        if (error.response.status === 400) return 'Please check the recipe details and try again.';
        if (error.response.status >= 500) return 'Something went wrong on the server. Please try again later.';
        return `Request failed with status ${error.response.status}.`;
    }
    if (error.request) {
        return 'Could not reach the server. Please check your connection and try again.';
    }
    return 'An unexpected error occurred. Please try again.';
};

const API_BASE_URL = "http://localhost:8080/api";

function AddRecipe() {
    const [formData, setFormData] = useState({
        ingredients: [],
    });

    const [listId, setListId] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [ingredientErrors, setIngredientErrors] = useState({});

    const {
        register, handleSubmit, reset, formState: {errors},
    } = useForm();

    const addIngredient = () => {
        setFormData({
            ...formData, ingredients: [...formData.ingredients, {
                listId: listId, ingredient: '', unit: 'PIECE', quantity: '',
            },],
        });
        setListId(listId + 1);
    };

    const updateIngredient = (ingredientObj) => {
        const updatedIngredients = formData.ingredients.map((ingredient) => {
            if (ingredient.listId === ingredientObj.listId) {
                return ingredientObj;
            }
            return ingredient;
        });
        setFormData({...formData, ingredients: updatedIngredients});

        setIngredientErrors((prev) => {
            if (!prev[ingredientObj.listId]) return prev;
            const next = {...prev};
            delete next[ingredientObj.listId];
            return next;
        });
    };

    const removeIngredient = (ingredientObj) => {
        const updatedIngredients = formData.ingredients.filter((ingredient) => ingredient.listId !== ingredientObj.listId);
        setFormData({...formData, ingredients: updatedIngredients});

        setIngredientErrors((prev) => {
            const next = {...prev};
            delete next[ingredientObj.listId];
            return next;
        });
    };

    const validateIngredients = (ingredients) => {
        const errorsByListId = {};
        let generalError = null;

        if (ingredients.length === 0) {
            generalError = 'Add at least one ingredient.';
        }

        ingredients.forEach((ing) => {
            const fieldErrors = {};
            const name = (ing.ingredient || '').trim();
            if (!name) {
                fieldErrors.ingredient = 'Ingredient name is required.';
            } else if (name.length > 120) {
                fieldErrors.ingredient = 'Ingredient name must be under 120 characters.';
            }

            if (!ing.unit) {
                fieldErrors.unit = 'Unit is required.';
            }

            const quantityStr = String(ing.quantity ?? '').trim();
            if (!quantityStr) {
                fieldErrors.quantity = 'Quantity is required.';
            } else {
                const quantityNum = Number(quantityStr);
                if (Number.isNaN(quantityNum)) {
                    fieldErrors.quantity = 'Quantity must be a number.';
                } else if (quantityNum <= 0) {
                    fieldErrors.quantity = 'Quantity must be greater than 0.';
                }
            }

            if (Object.keys(fieldErrors).length > 0) {
                errorsByListId[ing.listId] = fieldErrors;
            }
        });

        return {
            valid: !generalError && Object.keys(errorsByListId).length === 0, errorsByListId, generalError,
        };
    };

    const onSubmit = async (data) => {
        setSubmitError(null);
        setSubmitSuccess(false);

        const trimmedName = data.name.trim();
        if (!trimmedName) {
            setSubmitError('Recipe name cannot be blank or only whitespace.');
            return;
        }

        const {valid, errorsByListId, generalError} = validateIngredients(formData.ingredients);
        setIngredientErrors(errorsByListId);
        if (!valid) {
            setSubmitError(generalError || 'Please fix the highlighted ingredient fields.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            name: trimmedName,
            description: (data.description || '').trim(),
            imageUrl: (data.imageUrl || '').trim(),
            ingredients: formData.ingredients.map(({listId: _listId, ...rest}) => ({
                ...rest, ingredient: rest.ingredient.trim(), quantity: Number(rest.quantity),
            })),
        };

        try {
            await axios.post(`${API_BASE_URL}/recipes`, payload, {
                timeout: 10000,
            });
            setSubmitSuccess(true);
            setFormData({ingredients: []});
            setListId(1);
            setIngredientErrors({});
            reset();
        } catch (error) {
            console.error('Failed to submit recipe:', error);
            setSubmitError(getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderIngredients = formData.ingredients.map((ingredient) => (<AddIngredient
        key={ingredient.listId}
        ingredient={ingredient}
        errors={ingredientErrors[ingredient.listId]}
        updateIngredient={updateIngredient}
        removeIngredient={removeIngredient}
        disabled={isSubmitting}
    />));

    return (<>
        <div className="bg">
            <div className="m-3">
                <h1 className="h3 bg-dark text-bg-primary mt-2">Add Recipe</h1>

                {submitSuccess && (<Alert variant="success" onClose={() => setSubmitSuccess(false)} dismissible>
                    Recipe submitted successfully!
                </Alert>)}
                {submitError && (<Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>
                    {submitError}
                </Alert>)}

                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-1" controlId="formBasicName">
                        <Form.Label column={"sm"}>Recipe Name:</Form.Label>
                        <Form.Control
                            placeholder="Name"
                            {...register('name', {
                                required: 'Recipe name is required.',
                                minLength: {value: 2, message: 'Name must be at least 2 characters.'},
                                maxLength: {value: 120, message: 'Name must be under 120 characters.'},
                                validate: (value) => value.trim().length > 0 || 'Recipe name cannot be blank or only whitespace.',
                            })}
                            isInvalid={!!errors.name}
                            disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="formBasicDescription">
                        <Form.Label column={"sm"}>Description:</Form.Label>
                        <Form.Control
                            placeholder="Description"
                            as="textarea"
                            rows={3}
                            {...register('description', {
                                maxLength: {value: 1000, message: 'Description must be under 1000 characters.'},
                            })}
                            isInvalid={!!errors.description}
                            disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-1 mb-5" controlId="formBasicImageUrl">
                        <Form.Label column={"sm"}>Image URL:</Form.Label>
                        <Form.Control
                            placeholder="URL"
                            {...register('imageUrl', {
                                validate: (value) => isValidUrl(value) || 'Enter a valid URL (e.g. https://...).',
                            })}
                            isInvalid={!!errors.imageUrl}
                            disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.imageUrl?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col>Ingredient</Col>
                        <Col>Unit</Col>
                        <Col>Quantity</Col>
                        <Col xs={1}></Col>
                    </Row>
                    <hr/>

                    {formData.ingredients.length === 0 && (<Row>
                        <Col className="text-muted">No ingredients added yet.</Col>
                    </Row>)}

                    {renderIngredients}

                    <Row>
                        <br/>
                        <Col>
                            <Button
                                variant="warning"
                                type="button"
                                onClick={addIngredient}
                                className="mt-1"
                                disabled={isSubmitting}
                            >
                                Add Ingredient
                            </Button>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="mt-3 mb-5" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting…' : 'Submit'}
                    </Button>
                </Form>
            </div>
        </div>
    </>);
}

export default AddRecipe;