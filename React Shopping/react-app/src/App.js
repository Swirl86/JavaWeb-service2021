import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import LoginForm from "./components/user/LoginForm";
import SignUpForm from "./components/user/SignUpForm";
import Product from "./components/product/Product";
import ProductForm from "./components/product/ProductForm";
import "./styles/App.css";

const serverURL = "http://localhost:8080";

const App = () => {
    const [products, setProducts] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [token, setToken] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const updateState = () => {
        setLoggedIn(false);
        setToken("");
    };

    const addToken = (resp) => {
        setToken(resp);
    };

    const addFavoriteProduct = (product) => {
        setFavoriteProducts([...favoriteProducts, product]);
    };

    const addProduct = (product) => {
        setProducts([...products, product]);
    };

    const successLoggedIn = () => {
        setLoggedIn(true);
    };

    const fetchAll = useCallback(
        (path) => {
            fetch(serverURL + path, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (path === "/product/all") {
                        setProducts(data);
                    } else {
                        setFavoriteProducts(data);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        },
        [token]
    );
    useEffect(() => {
        if (loggedIn) {
            fetchAll("/product/all");
            fetchAll("/product/favorites");
        }
    }, [loggedIn, fetchAll]);

    // Filter to remove favorites from product list
    /* products
        .filter((value) =>
            favoriteProducts.every(
                (value2) => !value2.name.includes(value.name)
            )
        )
    */
    const Products = () => {
        return (
            <div className="container">
                <h1>All Products In Stock</h1>
                {products.map((product, index) => (
                    <Product
                        key={index}
                        product={product}
                        token={token}
                        favorite={favoriteProducts.some(
                            (obj) => obj.name === product.name
                        )}
                        setFavoriteProducts={addFavoriteProduct}
                    />
                ))}
            </div>
        );
    };

    const FavoriteProducts = () => {
        return (
            <div className="container">
                <h1>My Favorite Products</h1>
                {favoriteProducts.map((product, index) => (
                    <Product
                        key={index}
                        product={product}
                        token={token}
                        favorite={true}
                        setFavoriteProducts={addFavoriteProduct}
                    />
                ))}
            </div>
        );
    };

    const EmptyProductList = () => {
        return (
            <h1 style={{ width: "100%", textAlign: "center", marginTop: "10px" }}>
                Nothing to show here! ʕ •ᴥ•ʔ
            </h1>
        );
    };

    const loggedInView = () => {
        return (
            <>
                <ProductForm
                    token={token}
                    resetStates={updateState}
                    addProduct={addProduct}
                />

                <div>
                    <Products />
                    {products.length === 0 && <EmptyProductList />}
                </div>

                <div>
                    <FavoriteProducts />
                    {favoriteProducts.length === 0 && <EmptyProductList />}
                </div>
            </>
        );
    };

    const logInView = () => {
        return (
            <div className="user-form">
                <LoginForm setLoggedIn={successLoggedIn} setToken={addToken} />
                <SignUpForm />
            </div>
        );
    };

    return (
        <div className="app">
            <Navbar />
            {loggedIn ? loggedInView() : logInView()}
        </div>
    );
};

export default App;
