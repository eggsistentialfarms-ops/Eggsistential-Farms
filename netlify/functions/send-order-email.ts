import nodemailer from "nodemailer";

const NOTIFICATION_EMAIL = "eggsistentialfarms@gmail.com";

type OrderData = {
  orderType?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  pickupDate?: string;
  notes?: string;
  website?: string; // Honeypot field
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

export default async (request: Request): Promise<Response> => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Method not allowed.",
      }),
      {
        status: 405,
        headers,
      }
    );
  }

  try {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.error("Gmail environment variables are missing.");

      return new Response(
        JSON.stringify({
          success: false,
          message: "Email service is not configured.",
        }),
        {
          status: 500,
          headers,
        }
      );
    }

    const order: OrderData = await request.json();

    /*
     * Basic spam protection.
     * Add a hidden field named "website" to each form.
     * Real customers leave it blank; many bots fill it in.
     */
    if (order.website) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Order received.",
        }),
        {
          status: 200,
          headers,
        }
      );
    }

    const orderType =
      typeof order.orderType === "string" && order.orderType.trim()
        ? order.orderType.trim()
        : "Farm";

    const customerName =
      typeof order.customerName === "string" && order.customerName.trim()
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

    const orderRows = Object.entries(order)
      .filter(([key, value]) => {
        if (ignoredFields.has(key)) return false;
        if (value === undefined || value === null || value === "") return false;
        return true;
      })
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

    const subject = `New ${orderType} Order from ${customerName}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
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
        ...Object.entries(order)
          .filter(([key, value]) => {
            if (ignoredFields.has(key)) return false;
            if (value === undefined || value === null || value === "") {
              return false;
            }

            return true;
          })
          .map(
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
                      You can reply directly to this email to contact
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your order was submitted successfully.",
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("Order email error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message:
          "We could not submit your order. Please try again or contact Eggsistential Farms directly.",
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};
