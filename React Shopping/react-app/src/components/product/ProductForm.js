import React, { useEffect, useState } from "react";
import Message from "../Message";

import { Button } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const serverURL = "http://localhost:8080";
const defaultInputString = { name: "", description: "", price: "" };

function ProductForm({ token, resetStates, addProduct }) {
    const [product, setProduct] = useState(defaultInputString);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(defaultInputString);

    useEffect(() => {
        const timerId = setTimeout(() => setShowMessage(false), 5000);
        //Clean up callback
        return () => clearTimeout(timerId);
    }, [showMessage]);

    const logout = async () => {
        await fetch(serverURL + "/user/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token,
            },
        });
        resetStates();
    };

    const createProduct = (input) => {
        fetch(serverURL + "/product/create", {
            method: "PUT",
            responseType: "text",
            headers: {
                "Content-Type": "application/json",
                token,
            },
            body: JSON.stringify({
                name: input.name,
                description: input.description,
                price: input.price,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    addProduct(product);
                    setProduct(defaultInputString);
                }
                return response.text();
            })
            .then((data) => {
                setMessage(data);
                setShowMessage(true);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!product.name || !product.description || !product.price) return;
        createProduct(product);
    };

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    return (
        <>
            {showMessage && <Message msg={message} />}
            <div className="container">
                <Button
                    id="logout-button"
                    variant="contained"
                    endIcon={<ExitToAppIcon />}
                    color="secondary"
                    onClick={() => logout()}
                >
                    Logout
                </Button>
                <div className="login">
                    <form onSubmit={handleSubmit}>
                        <h3
                            style={{
                                marginLeft: "3em",
                            }}
                        >
                            Product information:
                        </h3>
                        <input
                            type="text"
                            className="input"
                            name="name"
                            value={product.name}
                            placeholder="Product Name"
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            className="input"
                            name="description"
                            value={product.description}
                            placeholder="Description"
                            required
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            className="input"
                            name="price"
                            pattern="[0-9]*"
                            value={product.price}
                            placeholder="Price"
                            required
                            onChange={handleChange}
                        />
                        <button type="submit" id="login-button">
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ProductForm;
