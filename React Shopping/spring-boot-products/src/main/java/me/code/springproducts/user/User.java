package me.code.springproducts.user;

import lombok.Getter;
import lombok.Setter;
import me.code.springproducts.product.Product;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class User {

    private String name, password;
    private List<Product> favorites;

    public User(String name, String password) {
        this.name = name;
        this.password = password;
        this.favorites = new ArrayList<>();
    }
}
