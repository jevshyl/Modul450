import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Col, Row, Alert, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import AddIngredient from '../AddIngredient/AddIngredient';

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
        if (error.response.status === 404) return 'This recipe no longer exists.';
        if (error.response.status >= 500) return 'Something went wrong on the server. Please try again later.';
        return `Request failed with status ${error.response.status}.`;
    }
    if (error.request) {
        return 'Could not reach the server. Please check your connection and try again.';
    }
    return 'An unexpected error occurred. Please try again.';
};


const API_BASE_URL = "http://localhost:8080/api/recipes";

const toEditableIngredients = (ingredients = []) =>
    ingredients.map((ing, index) => ({
        listId: index + 1,
        ingredient: ing.ingredient ?? ing.name ?? '',
        unit: ing.unit ?? 'PIECE',
        quantity: ing.quantity ?? '',
    }));

function UpdateRecipe({ show, recipe, onHide, onSaved }) {
    const [ingredients, setIngredients] = useState([]);
    const [listId, setListId] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [ingredientErrors, setIngredientErrors] = useState({});

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (show && recipe) {
            const editable = toEditableIngredients(recipe.ingredients);
            setIngredients(editable);
            setListId(editable.length + 1);
            setSubmitError(null);
            setIngredientErrors({});
            reset({
                name: recipe.name ?? '',
                description: recipe.description ?? '',
                imageUrl: recipe.imageUrl ?? '',
            });
        }
    }, [show, recipe, reset]);

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            { listId, ingredient: '', unit: 'PIECE', quantity: '' },
        ]);
        setListId(listId + 1);
    };

    const updateIngredient = (ingredientObj) => {
        setIngredients((prev) =>
            prev.map((ing) => (ing.listId === ingredientObj.listId ? ingredientObj : ing))
        );
        setIngredientErrors((prev) => {
            if (!prev[ingredientObj.listId]) return prev;
            const next = { ...prev };
            delete next[ingredientObj.listId];
            return next;
        });
    };

    const removeIngredient = (ingredientObj) => {
        setIngredients((prev) => prev.filter((ing) => ing.listId !== ingredientObj.listId));
        setIngredientErrors((prev) => {
            const next = { ...prev };
            delete next[ingredientObj.listId];
            return next;
        });
    };

    const validateIngredients = (list) => {
        const errorsByListId = {};
        let generalError = null;

        if (list.length === 0) {
            generalError = 'Add at least one ingredient.';
        }

        list.forEach((ing) => {
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
            valid: !generalError && Object.keys(errorsByListId).length === 0,
            errorsByListId,
            generalError,
        };
    };

    const onSubmit = async (data) => {
        setSubmitError(null);

        const trimmedName = data.name.trim();
        if (!trimmedName) {
            setSubmitError('Recipe name cannot be blank or only whitespace.');
            return;
        }

        const { valid, errorsByListId, generalError } = validateIngredients(ingredients);
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
            ingredients: ingredients.map(({ listId: _listId, ...rest }) => ({
                ...rest,
                ingredient: rest.ingredient.trim(),
                quantity: Number(rest.quantity),
            })),
        };

        try {
            const response = await axios.put(`${API_BASE_URL}/${recipe.id}`, payload, {
                timeout: 10000,
            });
            setIsSubmitting(false);
            onSaved?.(response.data ?? { ...recipe, ...payload });
            onHide();
        } catch (error) {
            console.error('Failed to update recipe:', error);
            setSubmitError(getErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    const renderIngredients = ingredients.map((ingredient) => (
        <AddIngredient
            key={ingredient.listId}
            ingredient={ingredient}
            errors={ingredientErrors[ingredient.listId]}
            updateIngredient={updateIngredient}
            removeIngredient={removeIngredient}
            disabled={isSubmitting}
        />
    ));

    return (
        <Modal show={show} onHide={onHide} centered size="lg" backdrop={isSubmitting ? 'static' : true}>
            <Modal.Header closeButton={!isSubmitting}>
                <Modal.Title>Edit Recipe</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Modal.Body>
                    {submitError && (
                        <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>
                            {submitError}
                        </Alert>
                    )}

                    <Form.Group className="mb-2" controlId="editRecipeName">
                        <Form.Label column={false}>Recipe Name:</Form.Label>
                        <Form.Control
                            placeholder="Name"
                            {...register('name', {
                                required: 'Recipe name is required.',
                                minLength: { value: 2, message: 'Name must be at least 2 characters.' },
                                maxLength: { value: 120, message: 'Name must be under 120 characters.' },
                                validate: (value) =>
                                    value.trim().length > 0 || 'Recipe name cannot be blank or only whitespace.',
                            })}
                            isInvalid={!!errors.name}
                            disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="editRecipeDescription">
                        <Form.Label column={false}>Description:</Form.Label>
                        <Form.Control
                            placeholder="Description"
                            as="textarea"
                            rows={3}
                            {...register('description', {
                                maxLength: { value: 1000, message: 'Description must be under 1000 characters.' },
                            })}
                            isInvalid={!!errors.description}
                            disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.description?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="editRecipeImageUrl">
                        <Form.Label column={false}>Image URL:</Form.Label>
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
                    <hr />

                    {ingredients.length === 0 && (
                        <Row>
                            <Col className="text-muted">No ingredients added yet.</Col>
                        </Row>
                    )}

                    {renderIngredients}

                    <Row>
                        <Col>
                            <Button
                                variant="warning"
                                type="button"
                                onClick={addIngredient}
                                className="mt-2"
                                disabled={isSubmitting}
                            >
                                Add Ingredient
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving…' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

UpdateRecipe.propTypes = {
    show: PropTypes.bool.isRequired,
    recipe: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        description: PropTypes.string,
        imageUrl: PropTypes.string,
        ingredients: PropTypes.array,
    }),
    onHide: PropTypes.func.isRequired,
    onSaved: PropTypes.func,
};

UpdateRecipe.defaultProps = {
    recipe: null,
    onSaved: undefined,
};

export default UpdateRecipe;