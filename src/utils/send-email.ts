import { BREVO_API_KEY } from "@/constants";

const brevo = require("@getbrevo/brevo");
export const sendEmail = async (
    email: string,
    jobDescription: string,
  position: string
) => {
  let apiInstance = new brevo.TransactionalEmailsApi();

  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey =
    BREVO_API_KEY.first + BREVO_API_KEY.second + BREVO_API_KEY.third;
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.templateId = 1;
  
  sendSmtpEmail.to = [{ email: email }];
  sendSmtpEmail.params = { jobDescription: jobDescription, position: position };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
  } catch (error) {
    console.error(error);
  }
};
