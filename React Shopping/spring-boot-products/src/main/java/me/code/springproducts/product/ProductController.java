package me.code.springproducts.product;

import me.code.springproducts.user.User;
import me.code.springproducts.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.List;

@CrossOrigin()
@RestController
@RequestMapping("/product")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    UserService userService;


    @GetMapping("/all")
    public Collection<Product> getProducts(@RequestHeader("token") String token, HttpServletResponse response) {
        if (userService.validate(token) == null) {
            response.setStatus(401);
            return null;
        }

        return productService.getProducts();
    }

    @GetMapping("/favorites")
    public List<Product> getFavorites(@RequestHeader("token") String token, HttpServletResponse response) {
        User user = userService.validate(token);
        if (user == null) {
            response.setStatus(401);
            return null;
        }

        return user.getFavorites();
    }

    @PutMapping("/add-favorite")
    public String getFavorites(@RequestHeader("token") String token, @RequestBody String productName, HttpServletResponse response) {
        User user = userService.validate(token);
        if (user == null) {
            response.setStatus(401);
            return null;
        }

        int result = productService.addFavorite(user, productName);
        switch (result) {
            case 1:
                response.setStatus(404);
                return "There is no product with that name";
            case 0:
                return "Product has been added to user's favorites";
            default:
                response.setStatus(500);
                return "Something went wrong.";
        }
    }

    @PutMapping("/create")
    public String createProduct(@RequestHeader("token") String token, @RequestBody Product product, HttpServletResponse response) {
        if (userService.validate(token) == null) {
            response.setStatus(401);
            return null;
        }

        int result = productService.createProduct(product);
        switch (result) {
            case 1:
                response.setStatus(409);
                return "There is already a product with that name";
            case 0:
                return "Product has been created";
            default:
                response.setStatus(500);
                return "Something went wrong.";
        }
    }
}
