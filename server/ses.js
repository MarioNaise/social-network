const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the
    //region in which you have verified your email address
    // (or 'eu-west-1' if you are using the Spiced credentials)
});

exports.sendEmail = (recipient, message, subject) => {
    return (
        ses
            .sendEmail({
                Source: "Calico Cosmos <calico.cosmos@spicedling.email>",
                Destination: {
                    ToAddresses: [recipient],
                },
                Message: {
                    Body: {
                        Text: {
                            Data: message,
                        },
                    },
                    Subject: {
                        Data: subject,
                    },
                },
            })
            .promise()
            // .then(() => console.log("it worked!"))
            .catch((err) => console.log("error in ses: ", err))
    );
};
