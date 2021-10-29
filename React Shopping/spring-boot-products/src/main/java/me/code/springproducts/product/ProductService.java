package me.code.springproducts.product;

import me.code.springproducts.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Locale;

@Service
public class ProductService {

    @Autowired
    ProductRepository productRepository;

    public int createProduct(Product product) {
        Product existing = productRepository.get(product.getName());
        if (existing != null)
            return 1;

        productRepository.save(product);

        return 0;
    }

    public Collection<Product> getProducts() {
        return productRepository.getProducts();
    }

    public int addFavorite(User user, String productName) {
        Product product = productRepository.get(productName);
        if (product == null)
            return 1;

        user.getFavorites().add(product);
        return 0;
    }
}

