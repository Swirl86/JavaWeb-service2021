import React, { useEffect, useState } from "react";

import FavoriteIcon from "@material-ui/icons/Favorite";
import { IconButton } from "@material-ui/core";

const serverURL = "http://localhost:8080";
const defaultErrorMsg = "Invalid information, check your input!";

function Product({ product, token, favorite, setFavoriteProducts }) {
    const [clicked, setClicked] = useState(favorite);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(defaultErrorMsg);

    useEffect(() => {
        const timerId = setTimeout(() => setShowMessage(false), 5000);
        //Clean up callback
        return () => clearTimeout(timerId);
    }, [showMessage]);

    const addToFavorite = () => {
        fetch(serverURL + "/product/add-favorite", {
            method: "PUT",
            responseType: "text",
            headers: {
                "Content-Type": "text/plain",
                token,
            },
            body: product.name,
        })
            .then((response) => {
                if (!response.ok) throw new Error(defaultErrorMsg);

                return response.text();
            })
            .then((data) => {
                setClicked(true);
                setFavoriteProducts(product);

                setMessage(data);
                //  TODO handle show message resets after added not showing message
                setShowMessage(true);
                console.log(data); // Receive messages but cant show it -_-
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div className="product">
            {showMessage && (
                <div
                    className="product-message"
                    id="product-message"
                    style={{ color: "red" }}
                >
                    <strong>{message}</strong>
                </div>
            )}
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <IconButton disabled={clicked} onClick={addToFavorite}>
                <FavoriteIcon color={clicked ? "secondary" : "primary"} />
            </IconButton>
        </div>
    );
}

export default Product;
