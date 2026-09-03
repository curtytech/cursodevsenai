const password = "mySecurePassword";
const saltRounds = 10; // Cost factor

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("Hashed password:", hash);
    }
});