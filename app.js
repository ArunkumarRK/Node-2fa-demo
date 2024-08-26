const express = require("express");
const { authenticator } = require("otplib");
const qrCode1 = require("qrcode");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const generateSecret = () => authenticator.generateSecret();

const generateOTP = (secret) => authenticator.generate(secret);

const verifyOTP = (secret, token) => authenticator.verify({ secret, token });

const generateQRCode = async (secret) => {
  const otpauthURL = authenticator.keyuri(
    "arunkr4@gmail.com",
    "Tarvah-Base",
    secret
  );
  try {
    // const qrCode = generateOTP(secret);
    const qrImage = await qrCode1.toDataURL(otpauthURL);
    return qrImage;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

app.get("/", async (req, res) => {
  const secret = generateSecret();
  console.log("Secret key:", secret);
  const qrCode = await generateQRCode(secret);
  res.render("index", { secret, qrCode });
});

app.post("/verify", (req, res) => {
  const { secret, token } = req.body;
  const isValid = verifyOTP(secret, token);
  res.render("result", { isValid });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
