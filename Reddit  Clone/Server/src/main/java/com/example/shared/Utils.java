package com.example.shared;

import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class Utils {
    /* Java spring username encode and decode
       https://www.codegrepper.com/code-examples/java/java+spring+what+salt+to+use+for+password+encryption
    */
    private static final String ALGO = "AES";
    private static final String salt = "AnimeFruitBasket"; // must be length of 16, 24, 32 etc
    private static final byte[] keyValue = salt.getBytes(StandardCharsets.UTF_8);

    public static String encrypt(String pwd) {
        String encodedPwd = "";
        try {
            Key key = generateKey();
            Cipher c = Cipher.getInstance(ALGO);
            c.init(Cipher.ENCRYPT_MODE, key);
            byte[] encVal = c.doFinal(pwd.getBytes());
            encodedPwd = Base64.getEncoder().encodeToString(encVal);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return encodedPwd;

    }

    public static String decrypt(String encryptedData) {
        String decodedPWD = "";
        try {
            Key key = generateKey();
            Cipher c = Cipher.getInstance(ALGO);
            c.init(Cipher.DECRYPT_MODE, key);
            byte[] decordedValue = Base64.getDecoder().decode(encryptedData);
            byte[] decValue = c.doFinal(decordedValue);
            decodedPWD = new String(decValue);

        } catch (Exception ignored) {

        }
        return decodedPWD;
    }

    private static Key generateKey() {
        return new SecretKeySpec(keyValue, ALGO);
    }
}
