package me.code.springproducts.product;

import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Repository
public class ProductRepository {

    private Map<String, Product> products = new HashMap<>();

    public Product get(String name) {
        return products.get(name.toLowerCase());
    }

    public void save(Product product) {
        products.put(product.getName().toLowerCase(), product);
    }

    public Collection<Product> getProducts() {
        return products.values();
    }

}
