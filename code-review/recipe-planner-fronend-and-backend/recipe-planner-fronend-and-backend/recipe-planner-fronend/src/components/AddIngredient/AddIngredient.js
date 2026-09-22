import React from 'react';
import PropTypes from 'prop-types';
import './AddIngredient.css';
import {Button, Col, Form, Row} from "react-bootstrap";

const UNIT_OPTIONS = ['PIECE', 'GRAMM', 'KILOGRAMM', 'LITRE', 'DECILITRE'];

const AddIngredient = ({
                           ingredient,
                           errors = {},
                           updateIngredient,
                           removeIngredient,
                           disabled
                       }) => {

    const handleChange = (field) => (e) => {
        updateIngredient({
            ...ingredient,
            [field]: e.target.value,
        });
    };

    return (
        <Row className="mb-2">
            <Col>
                <Form.Group controlId={`ingredient-name-${ingredient.listId}`}>
                    <Form.Control
                        placeholder="Name"
                        value={ingredient.ingredient ?? ""}
                        onChange={handleChange('ingredient')}
                        isInvalid={!!errors.ingredient}
                        disabled={disabled}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.ingredient}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Col>
                <Form.Group controlId={`ingredient-unit-${ingredient.listId}`}>
                    <Form.Select
                        value={ingredient.unit ?? ""}
                        onChange={handleChange('unit')}
                        isInvalid={!!errors.unit}
                        disabled={disabled}
                    >
                        {UNIT_OPTIONS.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.unit}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Col>
                <Form.Group controlId={`ingredient-quantity-${ingredient.listId}`}>
                    <Form.Control
                        placeholder="Quantity"
                        type="number"
                        step="any"
                        min="0"
                        value={ingredient.quantity ?? ""}
                        onChange={handleChange('quantity')}
                        isInvalid={!!errors.quantity}
                        disabled={disabled}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.quantity}
                    </Form.Control.Feedback>
                </Form.Group>
            </Col>

            <Col xs={1}>
                <Button
                    onClick={() => removeIngredient(ingredient)}
                    variant="outline-dark"
                    className="mb-1"
                    disabled={disabled}
                    aria-label="Remove ingredient"
                >
                    x
                </Button>
            </Col>
        </Row>
    );
};

AddIngredient.propTypes = {
    ingredient: PropTypes.shape({
        listId: PropTypes.number.isRequired,
        ingredient: PropTypes.string,
        unit: PropTypes.string,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
    errors: PropTypes.shape({
        ingredient: PropTypes.string, unit: PropTypes.string, quantity: PropTypes.string,
    }),
    updateIngredient: PropTypes.func.isRequired,
    removeIngredient: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

AddIngredient.defaultProps = {
    errors: {}, disabled: false,
};

export default AddIngredient;