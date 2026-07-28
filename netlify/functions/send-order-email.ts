import nodemailer from "nodemailer";

const NOTIFICATION_EMAIL = "eggsistentialfarms@gmail.com";

type OrderData = {
  orderType?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  preferredDate?: string;
  pickupDate?: string;
  pickupLocation?: string;
  notes?: string;
  website?: string;
  [key: string]: unknown;
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeReadableLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return String(value ?? "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(
  status: number,
  body: {
    success: boolean;
    message: string;
    errorCode?: string;
  }
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default async (request: Request): Promise<Response> => {
  console.log("send-order-email function started");
  console.log("Request method:", request.method);

  if (request.method !== "POST") {
    return jsonResponse(405, {
      success: false,
      message: "Method not allowed.",
      errorCode: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailAppPassword =
      process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

    console.log("GMAIL_USER configured:", Boolean(gmailUser));
    console.log(
      "GMAIL_APP_PASSWORD configured:",
      Boolean(gmailAppPassword)
    );

    if (!gmailUser || !gmailAppPassword) {
      console.error(
        "Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variable."
      );

      return jsonResponse(500, {
        success: false,
        message:
          "The website email service has not been configured correctly.",
        errorCode: "MISSING_EMAIL_CONFIGURATION",
      });
    }

    let order: OrderData;

    try {
      order = (await request.json()) as OrderData;
    } catch (error) {
      console.error("Could not parse request JSON:", error);

      return jsonResponse(400, {
        success: false,
        message: "The submitted order data was invalid.",
        errorCode: "INVALID_JSON",
      });
    }

    console.log("Order received:", {
      orderType: order.orderType,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
    });

    /*
     * Honeypot spam field.
     * A legitimate user should never fill in "website".
     */
    if (order.website) {
      console.warn("Honeypot field was completed. Ignoring submission.");

      return jsonResponse(200, {
        success: true,
        message: "Order received.",
      });
    }

    const orderType =
      typeof order.orderType === "string" && order.orderType.trim()
        ? order.orderType.trim()
        : "Farm";

    const customerName =
      typeof order.customerName === "string" &&
      order.customerName.trim()
        ? order.customerName.trim()
        : "Customer";

    const customerEmail =
      typeof order.customerEmail === "string"
        ? order.customerEmail.trim()
        : "";

    const ignoredFields = new Set([
      "website",
      "form-name",
      "bot-field",
    ]);

    const visibleOrderFields = Object.entries(order).filter(
      ([key, value]) => {
        if (ignoredFields.has(key)) {
          return false;
        }

        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return false;
        }

        return true;
      }
    );

    const orderRows = visibleOrderFields
      .map(([key, value]) => {
        const label = escapeHtml(makeReadableLabel(key));
        const displayedValue = escapeHtml(formatValue(value));

        return `
          <tr>
            <td style="
              padding: 10px;
              border: 1px solid #dddddd;
              font-weight: bold;
              vertical-align: top;
              width: 35%;
            ">
              ${label}
            </td>

            <td style="
              padding: 10px;
              border: 1px solid #dddddd;
              vertical-align: top;
            ">
              ${displayedValue}
            </td>
          </tr>
        `;
      })
      .join("");

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "short",
    });

    const subject =
      `New ${orderType} Order from ${customerName}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    console.log("Checking Gmail SMTP connection...");

    try {
      await transporter.verify();
      console.log("Gmail SMTP connection verified.");
    } catch (error) {
      console.error("Gmail SMTP verification failed:", error);

      return jsonResponse(500, {
        success: false,
        message:
          "The order was received, but Gmail rejected the website's email credentials.",
        errorCode: "GMAIL_AUTHENTICATION_FAILED",
      });
    }

    const emailResult = await transporter.sendMail({
      from: `"Eggsistential Farms Website" <${gmailUser}>`,
      to: NOTIFICATION_EMAIL,
      replyTo:
        customerEmail && isValidEmail(customerEmail)
          ? customerEmail
          : undefined,
      subject,

      text: [
        `A new ${orderType} order was submitted.`,
        "",
        ...visibleOrderFields.map(
          ([key, value]) =>
            `${makeReadableLabel(key)}: ${formatValue(value)}`
        ),
        "",
        `Submitted: ${submittedAt}`,
      ].join("\n"),

      html: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>${escapeHtml(subject)}</title>
          </head>

          <body style="
            margin: 0;
            padding: 24px;
            background-color: #f5f2e9;
            font-family: Arial, Helvetica, sans-serif;
            color: #222222;
          ">
            <div style="
              max-width: 700px;
              margin: 0 auto;
              padding: 28px;
              background-color: #ffffff;
              border: 1px solid #dddddd;
              border-radius: 8px;
            ">
              <h1 style="margin-top: 0;">
                New ${escapeHtml(orderType)} Order
              </h1>

              <p>
                A new order was submitted through the
                Eggsistential Farms website.
              </p>

              <table style="
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              ">
                ${orderRows}
              </table>

              <p style="
                margin-top: 24px;
                color: #666666;
                font-size: 14px;
              ">
                Submitted: ${escapeHtml(submittedAt)}
              </p>

              ${
                customerEmail && isValidEmail(customerEmail)
                  ? `
                    <p style="font-size: 14px;">
                      Reply directly to this email to contact
                      ${escapeHtml(customerName)}.
                    </p>
                  `
                  : ""
              }
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email send completed.");
    console.log("Message ID:", emailResult.messageId);
    console.log("Accepted recipients:", emailResult.accepted);
    console.log("Rejected recipients:", emailResult.rejected);
    console.log("SMTP response:", emailResult.response);

    if (
      !emailResult.accepted ||
      emailResult.accepted.length === 0
    ) {
      console.error(
        "Gmail did not accept the notification recipient."
      );

      return jsonResponse(500, {
        success: false,
        message:
          "The order was received, but the notification email was not accepted.",
        errorCode: "EMAIL_NOT_ACCEPTED",
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Your order was submitted successfully.",
    });
  } catch (error) {
    console.error("Unexpected order email error:", error);

    return jsonResponse(500, {
      success: false,
      message:
        "We could not submit your order. Please try again or contact Eggsistential Farms directly.",
      errorCode: "UNEXPECTED_EMAIL_ERROR",
    });
  }
};
