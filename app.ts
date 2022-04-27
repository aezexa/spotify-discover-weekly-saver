import express from "express";
import querystring from "querystring";
import spotifywebapi from "spotify-web-api-node";
import { client_id, client_secret, redirect_uri } from "./secrets";

const app = express();
const port = 8888;

function generateRandomString(length: number): string {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

app.get("/login", function (req, res) {
    var state = generateRandomString(16);
    var scope = "user-read-private user-read-email";
    res.redirect(
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
        })
    );
});

app.get("/callback", function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect(
            "/#" +
            querystring.stringify({
                error: "state_mismatch",
            })
        );
    } else {
        var authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code",
            },
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(client_id + ":" + client_secret).toString("base64"),
            },
            json: true,
        };
    }
    res.post(authOptions)
});

app.listen(port, () => {
    return console.log(`Example app listening on port ${port}!`);
});
