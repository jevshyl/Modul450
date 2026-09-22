import './Recipe.css';
import { Button, Card } from "react-bootstrap";
import React from "react";
import EditRecipeModal from "../UpdateRecipe/UpdateRecipe";

function Recipe(props) {

    const [showEdit, setShowEdit] = React.useState(false);

    const recipe = props.recipe;

    const onUpdateRecipe = (updatedRecipe) => {
        props.onUpdated?.(updatedRecipe);
    };

    return (
        <>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={recipe.imageUrl} />

                <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>

                    {recipe.description}

                    <Button
                        variant="primary"
                        onClick={() => setShowEdit(true)}
                    >
                        Edit Details
                    </Button>
                </Card.Body>
            </Card>

            <EditRecipeModal
                show={showEdit}
                recipe={recipe}
                onHide={() => setShowEdit(false)}
                onSaved={onUpdateRecipe}
            />
        </>
    );
}

export default Recipe;